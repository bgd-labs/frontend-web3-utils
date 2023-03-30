import { ethers } from 'ethers';

import {
  BaseTx,
  GelatoTx,
  GnosisTxStatusResponse,
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

export interface GelatoAdapterInterface<T extends BaseTx>
  extends AdapterInterface<T> {
  stopPollingGelatoTXStatus: (taskId: string) => void;
  fetchGelatoTXStatus: (taskId: string) => void;
}

export interface EthereumAdapterInterface<T extends BaseTx>
  extends AdapterInterface<T> {
  waitForTxReceipt: (
    tx: ethers.providers.TransactionResponse,
    txHash: string
  ) => Promise<void>;
  updateTXStatus: (hash: string, status?: number) => void;
}

export interface GnosisAdapterInterface<T extends BaseTx>
  extends AdapterInterface<T> {
  fetchGnosisTxStatus: (txKey: string) => void;
  stopPollingGnosisTXStatus: (txKey: string) => void;
  updateGnosisTxStatus: (
    txKey: string,
    statusResponse: GnosisTxStatusResponse
  ) => void;
}
