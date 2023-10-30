import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { selectIsGelatoTXPending } from '../store/transactionsSelectors';
import {
  BaseTx,
  GelatoBaseTx,
  InitialTx,
  ITransactionsSlice,
  NewTx,
  TransactionStatus,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { AdapterInterface } from './interface';

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

export function isGelatoTx(tx: InitialTx): tx is GelatoTx {
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

export class GelatoAdapter<T extends BaseTx> implements AdapterInterface<T> {
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
  }): Promise<T & { status?: TransactionStatus; pending: boolean }> => {
    const { activeWallet, chainId, type } = params;
    const tx = params.tx as GelatoTx;
    const from = activeWallet.address;
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
  };

  private stopPollingGelatoTXStatus = (taskId: string) => {
    const currentInterval = this.transactionsIntervalsMap[taskId];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[taskId] = undefined;
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
      return response;
    } else {
      return response;
    }
  };

  private updateGelatoTX = (
    taskId: string,
    statusResponse: GelatoTaskStatusResponse,
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        const tx = draft.transactionsPool[taskId] as GelatoBaseTx & {
          pending: boolean;
          status?: TransactionStatus;
        };
        tx.gelatoStatus = statusResponse.task.taskState;
        tx.pending = selectIsGelatoTXPending(statusResponse.task.taskState);
        tx.hash = statusResponse.task.transactionHash;
        tx.status =
          statusResponse.task.taskState === 'ExecSuccess'
            ? TransactionStatus.Success
            : tx.pending
            ? undefined
            : TransactionStatus.Reverted;
        if (statusResponse.task.executionDate) {
          tx.timestamp = new Date(statusResponse.task.executionDate).getTime();
        }
        if (statusResponse.task.lastCheckMessage) {
          tx.errorMessage = statusResponse.task.lastCheckMessage;
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
