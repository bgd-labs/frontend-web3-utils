import {
  BaseTx,
  InitialTx,
  ITransactionsSliceWithWallet,
  TransactionStatus,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';

export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;
  executeTx: (params: {
    tx: InitialTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }) => Promise<
    | (T & {
        status?: TransactionStatus;
        pending: boolean;
      })
    | undefined
  >;
  startTxTracking: (txId: string) => Promise<void>;
}
