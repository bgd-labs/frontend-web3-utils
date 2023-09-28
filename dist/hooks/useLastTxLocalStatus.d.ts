/// <reference types="react" />
import { BaseTx, ITransactionsState } from '../web3/store/transactionsSlice';
interface LastTxStatusesParams<T extends BaseTx> {
    state: ITransactionsState<T>;
    activeAddress: string;
    type: T['type'];
    payload: T['payload'];
}
declare type ExecuteTxWithLocalStatusesParams = {
    errorMessage: string;
    callbackFunction: () => Promise<void>;
};
export declare const useLastTxLocalStatus: <T extends BaseTx>({ state, activeAddress, type, payload, }: LastTxStatusesParams<T>) => {
    error: string;
    setError: import("react").Dispatch<import("react").SetStateAction<string>>;
    loading: boolean;
    setLoading: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    isTxStart: boolean;
    setIsTxStart: import("react").Dispatch<import("react").SetStateAction<boolean>>;
    txHash: string | undefined;
    txPending: boolean | undefined;
    txSuccess: boolean | undefined;
    txChainId: number | undefined;
    txWalletType: "Metamask" | "WalletConnect" | "Coinbase" | "GnosisSafe" | "Impersonated" | undefined;
    isError: boolean;
    executeTxWithLocalStatuses: ({ errorMessage, callbackFunction, }: ExecuteTxWithLocalStatusesParams) => Promise<void>;
    fullTxErrorMessage: string;
    setFullTxErrorMessage: import("react").Dispatch<import("react").SetStateAction<string>>;
};
export {};
