import { BaseTx, ITransactionsSlice, NewTx } from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';

export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSlice<T>;
  set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
  executeTx: (params: {
    tx: NewTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }) => Promise<
    T & {
      status?: number;
      pending: boolean;
    }
  >;
  startTxTracking: (txId: string) => Promise<void>;
}
