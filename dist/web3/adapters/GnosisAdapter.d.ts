/// <reference types="jest" />
import { ethers } from 'ethers';
import { BaseTx, ITransactionsSlice } from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GelatoTx } from './GelatoAdapter';
import { AdapterInterface } from './interface';
export declare type GnosisTxStatusResponse = {
    transactionHash: string;
    safeTxHash: string;
    isExecuted: boolean;
    isSuccessful: boolean | null;
    executionDate: string | null;
    submissionDate: string | null;
    modified: string;
    nonce: number;
};
export declare class GnosisAdapter<T extends BaseTx> implements AdapterInterface<T> {
    get: () => ITransactionsSlice<T>;
    set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
    transactionsIntervalsMap: Record<string, number | undefined>;
    constructor(get: () => ITransactionsSlice<T>, set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void);
    executeTx: (params: {
        tx: ethers.ContractTransaction | GelatoTx;
        activeWallet: Wallet;
        payload: object | undefined;
        chainId: number;
        type: T['type'];
    }) => Promise<T & {
        status?: number;
        pending: boolean;
    }>;
    startTxTracking: (txKey: string) => Promise<void>;
    private fetchGnosisTxStatus;
    private stopPollingGnosisTXStatus;
    private updateGnosisTxStatus;
}
