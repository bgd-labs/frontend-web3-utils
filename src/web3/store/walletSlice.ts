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
import { getConnectorName, WalletType } from '../connectors';

export interface Wallet {
  walletType: WalletType;
  accounts: string[];
  chainId?: number;
  provider: providers.JsonRpcProvider;
  signer: providers.JsonRpcSigner;
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
  isContractAddress: boolean;
}

export type Web3Slice = {
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

export function createWeb3Slice({
  walletConnected,
  getChainParameters,
  desiredChainID = 1,
}: {
  walletConnected: (wallet: Wallet) => void; // TODO: why all of them here hardcoded
  getChainParameters: (chainId: number) => AddEthereumChainParameter | number;
  desiredChainID?: number;
}): StoreSlice<Web3Slice> {
  return (set, get) => ({
    walletActivating: false,
    walletConnectionError: '',
    connectors: [],
    setConnectors: (connectors) => {
      set(() => ({ connectors }));
      void get().initDefaultWallet();
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

      const codeOfAddress = await wallet.provider.getCode(wallet.accounts[0]);

      set({
        activeWallet: {
          ...wallet,
          isContractAddress: codeOfAddress !== '0x',
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
