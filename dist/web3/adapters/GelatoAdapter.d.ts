/// <reference types="jest" />
import { ethers } from 'ethers';
import { BaseTx, GelatoBaseTx, ITransactionsSlice } from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { AdapterInterface } from './interface';
export declare type GelatoTXState = 'WaitingForConfirmation' | 'CheckPending' | 'ExecSuccess' | 'Cancelled' | 'ExecPending' | 'ExecReverted';
export declare type GelatoTaskStatusResponse = {
    task: {
        chainId: number;
        taskId: string;
        taskState: GelatoTXState;
        creationDate?: string;
        executionDate?: string;
        transactionHash?: string;
        blockNumber?: number;
        lastCheckMessage?: string;
    };
};
export declare type GelatoTx = {
    taskId: string;
};
export declare function isGelatoTx(tx: ethers.ContractTransaction | GelatoTx): tx is GelatoTx;
export declare function isGelatoBaseTx(tx: BaseTx): tx is GelatoBaseTx;
export declare function isGelatoBaseTxWithoutTimestamp(tx: Omit<BaseTx, 'localTimestamp'>): tx is Omit<GelatoBaseTx, 'localTimestamp'>;
export declare class GelatoAdapter<T extends BaseTx> implements AdapterInterface<T> {
    get: () => ITransactionsSlice<T>;
    set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
    transactionsIntervalsMap: Record<string, number | undefined>;
    constructor(get: () => ITransactionsSlice<T>, set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void);
    executeTx: (params: {
        tx: GelatoTx | ethers.ContractTransaction;
        activeWallet: Wallet;
        payload: object | undefined;
        chainId: number;
        type: T['type'];
    }) => Promise<T & {
        status?: number;
        pending: boolean;
    }>;
    startTxTracking: (taskId: string) => Promise<void>;
    private stopPollingGelatoTXStatus;
    private fetchGelatoTXStatus;
    private updateGelatoTX;
}
