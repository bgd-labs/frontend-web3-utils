import { GetTransactionReturnType } from 'viem';

import { BaseTx, ITransactionsSlice } from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GelatoTx } from './GelatoAdapter';

export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSlice<T>;
  set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
  executeTx: (params: {
    tx: GetTransactionReturnType | GelatoTx;
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
