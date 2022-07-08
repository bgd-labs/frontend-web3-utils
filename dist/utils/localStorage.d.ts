import { BaseTx, TransactionPool } from "../web3/store/transactionsSlice";
import { WalletType } from '../web3/connectors';
export declare enum LocalStorageKeys {
    LastConnectedWallet = "LastConnectedWallet",
    TransactionPool = "TransactionPool"
}
export declare const setLocalStorageTxPool: <T extends BaseTx>(pool: Record<string, T>) => void;
export declare const getLocalStorageTxPool: () => string | null;
export declare const setLocalStorageWallet: (walletType: WalletType) => void;
export declare const deleteLocalStorageWallet: () => void;
