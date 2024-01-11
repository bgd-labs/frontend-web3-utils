import {
  Config,
  connect,
  disconnect,
  getAccount,
  GetAccountReturnType,
  getPublicClient,
  getWalletClient,
} from '@wagmi/core';
import { produce } from 'immer';
import {
  Account,
  Chain,
  Hex,
  isAddress,
  PublicClient,
  WalletClient,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

import { StoreSlice } from '../../types/store';
import { getChainByChainId } from '../../utils/getChainByChainId';
import {
  clearWalletConnectV2LocalStorage,
  clearWalletLinkLocalStorage,
  deleteLocalStorageWallet,
  LocalStorageKeys,
  setLocalStorageWallet,
} from '../../utils/localStorage';
import { WalletType } from '../connectors';
import { TransactionsSliceBaseType } from './transactionsSlice';

export interface Wallet {
  walletType: WalletType;
  address: Hex;
  chain?: Chain;
  publicClient?: PublicClient;
  walletClient?: WalletClient;
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
  // isContractAddress is added, to check if wallet address is contract (mostly fo safe)
  isContractAddress: boolean;
}

export type IWalletSlice = {
  wagmiConfig?: Config;
  setWagmiConfig: (config: Config) => Promise<void>;

  defaultChainId: number;
  setDefaultChainId: (chainId: number) => void;

  initDefaultWallet: () => Promise<void>;

  isActiveWalletSetting: boolean;
  activeWallet?: Wallet;
  setActiveWallet: (
    wallet: Omit<Wallet, 'publicClient' | 'walletClient'>,
  ) => Promise<void>;

  walletActivating: boolean;
  walletConnectionError: string;
  connectWallet: (walletType: WalletType, chainId?: number) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  resetWalletConnectionError: () => void;
  checkAndSwitchNetwork: (chainId?: number) => Promise<void>;

  isActiveWalletAccountChanging: boolean;
  changeActiveWalletAccount: (account?: GetAccountReturnType) => Promise<void>;

  impersonated?: {
    account?: Account;
    address?: Hex;
    isViewOnly?: boolean;
  };
  setImpersonated: (privateKeyOrAddress: string) => void;
  getImpersonatedAddress: () => Hex | undefined;

  isContractWalletRecord: Record<string, boolean>;
  checkIsContractWallet: (
    wallet: Omit<Wallet, 'walletClient'>,
  ) => Promise<boolean>;
};

export function createWalletSlice({
  walletConnected,
}: {
  walletConnected: (wallet: Wallet) => void;
}): StoreSlice<IWalletSlice, TransactionsSliceBaseType> {
  return (set, get) => ({
    setWagmiConfig: async (config) => {
      set({ wagmiConfig: config });
      if (get().wagmiConfig?.connectors.length !== config.connectors.length) {
        await get().initDefaultWallet();
        get().initTxPool();
      }
    },

    defaultChainId: mainnet.id,
    setDefaultChainId: (chainId) => {
      set({ defaultChainId: chainId });
    },

    initDefaultWallet: async () => {
      const lastConnectedWallet = localStorage.getItem(
        LocalStorageKeys.LastConnectedWallet,
      ) as WalletType | undefined;

      if (lastConnectedWallet) {
        await get().connectWallet(lastConnectedWallet);
      }
    },

    isActiveWalletSetting: false,
    setActiveWallet: async (wallet) => {
      const config = get().wagmiConfig;

      if (wallet.isActive && config) {
        if (wallet.chain) {
          set({ isActiveWalletSetting: true });
          const publicClient = getPublicClient(config);
          const walletClient = await getWalletClient(config);

          if (publicClient && walletClient) {
            const walletWithClients = {
              ...wallet,
              publicClient,
              walletClient,
            };

            const isContractAddress =
              await get().checkIsContractWallet(walletWithClients);
            const activeWallet = { ...walletWithClients, isContractAddress };

            set({ activeWallet });
            get().setClient(wallet.chain.id, publicClient);
            walletConnected(activeWallet);
            set({ isActiveWalletSetting: false });
          }
        } else {
          set({ isActiveWalletSetting: true });
          const activeWallet = { ...wallet, isContractAddress: false };
          set({ activeWallet });
          walletConnected(activeWallet);
          set({ isActiveWalletSetting: false });
        }
      }
    },

    walletActivating: false,
    walletConnectionError: '',
    connectWallet: async (walletType, chainId) => {
      const config = get().wagmiConfig;

      clearWalletLinkLocalStorage();
      clearWalletConnectV2LocalStorage();

      if (get().activeWallet?.walletType !== walletType) {
        await get().disconnectActiveWallet();
      }

      set({ walletActivating: true });
      set({ walletConnectionError: '' });

      const connector = get().wagmiConfig?.connectors.find(
        (connector) => connector.type === walletType,
      );

      if (config) {
        try {
          if (connector) {
            if (connector.type === WalletType.Impersonated) {
              await connect(config, {
                connector,
                chainId,
              });
            } else {
              if (connector.type === WalletType.WalletConnect) {
                await connect(config, {
                  connector,
                  chainId: get().defaultChainId,
                });
              } else {
                await connect(config, { connector });
              }
              setLocalStorageWallet(walletType);
            }

            const account = getAccount(config);

            console.log('account in connect wallet', account);

            if (account?.isConnected && account?.address) {
              await get().setActiveWallet({
                walletType,
                address: account.address,
                chain: account.chain || getChainByChainId(chainId || 1),
                isActive: account.isConnected,
                isContractAddress: false,
              });
            }
          }
        } catch (e) {
          if (e instanceof Error) {
            const errorMessage = e.message ? String(e.message) : String(e);
            set({
              walletConnectionError: errorMessage,
            });
          }
          console.error('Wallet connect error', e);
        }
      }

      set({ walletActivating: false });
    },
    disconnectActiveWallet: async () => {
      const config = get().wagmiConfig;
      if (config) {
        const account = getAccount(config);
        if (account.isConnected) {
          await disconnect(config);
          set({ activeWallet: undefined });
          deleteLocalStorageWallet();
          clearWalletLinkLocalStorage();
          clearWalletConnectV2LocalStorage();
        }
      }
    },
    resetWalletConnectionError: () => {
      set({ walletConnectionError: '' });
    },
    checkAndSwitchNetwork: async (chainId) => {
      const activeWallet = get().activeWallet;
      if (
        chainId &&
        activeWallet &&
        activeWallet?.chain?.id !== chainId &&
        activeWallet.walletClient
      ) {
        set({ isActiveWalletSetting: true });
        try {
          await activeWallet.walletClient.switchChain({
            id: chainId,
          });
        } catch (e) {
          try {
            const chain = getChainByChainId(chainId);
            if (!!chain) {
              await activeWallet.walletClient.addChain({
                chain,
              });
              await activeWallet.walletClient.switchChain({
                id: chainId,
              });
            } else {
              console.error(e);
            }
          } catch (error) {
            console.error(error);
            throw new Error(
              "Couldn't switch the network, change the network yourself in your wallet",
            );
          }
        }

        await new Promise((resolve) => {
          function loop() {
            if (!get().isActiveWalletSetting) {
              return resolve(() =>
                console.info('Chain for wallet client changed'),
              );
            }
            setTimeout(loop, 10);
          }
          loop();
        });
      }
    },

    isActiveWalletAccountChanging: false,
    changeActiveWalletAccount: async (account) => {
      const activeWallet = get().activeWallet;
      if (
        account?.address &&
        activeWallet &&
        (activeWallet.address !== account.address ||
          activeWallet.chain?.id !== account.chain?.id) &&
        !get().isActiveWalletAccountChanging
      ) {
        set({ isActiveWalletAccountChanging: true });
        await get().setActiveWallet({
          walletType: activeWallet.walletType,
          address: account.address,
          chain: account.chain,
          isActive: activeWallet.isActive,
          isContractAddress: activeWallet.isContractAddress,
        });
        set({ isActiveWalletAccountChanging: false });
      }
    },

    setImpersonated: (privateKeyOrAddress) => {
      if (isAddress(privateKeyOrAddress)) {
        set({
          impersonated: {
            address: privateKeyOrAddress,
            isViewOnly: true,
          },
        });
      } else {
        set({
          impersonated: {
            account: privateKeyToAccount(`0x${privateKeyOrAddress}`),
            isViewOnly: false,
          },
        });
      }
    },
    getImpersonatedAddress: () => {
      const impersonated = get().impersonated;

      if (impersonated) {
        if (impersonated.isViewOnly) {
          return impersonated.address;
        } else {
          return impersonated.account?.address;
        }
      }

      return;
    },

    isContractWalletRecord: {},
    checkIsContractWallet: async (wallet) => {
      const address = wallet.address;
      const walletRecord = get().isContractWalletRecord[address];
      if (walletRecord !== undefined) {
        return walletRecord;
      }
      if (wallet.publicClient) {
        const codeOfWalletAddress = await wallet.publicClient.getBytecode({
          address: wallet.address,
        });
        const isContractWallet = !!codeOfWalletAddress;
        set((state) =>
          produce(state, (draft) => {
            draft.isContractWalletRecord[address] = isContractWallet;
          }),
        );

        return isContractWallet;
      }
      return false;
    },
  });
}
