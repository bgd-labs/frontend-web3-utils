import {
  Config,
  connect,
  disconnect,
  getAccount,
  GetAccountReturnType,
  getConnectorClient,
  getPublicClient,
} from '@wagmi/core';
import { produce } from 'immer';
import {
  Account,
  Chain,
  createPublicClient,
  fallback,
  Hex,
  http,
  isAddress,
  PublicClient,
  walletActions,
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
  chainId: number;
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
      let config = get().wagmiConfig;
      if (
        config &&
        config.chains.every((chain) => chain.id !== wallet.chainId)
      ) {
        config = {
          ...config,
          chains: [
            getChainByChainId(wallet.chainId) || mainnet,
            ...config.chains,
          ],
        };

        set({ wagmiConfig: config });
      }

      const getPublicClientLocal = (localConf: Config, chain: Chain) => {
        let publicClient = undefined;
        try {
          publicClient = getPublicClient(localConf);
        } catch {
          publicClient = createPublicClient({
            batch: {
              multicall: true,
            },
            chain: chain,
            transport: fallback(
              chain.rpcUrls.default.http.map((url) => http(url)),
            ),
          });
        }

        return publicClient;
      };

      const setWallet = async (
        walletData: Omit<Wallet, 'publicClient' | 'walletClient'>,
        publicClient: PublicClient,
        walletClient: WalletClient,
      ) => {
        const walletWithClients = {
          ...walletData,
          publicClient,
          walletClient,
        };

        const isContractAddress =
          await get().checkIsContractWallet(walletWithClients);
        const activeWallet = { ...walletWithClients, isContractAddress };

        set({ activeWallet });

        if (walletData.chain?.id) {
          get().setClient(walletData.chain.id, publicClient);
        }

        walletConnected(activeWallet);
        set({ isActiveWalletSetting: false });
      };

      if (wallet.isActive && config) {
        if (
          wallet.chain &&
          config.chains.some((chain) => chain.id === wallet.chainId)
        ) {
          set({ isActiveWalletSetting: true });
          const client = await getConnectorClient(config);
          const walletClient = client.extend(walletActions);
          const publicClient = getPublicClientLocal(config, wallet.chain);

          if (publicClient && walletClient) {
            await setWallet(wallet, publicClient, walletClient);
          }
        } else {
          set({ isActiveWalletSetting: true });
          let walletData = wallet;

          if (
            walletData.chain &&
            config.chains.some((chain) => chain.id === wallet.chainId)
          ) {
            const client = await getConnectorClient(config);
            const walletClient = client.extend(walletActions);
            const publicClient = getPublicClientLocal(config, walletData.chain);

            if (publicClient && walletClient) {
              await setWallet(walletData, publicClient, walletClient);
            }
          }
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
                chainId: chainId || 1,
                // chain: account.chain || getChainByChainId(chainId || 1),
                chain: account.chain,
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
      const config = get().wagmiConfig;
      const activeWallet = get().activeWallet;
      if (
        config &&
        chainId &&
        activeWallet &&
        activeWallet?.chain?.id !== chainId &&
        activeWallet.walletClient
      ) {
        set({ isActiveWalletSetting: true });
        try {
          // await switchChain(config, { chainId });
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
              // await switchChain(config, { chainId });
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
      const config = get().wagmiConfig;

      if (config) {
        set({
          wagmiConfig: {
            ...config,
            state: {
              ...config.state,
              chainId: account?.chainId || get().defaultChainId || mainnet.id,
            },
          },
        });
      }

      if (
        account?.address &&
        activeWallet &&
        (activeWallet.address !== account.address ||
          activeWallet.chainId !== account.chainId) &&
        !get().isActiveWalletAccountChanging
      ) {
        console.log('changed acc when active wallet', account);

        set({ isActiveWalletAccountChanging: true });
        await get().setActiveWallet({
          walletType: activeWallet.walletType,
          address: account.address,
          chainId: account.chainId || 1,
          chain:
            account.chain || activeWallet.chain === account.chainId
              ? activeWallet.chain
              : getChainByChainId(account.chainId || 1),
          isActive: activeWallet.isActive,
          isContractAddress: activeWallet.isContractAddress,
        });
        set({ isActiveWalletAccountChanging: false });
      } else if (
        account &&
        account.address &&
        !activeWallet &&
        config &&
        !get().isActiveWalletAccountChanging
      ) {
        console.log('changed acc when non active wallet', account);

        set({ isActiveWalletAccountChanging: true });
        await get().setActiveWallet({
          walletType: config.state.connections.get(config.state.current || '')
            ?.connector.type as WalletType,
          address: account.address,
          chainId: account.chainId || 1,
          chain: account.chain || getChainByChainId(account.chainId || 1),
          isActive: true,
          isContractAddress: false,
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
