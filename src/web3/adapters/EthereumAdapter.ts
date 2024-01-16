import { produce } from 'immer';
import { Hex, isHex, ReplacementReturnType } from 'viem';
import {
  getBlock,
  getTransaction,
  waitForTransactionReceipt,
} from 'viem/actions';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  ITransactionsSliceWithWallet,
  PoolTx,
} from '../store/transactionsSlice';
import { isEthPoolTx } from './helpers';
import { AdapterInterface, BaseTx, BasicTx, TransactionStatus } from './types';

export type EthBaseTx = BasicTx & {
  hash: Hex;
  to?: Hex;
  nonce?: number;
};

export class EthereumAdapter<T extends BaseTx> implements AdapterInterface<T> {
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

  startTxTracking = async (tx: PoolTx<T>) => {
    const retryCount = 10;
    const txData = tx.hash ? this.get().transactionsPool[tx.hash] : undefined;
    // check if tx is in local storage
    if (txData) {
      const client = this.get().clients[txData.chainId];
      if (txData.hash) {
        // Find the transaction in the waiting pool
        for (let i = 0; i < retryCount; i++) {
          try {
            const tx = await getTransaction(client, { hash: txData.hash });
            // If the transaction is found, wait for the receipt
            await this.waitForTxReceipt(txData.hash, tx.nonce);
            return;
          } catch (e) {
            if (i === retryCount - 1) {
              console.error('Error when tracking ETH TX:', e);
              // If the transaction is not found after the last retry, set the status to unknownError (it could be replaced with completely new one or lost in mempool)
              this.updateTXStatus(txData.hash, {
                status: TransactionStatus.Failed,
              });
              return;
            }
          }
        }
        // Wait before the next retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
  };

  waitForTxReceipt = async (txHash: Hex, txNonce?: number) => {
    const chainId = this.get().transactionsPool[txHash].chainId;
    const client = this.get().clients[chainId];
    let txWasReplaced = false;

    try {
      const txn = await waitForTransactionReceipt(client, {
        hash: txHash,
        onReplaced: (replacement: ReplacementReturnType) => {
          this.updateTXStatus(txHash, {
            status: TransactionStatus.Replaced,
            replacedTxHash: replacement.transaction.hash,
          });
          txWasReplaced = true;
        },
        pollingInterval: 10_000,
      });

      if (txWasReplaced) {
        return;
      }

      this.updateTXStatus(txHash, {
        status:
          txn.status === 'success'
            ? TransactionStatus.Success
            : TransactionStatus.Reverted,
        to: isHex(txn.to) ? txn.to : undefined,
        nonce: txNonce,
      });

      const updatedTX = this.get().transactionsPool[txHash];
      const txBlock = await getBlock(client, { blockNumber: txn.blockNumber });
      const timestamp = txBlock.timestamp;

      this.get().txStatusChangedCallback({
        ...updatedTX,
        timestamp,
      });
    } catch (e) {
      this.updateTXStatus(txHash, {
        status: TransactionStatus.Failed,
      });
      console.error('Error when check TX receipt:', e);
    }
  };

  private updateTXStatus = (
    txKey: Hex,
    params: {
      status?: TransactionStatus;
      replacedTxHash?: Hex;
      to?: Hex;
      nonce?: number;
    },
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        if (isEthPoolTx(draft.transactionsPool[txKey])) {
          draft.transactionsPool[txKey] = {
            ...draft.transactionsPool[txKey],
            ...params,
            pending: false,
            isError:
              params.status !== TransactionStatus.Success &&
              params.status !== TransactionStatus.Replaced,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
