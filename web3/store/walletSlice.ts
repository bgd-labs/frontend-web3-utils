import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import type { AddEthereumChainParameter } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { providers } from "ethers";
import { produce } from "immer";

import { StoreSlice } from "../../types/store";
import {
  deleteLocalStorageWallet,
  LocalStorageKeys,
  setLocalStorageWallet,
} from "../../utils/localStorage";
import { ImpersonatedConnector } from "../connectors/impersonatedConnector";

export type WalletType =
  | "Metamask"
  | "WalletConnect"
  | "Coinbase"
  | "Impersonated";

export type ExtendedConnector =
  | { name: "Metamask"; connector: MetaMask }
  | { name: "Coinbase"; connector: CoinbaseWallet }
  | { name: "WalletConnect"; connector: WalletConnect }
  | { name: "Impersonated"; connector: ImpersonatedConnector };

export interface Wallet {
  walletType: WalletType;
  accounts: string[];
  chainId: number | undefined;
  provider: providers.JsonRpcProvider; // TODO: not correct
  signer: providers.JsonRpcSigner; // TODO: not correct, it can be not only JsonRpc
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
}

export type Web3Slice = {
  activeWallet?: Wallet;
  getActiveAddress: () => string | undefined;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  walletActivating: boolean;
  initDefaultWallet: () => Promise<void>;
  setActiveWallet: (wallet: Omit<Wallet, "signer">) => void;
  changeActiveWalletChainId: (chainId: number) => void;
  checkAndSwitchNetwork: () => Promise<void>;
  _impersonatedAddress?: string;
};

export function createWeb3Slice({
  walletConnected,
  connectors,
  getAddChainParameters,
  desiredChainID = 1,
}: {
  walletConnected: (wallet: Wallet) => void; // TODO: why all of them here hardcoded
  connectors: ExtendedConnector[];
  getAddChainParameters: (
    chainId: number
  ) => AddEthereumChainParameter | number;
  desiredChainID?: number;
}): StoreSlice<Web3Slice> {
  return (set, get) => ({
    walletActivating: false,
    initDefaultWallet: async () => {
      const lastConnectedWallet = localStorage.getItem(
        LocalStorageKeys.LastConnectedWallet
      ) as WalletType | undefined;
      if (lastConnectedWallet) {
        await get().connectWallet(lastConnectedWallet);
        await get().checkAndSwitchNetwork();
      }
    },
    connectWallet: async (walletType: WalletType) => {
      if (get().activeWallet?.walletType !== walletType) {
        await get().disconnectActiveWallet();
      }

      const impersonatedAddress = get()._impersonatedAddress;
      set({ walletActivating: true });
      const connector = connectors.find(({ name }) => name === walletType);
      if (connector) {
        switch (connector.name) {
          case "Impersonated":
            if (impersonatedAddress) {
              await connector.connector.activate(impersonatedAddress);
            }
            break;
          case "Coinbase":
          case "Metamask":
            await connector.connector.activate(
              getAddChainParameters(desiredChainID)
            );
            break;
          case "WalletConnect":
            await connector.connector.activate(desiredChainID);
            break;
        }
        setLocalStorageWallet(connector.name);
      }
      set({ walletActivating: false });
    },
    checkAndSwitchNetwork: async () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        await get().connectWallet(activeWallet.walletType);
      }
    },
    disconnectActiveWallet: async () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        const activeConnector = connectors.find(
          ({ name }) => name == activeWallet.walletType
        );

        if (activeConnector?.connector.deactivate) {
          await activeConnector.connector.deactivate();
        }
        await activeConnector?.connector.resetState()
        set({ activeWallet: undefined });
      }
      deleteLocalStorageWallet();
    },
    /**
     * setActiveWallet is separate from connectWallet for a reason, after metaMask.activate()
     * only provider is available in the returned type, but we also need accounts and chainID which for some reason
     * is impossible to pull from .provider() still not the best approach, and I'm looking to find proper way to handle it
     */
    setActiveWallet: (wallet: Omit<Wallet, "signer">) => {
      const providerSigner =
        wallet.walletType == "Impersonated"
          ? wallet.provider.getSigner(get()._impersonatedAddress)
          : wallet.provider.getSigner(0);
      set({
        activeWallet: {
          ...wallet,
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
    },

    getActiveAddress: () => {
      const activeWallet = get().activeWallet;
      if (activeWallet && activeWallet.accounts) {
        return activeWallet.accounts[0];
      }
    },
  });
}
