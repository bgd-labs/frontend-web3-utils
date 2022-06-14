import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask/dist";
import { WalletConnect } from "@web3-react/walletconnect";
import { providers } from "ethers";
import { StoreSlice } from "../../types/store";
import { LocalStorageKeys } from "../../utils/localStorage";
import { ImpersonatedConnector } from "../connectors/impersonatedConnector";

export type WalletType =
  | "Metamask"
  | "WalletConnect"
  | "Coinbase"
  | "Impersonated";

export const desiredChainID = 1;

export interface Wallet {
  walletType: WalletType;
  accounts: string[];
  chainId: number | undefined;
  provider: providers.JsonRpcProvider;
  signer: providers.JsonRpcSigner;
  // isActive is added, because Wallet can be connected but not active, i.e. wrong network
  isActive: boolean;
}

export type Web3Slice = {
  activeWallet: Wallet | undefined;
  getActiveAddress: () => string | undefined;
  connectWallet: (walletType: WalletType) => Promise<void>;
  disconnectActiveWallet: () => Promise<void>;
  walletActivating: boolean;
  initDefaultWallet: () => Promise<void>;
  setActiveWallet: (wallet: Omit<Wallet, "signer">) => void;
  changeActiveWalletChainId: (chainId: number) => void;
  _impersonatedAddress: string | undefined;
};

export function createWeb3Slice({
  walletConnected,
  metaMask,
  coinbaseWallet,
  walletConnect,
  impersonatedConnector,
}: {
  walletConnected: (wallet: Wallet) => void;
  metaMask: MetaMask | undefined;
  coinbaseWallet: CoinbaseWallet | undefined;
  walletConnect: WalletConnect | undefined;
  impersonatedConnector: ImpersonatedConnector | undefined;
}): StoreSlice<Web3Slice> {
  return (set, get) => ({
    activeWallet: undefined,
    walletActivating: false,
    _impersonatedAddress: undefined,
    initDefaultWallet: async () => {
      const lastConnectedWallet = localStorage.getItem(
        LocalStorageKeys.LastConnectedWallet
      ) as WalletType | undefined;
      try {
        const impersonatedAddress = get()._impersonatedAddress;

        if (lastConnectedWallet === "Metamask" && metaMask) {
          await metaMask.connectEagerly();
        } else if (lastConnectedWallet == "Coinbase" && coinbaseWallet) {
          await coinbaseWallet.connectEagerly();
        } else if (lastConnectedWallet === "WalletConnect" && walletConnect) {
          await walletConnect.connectEagerly();
        } else if (
          lastConnectedWallet === "Impersonated" &&
          impersonatedConnector &&
          impersonatedAddress
        ) {
          await impersonatedConnector.activate(impersonatedAddress);
        }
      } catch (e) {
        // TODO: handle eager connect error
        console.log(e);
      }
    },
    connectWallet: async (walletType: WalletType) => {
      get().disconnectActiveWallet();
      const impersonatedAddress = get()._impersonatedAddress
      try {
        // if (walletType === "Metamask" && metaMask) {
        //   await metaMask.activate(getAddChainParameters(desiredChainID));
        //   setLocalStorageWallet("Metamask");
        // } else if (walletType === "Coinbase" && coinbaseWallet) {
        //   await coinbaseWallet.activate(getAddChainParameters(desiredChainID));
        //   setLocalStorageWallet("Coinbase");
        // } else if (walletType === "WalletConnect" && walletConnect) {
        //   await walletConnect.activate(desiredChainID);
        //   setLocalStorageWallet("WalletConnect");
        // } else if (walletType === "Impersonated" && impersonatedConnector && impersonatedAddress) {
        //   await impersonatedConnector.activate(impersonatedAddress);
        //   setLocalStorageWallet("Impersonated");
        // }
      } catch (e) {
        // TODO: handle connect error
        console.log(e);
      }
    },
    disconnectActiveWallet: async () => {
      // const activeWallet = get().activeWallet;
      // if (activeWallet) {
      //   if (activeWallet.walletType == "Metamask") {
      //     try {
      //       await metaMask.deactivate();
      //     } catch (e) {
      //       // TODO: notify user
      //       console.log(e);
      //     }
      //   } else if (activeWallet.walletType === "Coinbase") {
      //     try {
      //       await coinbaseWallet.deactivate();
      //     } catch (e) {
      //       // TODO: notify user
      //       console.log(e);
      //     }
      //   } else if (activeWallet.walletType == "WalletConnect") {
      //     await walletConnect.deactivate();
      //   }
      //   deleteLocalStorageWallet();
      //   set({ activeWallet: undefined });
      // }
    },
    /**
     * setActiveWallet is separate from connectWallet for a reason, after metaMask.activate()
     * only provider is available in the returned type, but we also need accounts and chainID which for some reason
     * is impossible to pull from .provider() still not the best approach and I'm looking to find proper way to handle it
     */
    setActiveWallet: (wallet: Omit<Wallet, "signer">) => {
      // const providerSigner =
      //   wallet.walletType == "Impersonated"
      //     ? wallet.provider.getSigner(get()._impersonatedAddress)
      //     : wallet.provider.getSigner(0);
      // set({
      //   activeWallet: {
      //     ...wallet,
      //     signer: providerSigner,
      //   },
      // });
      // const activeWallet = get().activeWallet
      // if (activeWallet) {
      //   get().walletConnectedCallback(activeWallet)
      // },
    },
    changeActiveWalletChainId: (chainId: number) => {
      // set((state) =>
      //   produce(state, (draft) => {
      //     if (draft.activeWallet) {
      //       draft.activeWallet.chainId = chainId;
      //     }
      //   })
      // );
    },

    getActiveAddress: () => {
      const activeWallet = get().activeWallet;
      if (activeWallet && activeWallet.accounts) {
        return activeWallet.accounts[0];
      }
    },
  });
}
