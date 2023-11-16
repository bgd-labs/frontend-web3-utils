import {
  BaseTx,
  ITransactionsSliceWithWallet,
  TransactionStatus,
  TxKey,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';

export type ExecuteTxParams<T extends BaseTx> = {
  txKey: TxKey;
  activeWallet: Wallet;
  payload: object | undefined;
  chainId: number;
  type: T['type'];
};

export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;
  executeTx: (params: ExecuteTxParams<T>) => Promise<
    | (T & {
        status?: TransactionStatus;
        pending: boolean;
      })
    | undefined
  >;
  startTxTracking: (txId: string) => Promise<void>;
}
