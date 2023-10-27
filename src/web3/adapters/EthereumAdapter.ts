import { PublicClient } from '@wagmi/core';
import { produce } from 'immer';
import { GetTransactionReturnType, Hex, Transaction } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  BaseTx,
  ITransactionsSlice,
  NewTx,
  TransactionStatus,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { AdapterInterface } from './interface';

export class EthereumAdapter<T extends BaseTx> implements AdapterInterface<T> {
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
    this.waitForTxReceipt(tx, tx.hash);
    return txPool[tx.hash];
  };
  startTxTracking = async (txKey: string) => {
    const retryCount = 5;
    const txData = this.get().transactionsPool[txKey];
    // check if tx is in local storage
    if (txData) {
      const client = this.get().clients[txData.chainId] as PublicClient;
      if (txData.hash) {
        // Find the transaction in the waiting pool
        for (let i = 0; i < retryCount; i++) {
          try {
            const tx = await client.getTransaction({ hash: txData.hash });

            // If the transaction is found, wait for the receipt
            await this.waitForTxReceipt(tx, txData.hash);
            return; // Exit the function if successful
          } catch (e) {
            if (i === retryCount - 1) {
              // If the transaction is not found after the last retry, set the status to unknownError (it could be replace with completely new one or lost in mempool)
              this.updateTXStatus(txData.hash, TransactionStatus.Failed);
              return; // Exit the function
            }
          }
        }
        // Wait before the next retry
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } else {
      return; // Exit the function if the transaction is not found
    }
  };

  private waitForTxReceipt = async (
    tx: GetTransactionReturnType | Transaction,
    txHash: Hex,
  ) => {
    const chainId = tx.chainId || this.get().transactionsPool[txHash].chainId;
    const client = this.get().clients[chainId] as PublicClient;
    let txWasReplaced = false;
    try {
      const txn = await client.waitForTransactionReceipt({
        pollingInterval: 8_000,
        hash: tx.hash,
        onReplaced: (replacement) => {
          this.updateTXStatus(
            txHash,
            TransactionStatus.Replaced,
            replacement.transaction.hash,
          );
          txWasReplaced = true;
        },
      });
      if (txWasReplaced) {
        return;
      }
      this.updateTXStatus(
        txHash,
        txn.status === 'success'
          ? TransactionStatus.Success
          : TransactionStatus.Reverted,
      );

      const updatedTX = this.get().transactionsPool[txHash];
      const txBlock = await client.getBlock({ blockNumber: txn.blockNumber });
      const timestamp = txBlock.timestamp;
      this.get().txStatusChangedCallback({
        ...updatedTX,
        timestamp,
      });
    } catch (e) {
      this.updateTXStatus(txHash, TransactionStatus.Failed);
      console.error(e);
    }
  };

  private updateTXStatus = (
    hash: string,
    status?: TransactionStatus,
    replacedHash?: string,
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        draft.transactionsPool[hash].status =
          status !== TransactionStatus.Reverted
            ? status
            : draft.transactionsPool[hash].pending
            ? undefined
            : TransactionStatus.Reverted;
        draft.transactionsPool[hash].pending = false;
        if (replacedHash) {
          draft.transactionsPool[hash].replacedTxHash = replacedHash;
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
