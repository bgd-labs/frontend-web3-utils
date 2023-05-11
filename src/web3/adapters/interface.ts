import { ethers } from 'ethers';

import { BaseTx, ITransactionsSlice } from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GelatoTx } from './GelatoAdapter';

export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSlice<T>;
  set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
  executeTx: (params: {
    tx: ethers.ContractTransaction | GelatoTx;
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
