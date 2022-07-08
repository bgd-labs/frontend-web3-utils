import { ethers } from "ethers";
import { StoreSlice } from "../../types/store";
import { Web3Slice } from "./walletSlice";
export declare type BaseTx = {
    type: string;
    hash: string;
    from: string;
    to: string;
    nonce: number;
    payload?: object;
    chainId: number;
};
export declare type ProvidersRecord = Record<number, ethers.providers.JsonRpcProvider>;
export declare type TransactionPool<T extends BaseTx> = Record<string, T>;
export interface ITransactionsState<T extends BaseTx> {
    transactionsPool: TransactionPool<T & {
        status?: number;
        pending: boolean;
    }>;
}
interface ITransactionsActions<T extends BaseTx> {
    txStatusChangedCallback: (data: T & {
        status?: number;
    }) => void;
    executeTx: (params: {
        body: () => Promise<ethers.ContractTransaction>;
        params: {
            type: T["type"];
            payload: T["payload"];
        };
    }) => Promise<T & {
        status?: number;
        pending: boolean;
    }>;
    waitForTx: (hash: string) => Promise<void>;
    updateTXStatus: (hash: string, status?: number) => void;
    initTxPool: () => void;
}
export declare type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> & ITransactionsState<T>;
export declare function createTransactionsSlice<T extends BaseTx>({ txStatusChangedCallback, providers, }: {
    txStatusChangedCallback: (tx: T) => void;
    providers: ProvidersRecord;
}): StoreSlice<ITransactionsSlice<T>, Pick<Web3Slice, "checkAndSwitchNetwork">>;
export {};
