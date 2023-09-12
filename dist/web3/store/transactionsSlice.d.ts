import { ethers } from 'ethers';
import { StoreSlice } from '../../types/store';
import { StaticJsonRpcBatchProvider } from '../../utils/StaticJsonRpcBatchProvider';
import { GelatoTx, GelatoTXState } from '../adapters/GelatoAdapter';
import { AdapterInterface } from '../adapters/interface';
import { WalletType } from '../connectors';
import { IWalletSlice } from './walletSlice';
export declare type BaseTx = EthBaseTx | GelatoBaseTx;
declare type BasicTx = {
    chainId: number;
    type: string;
    from: string;
    payload?: object;
    localTimestamp: number;
    timestamp?: number;
    errorMessage?: string;
};
export declare type EthBaseTx = BasicTx & {
    hash: string;
    to: string;
    nonce: number;
};
export declare type GelatoBaseTx = BasicTx & {
    taskId: string;
    hash?: string;
    gelatoStatus?: GelatoTXState;
};
export declare type ProvidersRecord = Record<number, StaticJsonRpcBatchProvider>;
export declare type TransactionsSliceBaseType = {
    providers: ProvidersRecord;
    setProvider: (chainId: number, provider: StaticJsonRpcBatchProvider) => void;
    initTxPool: () => void;
    updateEthAdapter: (gnosis: boolean) => void;
};
export declare type TransactionPool<T extends BaseTx> = Record<string, T>;
declare type PoolTx<T extends BaseTx> = T & {
    status?: number;
    pending: boolean;
    walletType: WalletType;
};
export interface ITransactionsState<T extends BaseTx> {
    transactionsPool: TransactionPool<PoolTx<T>>;
    transactionsIntervalsMap: Record<string, number | undefined>;
}
export interface ITransactionsActions<T extends BaseTx> {
    gelatoAdapter: AdapterInterface<T>;
    ethereumAdapter: AdapterInterface<T>;
    txStatusChangedCallback: (data: T & {
        status?: number;
        timestamp?: number;
    }) => void;
    executeTx: (params: {
        body: () => Promise<ethers.ContractTransaction | GelatoTx>;
        params: {
            type: T['type'];
            payload: T['payload'];
            desiredChainID: number;
        };
    }) => Promise<T & {
        status?: number;
        pending: boolean;
    }>;
    addTXToPool: (tx: Omit<GelatoBaseTx, 'localTimestamp'> | Omit<EthBaseTx, 'localTimestamp'>, activeWallet: WalletType) => TransactionPool<PoolTx<T>>;
    isGelatoAvailable: boolean;
    checkIsGelatoAvailable: (chainId: number) => Promise<void>;
    updateEthAdapter: (gnosis: boolean) => void;
}
export declare type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> & ITransactionsState<T> & TransactionsSliceBaseType;
export declare function createTransactionsSlice<T extends BaseTx>({ txStatusChangedCallback, defaultProviders, }: {
    txStatusChangedCallback: (tx: T) => void;
    defaultProviders: ProvidersRecord;
}): StoreSlice<ITransactionsSlice<T>, Pick<IWalletSlice, 'checkAndSwitchNetwork' | 'activeWallet'>>;
export {};
