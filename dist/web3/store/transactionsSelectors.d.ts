import { AddEthereumChainParameter } from '@web3-react/types';
import { BaseTx, GelatoBaseTx, ITransactionsState } from './transactionsSlice';
export declare const selectAllTransactions: <T extends BaseTx>(state: ITransactionsState<T>) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
})[];
export declare const selectPendingTransactions: <T extends BaseTx>(state: ITransactionsState<T>) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
})[];
export declare const selectTXByKey: <T extends BaseTx>(state: ITransactionsState<T>, key: string) => T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
};
export declare const selectTXByHash: <T extends BaseTx>(state: ITransactionsState<T>, hash: string) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
}) | undefined;
export declare const selectAllTransactionsByWallet: <T extends BaseTx>(state: ITransactionsState<T>, from: string) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
})[];
export declare const selectPendingTransactionByWallet: <T extends BaseTx>(state: ITransactionsState<T>, from: string) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
})[];
export declare const selectLastTxByTypeAndPayload: <T extends BaseTx>(state: ITransactionsState<T>, from: string, type: T["type"], payload: T["payload"]) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: import("../connectors").WalletType;
}) | undefined;
export declare const selectTxExplorerLink: <T extends BaseTx>(state: ITransactionsState<T>, getChainParameters: (chainId: number) => AddEthereumChainParameter, txHash: string) => string;
export declare const selectIsGelatoTXPending: (gelatoStatus?: GelatoBaseTx['gelatoStatus']) => boolean;
