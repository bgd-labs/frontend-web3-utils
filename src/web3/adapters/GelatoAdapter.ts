import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { selectIsGelatoTXPending } from '../store/transactionsSelectors';
import { ITransactionsSliceWithWallet } from '../store/transactionsSlice';
import { isGelatoBaseTx, preExecuteTx } from './helpers';
import {
  AdapterInterface,
  BaseTx,
  BasicTx,
  ExecuteTxParams,
  TransactionStatus,
} from './types';

export type GelatoTXState =
  | 'WaitingForConfirmation'
  | 'CheckPending'
  | 'ExecSuccess'
  | 'Cancelled'
  | 'ExecPending'
  | 'ExecReverted';

export type GelatoTaskStatusResponse = {
  task: {
    chainId: number;
    taskId: string;
    taskState: GelatoTXState;
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
  gelatoStatus?: GelatoTXState;
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

  executeTx = async (params: ExecuteTxParams<T>) => {
    const { txKey, activeWallet, txParams } = preExecuteTx(params);
    if (txParams) {
      const txPool = this.get().addTXToPool(txParams, activeWallet.walletType);
      this.startTxTracking(txKey);
      return txPool[txKey];
    } else {
      return undefined;
    }
  };

  startTxTracking = async (taskId: string) => {
    const tx = this.get().transactionsPool[taskId];

    if (isGelatoBaseTx(tx)) {
      const isPending = selectIsGelatoTXPending(tx.gelatoStatus);
      if (!isPending) {
        return;
      }

      this.stopPollingGelatoTXStatus(taskId);

      let retryCount = 5;
      const newGelatoInterval = setInterval(async () => {
        if (retryCount > 0) {
          const response = await this.fetchGelatoTXStatus(taskId);
          if (!response.ok) {
            retryCount--;
          }
        } else {
          this.stopPollingGelatoTXStatus(taskId);
          this.get().removeTXFromPool(taskId);
          return;
        }
      }, 5000);

      this.transactionsIntervalsMap[taskId] = Number(newGelatoInterval);
    }
  };

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

  private fetchGelatoTXStatus = async (taskId: string) => {
    const response = await fetch(
      `https://api.gelato.digital/tasks/status/${taskId}/`,
    );

    if (response.ok) {
      const gelatoStatus = (await response.json()) as GelatoTaskStatusResponse;
      const isPending = selectIsGelatoTXPending(gelatoStatus.task.taskState);

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
          const pending = selectIsGelatoTXPending(
            statusResponse.task.taskState,
          );
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
            errorMessage: statusResponse.task.lastCheckMessage,
            isError: !pending && status !== TransactionStatus.Success,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
