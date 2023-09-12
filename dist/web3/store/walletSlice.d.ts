import type { AddEthereumChainParameter, Connector } from '@web3-react/types';
import { providers } from 'ethers';
import { StoreSlice } from '../../types/store';
import { WalletType } from '../connectors';
import { TransactionsSliceBaseType } from './transactionsSlice';
export interface Wallet {
    walletType: WalletType;
    accounts: string[];
    chainId?: number;
    provider: providers.JsonRpcProvider;
    signer: providers.JsonRpcSigner;
    isActive: boolean;
    isContractAddress: boolean;
}
export declare type IWalletSlice = {
    isContractWalletRecord: Record<string, boolean>;
    activeWallet?: Wallet;
    getActiveAddress: () => string | undefined;
    connectWallet: (walletType: WalletType, chainID?: number) => Promise<void>;
    disconnectActiveWallet: () => Promise<void>;
    walletActivating: boolean;
    walletConnectionError: string;
    resetWalletConnectionError: () => void;
    initDefaultWallet: () => Promise<void>;
    setActiveWallet: (wallet: Omit<Wallet, 'signer'>) => Promise<void>;
    changeActiveWalletChainId: (chainId?: number) => void;
    checkAndSwitchNetwork: (chainId?: number) => Promise<void>;
    connectors: Connector[];
    setConnectors: (connectors: Connector[]) => void;
    _impersonatedAddress?: string;
    setImpersonatedAddress: (address: string) => void;
    checkIsContractWallet: (wallet: Omit<Wallet, 'signer'>) => Promise<boolean>;
};
export declare function createWalletSlice({ walletConnected, getChainParameters, }: {
    walletConnected: (wallet: Wallet) => void;
    getChainParameters: (chainId: number) => AddEthereumChainParameter | number;
}): StoreSlice<IWalletSlice, TransactionsSliceBaseType>;
