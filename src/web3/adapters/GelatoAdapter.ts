/**
 * Adapter for transaction slice to check transactions from gelato API. (Internal)
 * @module TransactionAdapters/GelatoAdapter
 */

import {
  createGelatoEvmRelayerClient,
  type GelatoEvmRelayerClient,
  TransactionRejectedError,
  TransactionRevertedError,
} from '@gelatocloud/gasless';
import { produce } from 'immer';
import { Hex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  ITransactionsSliceWithWallet,
  PoolTx,
} from '../store/transactionsSlice';
import { isGelatoBaseTx, isGelatoTXPending } from './helpers';
import { AdapterInterface, BaseTx, BasicTx, TransactionStatus } from './types';

const TX_RECEIPT_TIMEOUT = 3_600_000; // 1 hour

export enum GelatoTaskState {
  CheckPending = 'CheckPending',
  ExecPending = 'ExecPending',
  WaitingForConfirmation = 'WaitingForConfirmation',
  ExecSuccess = 'ExecSuccess',
  ExecReverted = 'ExecReverted',
  Cancelled = 'Cancelled',
}

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
  apiKeys: Record<number, string> = {};
  private relayerClients: Record<number, GelatoEvmRelayerClient> = {};

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

  setApiKeys = (apiKeys: Record<number, string>) => {
    this.apiKeys = apiKeys;
  };

  private getRelayerClient = (
    chainId: number,
  ): GelatoEvmRelayerClient | undefined => {
    if (this.relayerClients[chainId]) return this.relayerClients[chainId];
    const apiKey = this.apiKeys[chainId];
    if (!apiKey) return undefined;
    const client = createGelatoEvmRelayerClient({ apiKey });
    this.relayerClients[chainId] = client;
    return client;
  };

  checkIsGelatoAvailable = async (chainId: number) => {
    const relayer = this.getRelayerClient(chainId);
    if (!relayer) return false;

    try {
      const capabilities = await relayer.getCapabilities();
      return !!capabilities[chainId];
    } catch (e) {
      console.error('Check is gelato services available error:', e);
      return false;
    }
  };

  startTxTracking = async (tx: PoolTx<T>) => {
    if (!isGelatoBaseTx(tx)) return;
    if (!isGelatoTXPending(tx.gelatoStatus)) return;

    const relayer = this.getRelayerClient(tx.chainId);
    if (!relayer) return;

    try {
      const receipt = await relayer.waitForReceipt(
        { id: tx.taskId },
        { throwOnReverted: true, timeout: TX_RECEIPT_TIMEOUT },
      );

      this.updateGelatoTX(tx.taskId, {
        taskState: GelatoTaskState.ExecSuccess,
        transactionHash: receipt.transactionHash,
      });
    } catch (error) {
      if (error instanceof TransactionRevertedError) {
        this.updateGelatoTX(tx.taskId, {
          taskState: GelatoTaskState.ExecReverted,
          transactionHash: error.receipt.transactionHash,
          errorMessage: error.errorMessage,
        });
      } else if (error instanceof TransactionRejectedError) {
        this.updateGelatoTX(tx.taskId, {
          taskState: GelatoTaskState.Cancelled,
          errorMessage: error.errorMessage,
        });
      } else {
        // Timeout or network error — remove from pool
        this.get().removeTXFromPool(tx.taskId);
      }
    }
  };

  private updateGelatoTX = (
    taskId: string,
    params: {
      taskState: GelatoTaskState;
      transactionHash?: Hex;
      errorMessage?: string;
    },
  ) => {
    const pending = isGelatoTXPending(params.taskState);
    const status =
      params.taskState === GelatoTaskState.ExecSuccess
        ? TransactionStatus.Success
        : pending
          ? undefined
          : TransactionStatus.Reverted;

    this.set((state) =>
      produce(state, (draft) => {
        if (isGelatoBaseTx(draft.transactionsPool[taskId])) {
          draft.transactionsPool[taskId] = {
            ...draft.transactionsPool[taskId],
            pending,
            status,
            gelatoStatus: params.taskState,
            hash: params.transactionHash,
            errorMessage: params.errorMessage,
            isError: !pending && status !== TransactionStatus.Success,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);

    if (!pending) {
      const tx = this.get().transactionsPool[taskId];
      this.get().txStatusChangedCallback(tx);
    }
  };
}
