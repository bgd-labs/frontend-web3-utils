import { Connector } from '@web3-react/types';
import React from 'react';
import { StoreApi, UseBoundStore } from 'zustand';
import { AllConnectorsInitProps } from '../connectors';
import { Wallet } from '../store/walletSlice';
interface Web3ProviderProps {
    useStore: UseBoundStore<StoreApi<{
        setActiveWallet: (wallet: Omit<Wallet, 'signer'>) => void;
        changeActiveWalletChainId: (chainID: number) => void;
        setConnectors: (connectors: Connector[]) => void;
        disconnectActiveWallet: () => void;
    }>>;
    connectorsInitProps: AllConnectorsInitProps;
}
export declare function Web3Provider({ useStore, connectorsInitProps, }: Web3ProviderProps): React.JSX.Element;
export {};
