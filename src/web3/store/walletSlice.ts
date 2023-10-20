import {
  connect,
  disconnect,
  getAccount,
  getNetwork,
  getPublicClient,
  getWalletClient,
} from '@wagmi/core';
import { produce } from 'immer';
import { Hex, PublicClient, WalletClient } from 'viem';
import { mainnet } from 'viem/chains';

import { StoreSlice } from '../../types/store';
import {
  clearWalletConnectLocalStorage,
  deleteLocalStorageWallet,
  LocalStorageKeys,
  setLocalStorageWallet,
} from '../../utils/localStorage';
import { ConnectorType, getConnectorName, WalletType } from '../connectors';
import { TransactionsSliceBaseType } from './transactionsSlice';

export interface Wallet {
  walletType: WalletType;
  account: Hex;
  chainId?: number;
  client: PublicClient;
  walletClient: WalletClient;
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
  // isContractAddress is added, to check if wallet address is contract
  isContractAddress: boolean;
}

export type IWalletSlice = {
  isContractWalletRecord: Record<string, boolean>;
  activeWallet?: Wallet;
  getActiveAddress: () => string | undefined;
  connectWallet: (walletType: WalletType, chainID?: number) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  walletActivating: boolean;
  walletConnectionError: string;
  resetWalletConnectionError: () => void;
  initDefaultWallet: () => Promise<void>;
  changeActiveWalletChainId: (chainId?: number) => void;
  checkAndSwitchNetwork: (chainId?: number) => Promise<void>;
  connectors: ConnectorType[];
  setConnectors: (connectors: ConnectorType[]) => void;
  _impersonatedAddress?: string;
  setImpersonatedAddress: (address: string) => void;
  checkIsContractWallet: (
    wallet: Omit<Wallet, 'walletClient'>,
  ) => Promise<boolean>;
};

export function createWalletSlice({
  walletConnected,
}: {
  walletConnected: (wallet: Wallet) => void; // TODO: why all of them here hardcoded
}): StoreSlice<IWalletSlice, TransactionsSliceBaseType> {
  return (set, get) => ({
    isContractWalletRecord: {},
    walletActivating: false,
    walletConnectionError: '',
    connectors: [],
    setConnectors: async (connectors) => {
      if (get().connectors.length !== connectors.length) {
        set(() => ({ connectors }));
        await get().initDefaultWallet();
        get().initTxPool();
      }
    },
    initDefaultWallet: async () => {
      const lastConnectedWallet = localStorage.getItem(
        LocalStorageKeys.LastConnectedWallet,
      ) as WalletType | undefined;

      if (lastConnectedWallet) {
        await get().connectWallet(lastConnectedWallet);
      }
    },

    connectWallet: async (walletType, txChainID) => {
      let chainID = txChainID;

      const activeWallet = get().activeWallet;

      if (
        typeof txChainID === 'undefined' &&
        activeWallet &&
        activeWallet.chainId
      ) {
        if (activeWallet.chainId !== chainID) {
          chainID = activeWallet.chainId;
        }
      }

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
          await connect({ connector, chainId: chainID });
          setLocalStorageWallet(walletType);
          get().updateEthAdapter(walletType === 'GnosisSafe');

          const account = getAccount();
          const network = getNetwork();
          if (
            account &&
            account.isConnected &&
            account.address &&
            network.chain
          ) {
            const client = getPublicClient({ chainId: network.chain.id });
            const walletClient = await getWalletClient({
              chainId: network.chain.id,
            });

            if (client && walletClient) {
              const wallet = {
                walletType,
                account: account.address,
                chainId: network.chain.id,
                client,
                walletClient,
                isActive: account.isConnected,
                isContractAddress: false,
              };

              const isContractAddress =
                await get().checkIsContractWallet(wallet);

              set({
                activeWallet: {
                  ...wallet,
                  isContractAddress: isContractAddress,
                },
              });

              walletConnected(wallet);
            }
          }
        }
      } catch (e) {
        if (e instanceof Error) {
          let errorMessage = e.message ? e.message.toString() : e.toString();
          if (errorMessage === 'MetaMask not installed') {
            // TODO: need check
            errorMessage = 'Browser wallet not installed';
          }

          set({
            walletConnectionError: errorMessage,
          });
        }
        console.error(e);
      }
      set({ walletActivating: false });
    },
    checkAndSwitchNetwork: async (chainID) => {
      const activeWallet = get().activeWallet;
      if (
        activeWallet &&
        activeWallet.chainId &&
        activeWallet.chainId !== chainID
      ) {
        await activeWallet.walletClient.switchChain({
          id: chainID || mainnet.id,
        });
      }
    },
    disconnectActiveWallet: async () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        const activeConnector = get().connectors.find(
          (connector) =>
            getConnectorName(connector) === activeWallet.walletType,
        );
        if (activeConnector?.disconnect) {
          await disconnect();
        }
        set({ activeWallet: undefined });
      }
      // TODO: need fix
      deleteLocalStorageWallet();
      clearWalletConnectLocalStorage();
    },
    checkIsContractWallet: async (wallet) => {
      const account = wallet.account;
      const walletRecord = get().isContractWalletRecord[account];
      if (walletRecord !== undefined) {
        return walletRecord;
      }
      const codeOfWalletAddress = await wallet.client.getBytecode({
        address: wallet.account,
      });
      const isContractWallet = codeOfWalletAddress !== '0x';
      set((state) =>
        produce(state, (draft) => {
          draft.isContractWalletRecord[account] = isContractWallet;
        }),
      );
      return isContractWallet;
    },

    changeActiveWalletChainId: (chainId) => {
      if (chainId !== undefined) {
        set((state) =>
          produce(state, (draft) => {
            if (draft.activeWallet) {
              draft.activeWallet.chainId = chainId;
            }
          }),
        );
      }
    },
    getActiveAddress: () => {
      const activeWallet = get().activeWallet;
      if (activeWallet && activeWallet.account) {
        return activeWallet.account;
      }
      return undefined;
    },
    setImpersonatedAddress: (address) => {
      set({ _impersonatedAddress: address });
    },
    resetWalletConnectionError: () => {
      set({ walletConnectionError: '' });
    },
  });
}
