import {
  connect,
  disconnect,
  getAccount,
  GetAccountResult,
  getNetwork,
  getPublicClient,
  getWalletClient,
  PublicClient,
  WalletClient,
} from '@wagmi/core';
import { produce } from 'immer';
import { Account, Chain, Hex, isAddress } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { StoreSlice } from '../../types/store';
import {
  clearWalletConnectV2LocalStorage,
  clearWalletLinkLocalStorage,
  deleteLocalStorageWallet,
  LocalStorageKeys,
  setLocalStorageWallet,
} from '../../utils/localStorage';
import { ConnectorType, getConnectorName, WalletType } from '../connectors';
import { ImpersonatedConnector } from '../connectors/ImpersonatedConnector';
import { TransactionsSliceBaseType } from './transactionsSlice';

export interface Wallet {
  walletType: WalletType;
  address: Hex;
  chain?: Chain;
  client: PublicClient;
  walletClient: WalletClient;
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
  // isContractAddress is added, to check if wallet address is contract (mostly fo safe)
  isContractAddress: boolean;
}

export type IWalletSlice = {
  connectors: ConnectorType[];
  setConnectors: (connectors: ConnectorType[]) => void;

  defaultChainId: number;
  setDefaultChainId: (chainId: number) => void;

  initDefaultWallet: () => Promise<void>;

  isActiveWalletSetting: boolean;
  activeWallet?: Wallet;
  setActiveWallet: (
    wallet: Omit<Wallet, 'walletClient' | 'client'>,
  ) => Promise<void>;

  walletActivating: boolean;
  walletConnectionError: string;
  connectWallet: (walletType: WalletType, chainId?: number) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  resetWalletConnectionError: () => void;
  checkAndSwitchNetwork: (chainId?: number) => Promise<void>;

  isActiveWalletAccountChanging: boolean;
  changeActiveWalletAccount: (account?: GetAccountResult) => Promise<void>;
  isActiveWalletChainChanging: boolean;
  changeActiveWalletChain: (chain?: Chain) => Promise<void>;

  impersonated?: {
    account?: Account;
    address?: Hex;
    isViewOnly?: boolean;
  };
  setImpersonated: (privateKeyOrAddress: string) => void;

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
    connectors: [],
    setConnectors: async (connectors) => {
      if (get().connectors.length !== connectors.length) {
        set(() => ({ connectors }));
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
      if (wallet.isActive) {
        if (wallet.chain) {
          set({ isActiveWalletSetting: true });
          const client = getPublicClient({ chainId: wallet.chain.id });
          const walletClient = await getWalletClient({
            chainId: wallet.chain.id,
          });

          if (client && walletClient) {
            const walletWithClients = {
              ...wallet,
              walletClient,
              client,
            };

            const isContractAddress =
              await get().checkIsContractWallet(walletWithClients);
            const activeWallet = { ...walletWithClients, isContractAddress };

            set({ activeWallet });
            get().setClient(wallet.chain.id, client);
            walletConnected(activeWallet);
            set({ isActiveWalletSetting: false });
          }
        }
      }
    },

    walletActivating: false,
    walletConnectionError: '',
    connectWallet: async (walletType, chainId) => {
      clearWalletLinkLocalStorage();
      clearWalletConnectV2LocalStorage();

      if (get().activeWallet?.walletType !== walletType) {
        await get().disconnectActiveWallet();
      }

      set({ walletActivating: true });
      set({ walletConnectionError: '' });

      const connector = get().connectors.find(
        (connector) => getConnectorName(connector) === walletType,
      );

      try {
        if (connector) {
          if (connector instanceof ImpersonatedConnector) {
            const impersonated = get().impersonated;
            if (impersonated?.isViewOnly) {
              connector.setAccountAddress(impersonated.address);
            } else if (impersonated?.account) {
              connector.setAccount(impersonated.account);
            }
            await connect({ connector, chainId });
          } else {
            if (connector instanceof WalletConnectConnector) {
              await connect({ connector, chainId: get().defaultChainId });
            } else {
              await connect({ connector });
            }
            setLocalStorageWallet(walletType);
          }

          const account = getAccount();
          const network = getNetwork();
          if (account?.isConnected && account?.address && network?.chain) {
            await get().setActiveWallet({
              walletType,
              address: account.address,
              chain: network.chain,
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
      set({ walletActivating: false });
    },
    disconnectActiveWallet: async () => {
      await disconnect();
      set({ activeWallet: undefined });
      deleteLocalStorageWallet();
      clearWalletLinkLocalStorage();
      clearWalletConnectV2LocalStorage();
    },
    resetWalletConnectionError: () => {
      set({ walletConnectionError: '' });
    },
    checkAndSwitchNetwork: async (chainId) => {
      const activeWallet = get().activeWallet;
      if (chainId && activeWallet && activeWallet?.chain?.id !== chainId) {
        set({ isActiveWalletSetting: true });
        await activeWallet.walletClient.switchChain({
          id: chainId,
        });
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
        activeWallet.address !== account.address &&
        !get().isActiveWalletAccountChanging
      ) {
        set({ isActiveWalletAccountChanging: true });
        await get().setActiveWallet({
          walletType: activeWallet.walletType,
          address: account.address,
          isActive: activeWallet.isActive,
          isContractAddress: activeWallet.isContractAddress,
          chain: activeWallet.chain,
        });
        set({ isActiveWalletAccountChanging: false });
      }
    },
    isActiveWalletChainChanging: false,
    changeActiveWalletChain: async (chain) => {
      const activeWallet = get().activeWallet;
      if (
        !!chain &&
        activeWallet &&
        activeWallet.isActive &&
        activeWallet?.chain?.id !== chain.id &&
        !get().isActiveWalletChainChanging
      ) {
        set({ isActiveWalletChainChanging: true });
        await get().setActiveWallet({
          walletType: activeWallet.walletType,
          address: activeWallet.address,
          isActive: activeWallet.isActive,
          isContractAddress: activeWallet.isContractAddress,
          chain: chain,
        });
        set({ isActiveWalletChainChanging: false });
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

    isContractWalletRecord: {},
    checkIsContractWallet: async (wallet) => {
      const address = wallet.address;
      const walletRecord = get().isContractWalletRecord[address];
      if (walletRecord !== undefined) {
        return walletRecord;
      }
      const codeOfWalletAddress = await wallet.client.getBytecode({
        address: wallet.address,
      });
      const isContractWallet = !!codeOfWalletAddress;
      set((state) =>
        produce(state, (draft) => {
          draft.isContractWalletRecord[address] = isContractWallet;
        }),
      );
      return isContractWallet;
    },
  });
}
