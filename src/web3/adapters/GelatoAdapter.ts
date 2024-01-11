import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  ITransactionsSliceWithWallet,
  PoolTx,
} from '../store/transactionsSlice';
import { isGelatoBaseTx, isGelatoTXPending } from './helpers';
import { AdapterInterface, BaseTx, BasicTx, TransactionStatus } from './types';

export enum GelatoTaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  WaitingForConfirmation = 'WaitingForConfirmation',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  Cancelled = 'Cancelled',
}

export type GelatoTaskStatusResponse = {
  task: {
    chainId: number;
    taskId: string;
    taskState: GelatoTaskState;
    creationDate?: string;
    executionDate?: string;
    transactionHash?: Hex;
    blockNumber?: number;
    lastCheckMessage?: string;
  };
};

export type GelatoBaseTx = BasicTx & {
  taskId: string;
  hash?: Hex;
  gelatoStatus?: GelatoTaskState;
};

export type GelatoTx = {
  taskId: string;
};

export class GelatoAdapter<T extends BaseTx> implements AdapterInterface<T> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;
  transactionsIntervalsMap: Record<string, number | undefined> = {};

  constructor(
    get: () => ITransactionsSliceWithWallet<T>,
    set: (
      fn: (
        state: ITransactionsSliceWithWallet<T>,
      ) => ITransactionsSliceWithWallet<T>,
    ) => void,
  ) {
    this.get = get;
    this.set = set;
  }

  checkIsGelatoAvailable = async (chainId: number) => {
    try {
      const response = await fetch(`https://relay.gelato.digital/relays/v2`);
      if (!response.ok) {
        return false;
      } else {
        const listOfRelays = (await response.json()) as { relays: string[] };
        return !!listOfRelays.relays.find((id) => +id === chainId);
      }
    } catch (e) {
      console.error('Check gelato available error', e);
      return false;
    }
  };

  startTxTracking = async (tx: PoolTx<T>) => {
    if (isGelatoBaseTx(tx)) {
      const isPending = isGelatoTXPending(tx.gelatoStatus);
      if (!isPending) {
        return;
      }

      this.stopPollingGelatoTXStatus(tx.taskId);

      let retryCount = 5;
      const newGelatoInterval = setInterval(async () => {
        if (retryCount > 0) {
          const response = await this.fetchGelatoTXStatus(tx.taskId);
          if (!response.ok) {
            retryCount--;
          }
        } else {
          this.stopPollingGelatoTXStatus(tx.taskId);
          this.get().removeTXFromPool(tx.taskId);
          return;
        }
      }, 5000);

      this.transactionsIntervalsMap[tx.taskId] = Number(newGelatoInterval);
    }
  };

  private fetchGelatoTXStatus = async (taskId: string) => {
    const response = await fetch(
      `https://api.gelato.digital/tasks/status/${taskId}/`,
    );

    if (response.ok) {
      const gelatoStatus = (await response.json()) as GelatoTaskStatusResponse;
      const isPending = isGelatoTXPending(gelatoStatus.task.taskState);

      // check if more than a day passed and tx wasn't executed still, remove the transaction from the pool
      if (gelatoStatus.task.creationDate) {
        const gelatoCreatedData = dayjs(gelatoStatus.task.creationDate);
        const currentTime = dayjs();
        const daysPassed = currentTime.diff(gelatoCreatedData, 'day');
        if (daysPassed >= 1 && isPending) {
          this.stopPollingGelatoTXStatus(taskId);
          this.get().removeTXFromPool(taskId);
          return response;
        }
      }

      this.updateGelatoTX(taskId, gelatoStatus);

      if (!isPending) {
        this.stopPollingGelatoTXStatus(taskId);
        const tx = this.get().transactionsPool[taskId];
        this.get().txStatusChangedCallback(tx);
      }
    }

    return response;
  };

  private stopPollingGelatoTXStatus = (taskId: string) => {
    const currentInterval = this.transactionsIntervalsMap[taskId];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[taskId] = undefined;
  };

  private updateGelatoTX = (
    taskId: string,
    statusResponse: GelatoTaskStatusResponse,
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        if (isGelatoBaseTx(draft.transactionsPool[taskId])) {
          const pending = isGelatoTXPending(statusResponse.task.taskState);
          const status =
            statusResponse.task.taskState === 'ExecSuccess'
              ? TransactionStatus.Success
              : pending
                ? undefined
                : TransactionStatus.Reverted;

          draft.transactionsPool[taskId] = {
            ...draft.transactionsPool[taskId],
            pending,
            status,
            gelatoStatus: statusResponse.task.taskState,
            hash: statusResponse.task.transactionHash,
            timestamp: statusResponse.task.executionDate
              ? dayjs(statusResponse.task.executionDate).unix()
              : undefined,
            errorMessage:
              statusResponse.task.taskState >
              GelatoTaskState.WaitingForConfirmation
                ? statusResponse.task.lastCheckMessage
                : undefined,
            isError: !pending && status !== TransactionStatus.Success,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
