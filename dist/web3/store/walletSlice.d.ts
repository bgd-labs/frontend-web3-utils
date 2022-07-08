import type { AddEthereumChainParameter, Connector } from "@web3-react/types";
import { providers } from "ethers";
import { StoreSlice } from "../../types/store";
import { WalletType } from '../connectors';
export interface Wallet {
    walletType: WalletType;
    accounts: string[];
    chainId?: number;
    provider: providers.JsonRpcProvider;
    signer: providers.JsonRpcSigner;
    isActive: boolean;
}
export declare type Web3Slice = {
    activeWallet?: Wallet;
    getActiveAddress: () => string | undefined;
    connectWallet: (walletType: WalletType) => Promise<void>;
    disconnectActiveWallet: () => Promise<void>;
    walletActivating: boolean;
    initDefaultWallet: () => Promise<void>;
    setActiveWallet: (wallet: Omit<Wallet, "signer">) => void;
    changeActiveWalletChainId: (chainId: number) => void;
    checkAndSwitchNetwork: () => Promise<void>;
    connectors: Connector[];
    setConnectors: (connectors: Connector[]) => void;
    _impersonatedAddress?: string;
};
export declare function createWeb3Slice({ walletConnected, getAddChainParameters, desiredChainID, }: {
    walletConnected: (wallet: Wallet) => void;
    getAddChainParameters: (chainId: number) => AddEthereumChainParameter | number;
    desiredChainID?: number;
}): StoreSlice<Web3Slice>;
