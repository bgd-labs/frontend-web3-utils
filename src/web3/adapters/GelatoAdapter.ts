// TODO: need fix execute tx

import { produce } from 'immer';
import { GetTransactionReturnType, Hex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { selectIsGelatoTXPending } from '../store/transactionsSelectors';
import {
  BaseTx,
  GelatoBaseTx,
  ITransactionsSlice,
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

export function isGelatoTx(
  tx: GetTransactionReturnType | GelatoTx,
): tx is GelatoTx {
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
    tx: GelatoTx | GetTransactionReturnType;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }): Promise<T & { status?: number; pending: boolean }> => {
    const { activeWallet, chainId, type } = params;
    const tx = params.tx as GelatoTx;
    const from = activeWallet.account;
    const gelatoTX = {
      from: from as Hex,
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
    // TODO: need fix typing for transactions pool
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const tx = this.get().transactionsPool[taskId] as GelatoBaseTx;

    const isPending = selectIsGelatoTXPending(tx.gelatoStatus);
    if (!isPending) {
      return;
    }

    this.stopPollingGelatoTXStatus(taskId);

    const newGelatoInterval = setInterval(() => {
      this.fetchGelatoTXStatus(taskId);
      // TODO: maybe change timeout for gelato
    }, 2000);

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

  private updateGelatoTX = (
    taskId: string,
    statusResponse: GelatoTaskStatusResponse,
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
        tx.status =
          statusResponse.task.taskState === 'ExecSuccess'
            ? 1
            : tx.pending
            ? undefined
            : 0;
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
