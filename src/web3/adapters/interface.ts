import { ethers } from 'ethers';

import {
  BaseTx,
  GelatoTx,
  ITransactionsSlice,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';

// TODO: try again to use defined type instead of Generic so get/set could work with it
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
