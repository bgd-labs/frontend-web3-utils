import type { AddEthereumChainParameter, Connector } from '@web3-react/types';
import { providers } from 'ethers';
import { produce } from 'immer';

import { StoreSlice } from '../../types/store';
import {
  deleteLocalStorageWallet,
  deleteLocalStorageWalletChainId,
  LocalStorageKeys,
  setLocalStorageWallet,
  setLocalStorageWalletChainId,
} from '../../utils/localStorage';
import { StaticJsonRpcBatchProvider } from '../../utils/StaticJsonRpcBatchProvider';
import { getConnectorName, WalletType } from '../connectors';
import { TransactionsSliceBaseType } from './transactionsSlice';

export interface Wallet {
  walletType: WalletType;
  accounts: string[];
  chainId?: number;
  provider: providers.JsonRpcProvider;
  signer: providers.JsonRpcSigner;
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
  // isContractAddress is added, to check if wallet address is contract
  isContractAddress: boolean;
}

export type IWalletSlice = {
  activeWallet?: Wallet;
  getActiveAddress: () => string | undefined;
  connectWallet: (walletType: WalletType, chainID?: number) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  walletActivating: boolean;
  walletConnectionError: string;
  initDefaultWallet: () => Promise<void>;
  setActiveWallet: (wallet: Omit<Wallet, 'signer'>) => Promise<void>;
  changeActiveWalletChainId: (chainId: number) => void;
  checkAndSwitchNetwork: (chainId?: number) => Promise<void>;
  connectors: Connector[];
  setConnectors: (connectors: Connector[]) => void;
  _impersonatedAddress?: string;
  setImpersonatedAddress: (address: string) => void;
};

export function createWalletSlice({
  walletConnected,
  getChainParameters,
  desiredChainID = 1,
}: {
  walletConnected: (wallet: Wallet) => void; // TODO: why all of them here hardcoded
  getChainParameters: (chainId: number) => AddEthereumChainParameter | number;
  desiredChainID?: number;
}): StoreSlice<IWalletSlice, TransactionsSliceBaseType> {
  return (set, get) => ({
    walletActivating: false,
    walletConnectionError: '',
    connectors: [],
    setConnectors: async (connectors) => {
      set(() => ({ connectors }));
      await get().initDefaultWallet();
      get().initTxPool();
    },
    initDefaultWallet: async () => {
      const lastConnectedWallet = localStorage.getItem(
        LocalStorageKeys.LastConnectedWallet
      ) as WalletType | undefined;
      const lastConnectedChainId = localStorage.getItem(
        LocalStorageKeys.LastConnectedChainId
      ) as string | undefined;

      if (lastConnectedWallet && lastConnectedChainId) {
        await get().connectWallet(lastConnectedWallet, +lastConnectedChainId);
      }
    },
    connectWallet: async (walletType: WalletType, txChainID?: number) => {
      let chainID =
        typeof txChainID != 'undefined' ? txChainID : desiredChainID;

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

      const impersonatedAddress = get()._impersonatedAddress;
      set({ walletActivating: true });
      set({ walletConnectionError: '' });
      const connector = get().connectors.find(
        (connector) => getConnectorName(connector) === walletType
      );
      try {
        if (connector) {
          switch (walletType) {
            case 'Impersonated':
              if (impersonatedAddress) {
                await connector.activate({
                  address: impersonatedAddress,
                  chainId: chainID,
                });
              }
              break;
            case 'Coinbase':
            case 'Metamask':
              await connector.activate(getChainParameters(chainID));
              break;
            case 'WalletConnect':
              await connector.activate(chainID);
              break;
            case 'GnosisSafe':
              await connector.activate(chainID);
              break;
          }
          setLocalStorageWallet(walletType);
          setLocalStorageWalletChainId(chainID.toString());
        }
      } catch (e) {
        if (e instanceof Error) {
          set({
            walletConnectionError: e.message
              ? e.message.toString()
              : e.toString(),
          });
        }
        console.error(e);
      }
      set({ walletActivating: false });
    },
    checkAndSwitchNetwork: async (chainID?: number) => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        await get().connectWallet(activeWallet.walletType, chainID);
      }
    },
    disconnectActiveWallet: async () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        const activeConnector = get().connectors.find(
          (connector) => getConnectorName(connector) == activeWallet.walletType
        );

        if (activeConnector?.deactivate) {
          await activeConnector.deactivate();

          localStorage.removeItem('walletconnect');
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:version'
          );
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:session:id'
          );
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:session:secret'
          );
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:session:linked'
          );
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:AppVersion'
          );
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:Addresses'
          );
          localStorage.removeItem(
            '-walletlink:https://www.walletlink.org:walletUsername'
          );
        }
        await activeConnector?.resetState();
        set({ activeWallet: undefined });
      }
      deleteLocalStorageWallet();
      deleteLocalStorageWalletChainId();
    },
    /**
     * setActiveWallet is separate from connectWallet for a reason, after metaMask.activate()
     * only provider is available in the returned type, but we also need accounts and chainID which for some reason
     * is impossible to pull from .provider() still not the best approach, and I'm looking to find proper way to handle it
     */
    setActiveWallet: async (wallet: Omit<Wallet, 'signer'>) => {
      const providerSigner =
        wallet.walletType == 'Impersonated'
          ? wallet.provider.getSigner(get()._impersonatedAddress)
          : wallet.provider.getSigner(0);

      if (wallet.chainId !== undefined) {
        get().setProvider(
          wallet.chainId,
          wallet.provider as StaticJsonRpcBatchProvider
        );
      }

      const codeOfWalletAddress = await wallet.provider.getCode(
        wallet.accounts[0]
      );

      set({
        activeWallet: {
          ...wallet,
          isContractAddress: codeOfWalletAddress !== '0x',
          signer: providerSigner,
        },
      });
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        walletConnected(activeWallet);
      }
    },
    changeActiveWalletChainId: (chainId: number) => {
      set((state) =>
        produce(state, (draft) => {
          if (draft.activeWallet) {
            draft.activeWallet.chainId = chainId;
          }
        })
      );
      setLocalStorageWalletChainId(chainId.toString());
    },

    getActiveAddress: () => {
      const activeWallet = get().activeWallet;
      if (activeWallet && activeWallet.accounts) {
        return activeWallet.accounts[0];
      }
      return undefined;
    },

    setImpersonatedAddress: (address) => {
      set({ _impersonatedAddress: address });
    },
  });
}
