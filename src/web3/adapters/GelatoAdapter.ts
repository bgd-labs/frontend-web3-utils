import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { selectIsGelatoTXPending } from '../store/transactionsSelectors';
import {
  BaseTx,
  GelatoBaseTx,
  TransactionStatus,
  TxKey,
} from '../store/transactionsSlice';
import { BaseAdapter } from './BaseAdapter';
import { AdapterInterface, ExecuteTxParams } from './interface';

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

export type GelatoTx = {
  taskId: string;
};

export function isGelatoTx(tx: TxKey): tx is GelatoTx {
  return (tx as GelatoTx).taskId !== undefined;
}

export function isGelatoBaseTx(tx: BaseTx): tx is GelatoBaseTx {
  return (tx as GelatoBaseTx).taskId !== undefined;
}

export function isGelatoBaseTxWithoutTimestamp(
  tx: Omit<BaseTx, 'localTimestamp'>,
): tx is Omit<GelatoBaseTx, 'localTimestamp'> {
  return (tx as GelatoBaseTx).taskId !== undefined;
}

export class GelatoAdapter<T extends BaseTx>
  extends BaseAdapter<T>
  implements AdapterInterface<T>
{
  executeTx = async (params: ExecuteTxParams<T>) => {
    const { txKey, activeWallet, txParams } = this.preExecuteTx(params);

    if (txParams && isGelatoTx(txKey)) {
      const txPool = this.get().addTXToPool(txParams, activeWallet.walletType);
      this.startTxTracking(txKey.taskId);
      return txPool[txKey.taskId];
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
            isError: pending && status !== TransactionStatus.Success,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
