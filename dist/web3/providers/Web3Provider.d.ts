/// <reference types="react" />
import { UseBoundStore, StoreApi } from 'zustand';
import { Connector } from '@web3-react/types';
import { Wallet } from '../store/walletSlice';
import { AllConnectorsInitProps } from '../connectors';
interface Web3ProviderProps {
    useStore: UseBoundStore<StoreApi<{
        setActiveWallet: (wallet: Omit<Wallet, 'signer'>) => void;
        changeActiveWalletChainId: (chainID: number) => void;
        setConnectors: (connectors: Connector[]) => void;
        initTxPool: () => void;
    }>>;
    connectorsInitProps: AllConnectorsInitProps;
}
export declare function Web3Provider({ useStore, connectorsInitProps, }: Web3ProviderProps): JSX.Element;
export {};
