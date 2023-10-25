import dayjs from 'dayjs';
import { produce } from 'immer';
import { GetTransactionReturnType, Hex } from 'viem';

import { SafeTransactionServiceUrls } from '../../utils/constants';
import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  BaseTx,
  EthBaseTx,
  ITransactionsSlice,
  NewTx,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { AdapterInterface } from './interface';

export type GnosisTxStatusResponse = {
  transactionHash: string;
  safeTxHash: string;
  isExecuted: boolean;
  isSuccessful: boolean | null;
  executionDate: string | null;
  submissionDate: string | null;
  modified: string;
  nonce: number;
};

export class GnosisAdapter<T extends BaseTx> implements AdapterInterface<T> {
  get: () => ITransactionsSlice<T>;
  set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
  transactionsIntervalsMap: Record<string, number | undefined> = {};

  constructor(
    get: () => ITransactionsSlice<T>,
    set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void,
  ) {
    this.get = get;
    this.set = set;
  }

  executeTx = async (params: {
    tx: NewTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }): Promise<T & { status?: number; pending: boolean }> => {
    const { activeWallet, chainId, type } = params;
    const tx = params.tx as GetTransactionReturnType;
    // ethereum tx
    const transaction = {
      chainId,
      hash: tx.hash,
      type,
      payload: params.payload,
      from: tx.from,
      to: tx.to as Hex,
      nonce: tx.nonce,
    };
    const txPool = this.get().addTXToPool(transaction, activeWallet.walletType);
    this.startTxTracking(tx.hash);
    return txPool[tx.hash];
  };

  startTxTracking = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    const isPending = tx.pending;
    if (!isPending) {
      return;
    }
    this.stopPollingGnosisTXStatus(txKey);
    let retryCount = 5 
    const newGnosisInterval = setInterval(() => {
      if (retryCount > 0) {
        this.fetchGnosisTxStatus(txKey);
        retryCount--;
      } else {
        // just stopping interval, not removing tx from pool because multisig could take a while
        this.stopPollingGnosisTXStatus(txKey);
        return;
      }
    }, 5000);
    this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
  };

  private fetchGnosisTxStatus = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
      const response = await fetch(
        `${
          SafeTransactionServiceUrls[tx.chainId]
        }/multisig-transactions/${txKey}/`,
      );
      if (response.ok) {
        const gnosisStatus = (await response.json()) as GnosisTxStatusResponse;
        const gnosisStatusModified = dayjs(gnosisStatus.modified);
        const currentTime = dayjs();
        const daysPassed = currentTime.diff(gnosisStatusModified, 'day');
        // check if more than a day passed and tx wasn't executed still,remove the transaction from the pool
        if (daysPassed >= 1 && !gnosisStatus.isExecuted) {
          this.stopPollingGnosisTXStatus(txKey);
          this.get().txStatusChangedCallback(tx);
          this.get().removeTXFromPool(txKey);
          return;
        }
  
        const isPending = !gnosisStatus.isExecuted;
        this.updateGnosisTxStatus(txKey, gnosisStatus);
        if (!isPending) {
          this.stopPollingGnosisTXStatus(txKey);
          this.get().txStatusChangedCallback(tx);
        }
        return
      }
  };

  private stopPollingGnosisTXStatus = (txKey: string) => {
    const currentInterval = this.transactionsIntervalsMap[txKey];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[txKey] = undefined;
  };

  private updateGnosisTxStatus = (
    txKey: string,
    statusResponse: GnosisTxStatusResponse,
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        const tx = draft.transactionsPool[txKey] as EthBaseTx & {
          pending: boolean;
          status?: number;
        };
        tx.status = +!!statusResponse.isSuccessful; // turns boolean | null to 0 or 1
        tx.pending = !statusResponse.isExecuted;
        tx.nonce = statusResponse.nonce;
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
