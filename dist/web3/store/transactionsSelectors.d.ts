import { BaseTx, ITransactionsState } from "./transactionsSlice";
export declare const selectAllTransactions: <T extends BaseTx>(state: ITransactionsState<T>) => (T & {
    status?: number | undefined;
    pending: boolean;
})[];
export declare const selectPendingTransactions: <T extends BaseTx>(state: ITransactionsState<T>) => (T & {
    status?: number | undefined;
    pending: boolean;
})[];
export declare const selectTXByHash: <T extends BaseTx>(state: ITransactionsState<T>, hash: string) => T & {
    status?: number | undefined;
    pending: boolean;
};
