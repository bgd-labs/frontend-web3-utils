import dayjs from 'dayjs';
import { ethers } from 'ethers';
import { produce } from 'immer';

import { SafeTransactionServiceUrls } from '../../utils/constants';
import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  BaseTx,
  EthBaseTx,
  ITransactionsSlice,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GelatoTx } from './GelatoAdapter';
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
    tx: ethers.ContractTransaction | GelatoTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }): Promise<T & { status?: number; pending: boolean }> => {
    const { activeWallet, chainId, type } = params;
    const tx = params.tx as ethers.ContractTransaction;
    // ethereum tx
    const transaction = {
      chainId,
      hash: tx.hash,
      type,
      payload: params.payload,
      from: tx.from,
      to: tx.to as string,
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

    const newGnosisInterval = setInterval(() => {
      this.fetchGnosisTxStatus(txKey);
      // TODO: maybe change timeout or even stop tracking after some time (day/week)
    }, 10000);

    this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
  };

  private fetchGnosisTxStatus = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    const response = await fetch(
      `${
        SafeTransactionServiceUrls[tx.chainId]
      }/multisig-transactions/${txKey}/`,
    );
    if (!response.ok) {
      // TODO: handle error if need, for now just skipping and do nothing with failed response
    } else {
      const gnosisStatus = (await response.json()) as GnosisTxStatusResponse;
      const gnosisStatusModified = dayjs(gnosisStatus.modified);
      const currentTime = dayjs();
      // check if more than a day passed to stop polling
      const daysPassed = currentTime.diff(gnosisStatusModified, 'day');
      if (daysPassed >= 1) {
        this.updateGnosisTxStatus(txKey, gnosisStatus, true);
        this.stopPollingGnosisTXStatus(txKey);
        this.get().txStatusChangedCallback(tx);
        return;
      }

      const isPending = !gnosisStatus.isExecuted;
      this.updateGnosisTxStatus(txKey, gnosisStatus);
      if (!isPending) {
        this.stopPollingGnosisTXStatus(txKey);
        this.get().txStatusChangedCallback(tx);
      }
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
