// TODO: getChainByChainId

import {
  Config,
  connect,
  disconnect,
  getAccount,
  GetAccountReturnType,
  getConnectorClient,
  getPublicClient,
  switchChain,
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
  // should set only once and not change from zustand[set]
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
      if (!get().wagmiConfig) {
        set({ wagmiConfig: config });
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
      if (
        config &&
        config.chains.some((chain) => chain.id !== wallet.chainId)
      ) {
        // TODO: need take a look
        config.setState((state) => ({
          ...state,
          chains: state.current
            ? [getChainByChainId(state.chainId), ...config.chains]
            : [],
        }));
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

      if (wallet.isActive && config && wallet.chain) {
        set({ isActiveWalletSetting: true });

        const client = await getConnectorClient(config);
        const walletClient = client.extend(walletActions);
        const publicClient = getPublicClientLocal(config, wallet.chain);

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
        }

        set({ isActiveWalletSetting: false });
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

      if (config) {
        const connector = config.connectors.find(
          (connector) => connector.type === walletType,
        );

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
                chainId: chainId || mainnet.id,
                chain:
                  account.chain || getChainByChainId(chainId || mainnet.id),
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
          console.error('Error when try to connect wallet:', e);
        }
      }

      set({ walletActivating: false });
    },
    disconnectActiveWallet: async () => {
      const config = get().wagmiConfig;
      if (!!config?.state.current) {
        await disconnect(config);
        set({ activeWallet: undefined });
        deleteLocalStorageWallet();
        clearWalletLinkLocalStorage();
        clearWalletConnectV2LocalStorage();
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
          await switchChain(config, { chainId });
        } catch (e) {
          try {
            const chain = getChainByChainId(chainId);
            if (!!chain) {
              await activeWallet.walletClient.addChain({
                chain,
              });
              await switchChain(config, { chainId });
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
        // update wagmi config state chain id
        config.setState((state) => ({
          ...state,
          chainId: state.current
            ? account?.chainId || get().defaultChainId || mainnet.id
            : mainnet.id,
        }));
      }

      if (
        // when account info update
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
          chainId: account.chainId || mainnet.id,
          chain:
            activeWallet.chain?.id === account.chainId
              ? activeWallet.chain
              : !!account.chain
                ? account.chain
                : getChainByChainId(account.chainId || mainnet.id),
          isActive: activeWallet.isActive,
          isContractAddress: activeWallet.isContractAddress,
        });
        set({ isActiveWalletAccountChanging: false });
        // on initial connection
      } else if (
        account &&
        account.address &&
        !activeWallet &&
        config &&
        !get().isActiveWalletAccountChanging
      ) {
        console.log('changed acc on initial', account);

        set({ isActiveWalletAccountChanging: true });
        await get().setActiveWallet({
          walletType: config.state.connections.get(config.state.current || '')
            ?.connector.type as WalletType,
          address: account.address,
          chainId: account.chainId || mainnet.id,
          chain:
            account.chain || getChainByChainId(account.chainId || mainnet.id),
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
