import { ethers } from 'ethers';
import { produce } from 'immer';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { selectIsGelatoTXPending } from '../store/transactionsSelectors';
// TODO check and move all related types if needed
import {
  BaseTx,
  GelatoBaseTx,
  GelatoTaskStatusResponse,
  GelatoTx,
  ITransactionsSlice,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GelatoAdapterInterface } from './interface';

export class GelatoAdapter<T extends BaseTx>
  implements GelatoAdapterInterface<T>
{
  get: () => ITransactionsSlice<T>;
  set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
  transactionsIntervalsMap: Record<string, number | undefined> = {};

  constructor(
    get: () => ITransactionsSlice<T>,
    set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void
  ) {
    this.get = get;
    this.set = set;
  }

  executeTx = async (params: {
    tx: GelatoTx | ethers.ContractTransaction;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }): Promise<T & { status?: number; pending: boolean }> => {
    const { activeWallet, chainId, type } = params;
    const tx = params.tx as GelatoTx;
    const from = activeWallet.accounts[0];
    const gelatoTX = {
      from,
      chainId,
      type: type,
      taskId: tx.taskId,
      payload: params.payload,
    };

    const txPool = this.get().addTXToPool(gelatoTX, activeWallet.walletType);
    this.startTxTracking(tx.taskId);

    return txPool[tx.taskId];
  };

  startTxTracking = async (taskId: string) => {
    const tx = this.get().transactionsPool[taskId] as GelatoBaseTx;

    const isPending = selectIsGelatoTXPending(tx.gelatoStatus);
    if (!isPending) {
      return;
    }

    this.stopPollingGelatoTXStatus(taskId);

    const newGelatoInterval = setInterval(() => {
      this.fetchGelatoTXStatus(taskId);
      // TODO: change timeout for gelato
    }, 2000);

    this.transactionsIntervalsMap[taskId] = Number(newGelatoInterval);
  };

  stopPollingGelatoTXStatus = (taskId: string) => {
    const currentInterval = this.transactionsIntervalsMap[taskId];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[taskId] = undefined;
  };

  fetchGelatoTXStatus = async (taskId: string) => {
    const response = await fetch(
      `https://relay.gelato.digital/tasks/status/${taskId}/`
    );
    if (!response.ok) {
      // TODO: handle error if needed, for now just skipping
    } else {
      const gelatoStatus = (await response.json()) as GelatoTaskStatusResponse;
      const isPending = selectIsGelatoTXPending(gelatoStatus.task.taskState);
      this.updateGelatoTX(taskId, gelatoStatus);
      if (!isPending) {
        this.stopPollingGelatoTXStatus(taskId);
        const tx = this.get().transactionsPool[taskId];
        this.get().txStatusChangedCallback(tx);
      }
    }
  };

  updateGelatoTX = (
    taskId: string,
    statusResponse: GelatoTaskStatusResponse
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        const tx = draft.transactionsPool[taskId] as GelatoBaseTx & {
          pending: boolean;
          status?: number;
        };
        tx.gelatoStatus = statusResponse.task.taskState;
        tx.pending = selectIsGelatoTXPending(statusResponse.task.taskState);
        tx.hash = statusResponse.task.transactionHash;
        tx.status = statusResponse.task.taskState == 'ExecSuccess' ? 1 : 2;
        if (statusResponse.task.executionDate) {
          const timestamp = new Date(
            statusResponse.task.executionDate
          ).getTime();
          tx.timestamp = timestamp;
        }
        if (statusResponse.task.lastCheckMessage) {
          tx.errorMessage = statusResponse.task.lastCheckMessage;
        }
      })
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
