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
  // transactionsIntervalsMap: Record<string, number | undefined> = {};

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
    // this.stopPollingGnosisTXStatus(txKey);

    this.fetchGnosisTxStatus(txKey);
      // TODO: maybe change timeout or even stop tracking after some time (day/week)

    // this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
  };

  private fetchGnosisTxStatus = async (txKey: string, retryCount: number = 5) => {
    const tx = this.get().transactionsPool[txKey];
      const response = await fetch(
        `${
          SafeTransactionServiceUrls[tx.chainId]
        }/multisig-transactions/${txKey}/`,
      );
      if (!response.ok) {
        if (retryCount > 0) {
          setTimeout(() => this.fetchGnosisTxStatus(txKey, retryCount - 1), 5000);
          return
        } else {
          // Max retry count reached, stop polling until next initialization
          return
        }
      } else {
        const gnosisStatus = (await response.json()) as GnosisTxStatusResponse;
        const gnosisStatusModified = dayjs(gnosisStatus.modified);
        const currentTime = dayjs();
        // check if more than a several day passed to remove the transaction from the pool
        const daysPassed = currentTime.diff(gnosisStatusModified, 'day');
        if (daysPassed >= 3) {
          // this.updateGnosisTxStatus(txKey, gnosisStatus, true);
          // this.stopPollingGnosisTXStatus(txKey);
          // this.get().txStatusChangedCallback(tx);
          this.get().removeTXFromPool(txKey);
          return;
        }
  
        const isPending = !gnosisStatus.isExecuted;
        this.updateGnosisTxStatus(txKey, gnosisStatus);
        if (!isPending) {
          // this.stopPollingGnosisTXStatus(txKey);
          this.get().txStatusChangedCallback(tx);
        }
        return
      }
  };

  // private stopPollingGnosisTXStatus = (txKey: string) => {
  //   // const currentInterval = this.transactionsIntervalsMap[txKey];
  //   // clearInterval(currentInterval);
  //   // this.transactionsIntervalsMap[txKey] = undefined;
  // };

  private updateGnosisTxStatus = (
    txKey: string,
    statusResponse: GnosisTxStatusResponse,
    forceStopped?: boolean,
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        const tx = draft.transactionsPool[txKey] as EthBaseTx & {
          pending: boolean;
          status?: number;
        };
        tx.status = forceStopped ? 0 : +!!statusResponse.isSuccessful; // turns boolean | null to 0 or 1
        tx.pending = forceStopped ? false : !statusResponse.isExecuted;
        tx.nonce = statusResponse.nonce;
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
