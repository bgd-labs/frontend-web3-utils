import { ConnectArgs } from '@wagmi/core';
import { produce } from 'immer';
import { Chain, PublicClient, WalletClient } from 'viem';
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
  account: string;
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
  connectWallet: (
    connect: (args?: Partial<ConnectArgs> | undefined) => void,
    walletType: WalletType,
    chainID?: number,
  ) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  walletActivating: boolean;
  walletConnectionError: string;
  resetWalletConnectionError: () => void;
  initDefaultWallet: () => Promise<void>;
  setActiveWallet: (wallet: Wallet) => Promise<void>;
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
  getChainParameters,
}: {
  walletConnected: (wallet: Wallet) => void; // TODO: why all of them here hardcoded
  getChainParameters: (chainId: number) => Chain;
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
        // TODO: need fix
        // await get().connectWallet(lastConnectedWallet);
      }
    },
    connectWallet: async (connect, walletType, txChainID) => {
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
          console.log('connector in store', connector);
          connect({ connector, chainId: chainID });

          // switch (walletType) {
          //   case 'Coinbase':
          //     await connector.connect({ chainId: chainID });
          //     break;
          //   case 'Metamask':
          //     await connector.connect({
          //       chainId:
          //         typeof chainID !== 'undefined'
          //           ? getChainParameters(chainID).id
          //           : undefined,
          //     });
          //     break;
          //   case 'WalletConnect':
          //     await connector.connect({ chainId: chainID });
          //     break;
          //   case 'GnosisSafe':
          //     await connector.connect({ chainId: chainID });
          //     break;
          // }
          setLocalStorageWallet(walletType);
          get().updateEthAdapter(walletType === 'GnosisSafe');
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
          await activeConnector.disconnect();
        }
        // await activeConnector?.resetState(); TODO: need check
        set({ activeWallet: undefined });
      }
      deleteLocalStorageWallet();
      clearWalletConnectLocalStorage();
    },
    checkIsContractWallet: async (wallet) => {
      const account = wallet.account;
      const walletRecord = get().isContractWalletRecord[account];
      if (walletRecord !== undefined) {
        return walletRecord;
      }
      // TODO: need fix
      // const codeOfWalletAddress = await wallet.walletClient.getCode(
      //   wallet.accounts[0],
      // );
      const codeOfWalletAddress: string = '';
      const isContractWallet = codeOfWalletAddress !== '0x';
      set((state) =>
        produce(state, (draft) => {
          draft.isContractWalletRecord[account] = isContractWallet;
        }),
      );
      return isContractWallet;
    },
    /**
     * setActiveWallet is separate from connectWallet for a reason, after metaMask.activate()
     * only provider is available in the returned type, but we also need accounts and chainID which for some reason
     * is impossible to pull from .provider() still not the best approach, and I'm looking to find proper way to handle it
     */
    setActiveWallet: async (wallet) => {
      if (wallet.chainId !== undefined) {
        get().setClient(wallet.chainId, wallet.client);
      }
      console.log('activeWallet when set', wallet);
      // TODO: need fix
      // const isContractAddress = await get().checkIsContractWallet(wallet);
      set({
        activeWallet: {
          ...wallet,
          // isContractAddress: isContractAddress,
          isContractAddress: false,
        },
      });
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        walletConnected(activeWallet);
      }
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
