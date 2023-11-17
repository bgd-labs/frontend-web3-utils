import { produce } from 'immer';
import { Hex, isHex } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { ITransactionsSliceWithWallet } from '../store/transactionsSlice';
import { isEthPoolTx, preExecuteTx } from './helpers';
import {
  AdapterInterface,
  BaseTx,
  BasicTx,
  ExecuteTxParams,
  TransactionStatus,
} from './types';

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

  executeTx = async (params: ExecuteTxParams<T>) => {
    const { txKey, activeWallet, txParams } = preExecuteTx(params);
    if (txParams && isHex(txKey)) {
      const txPool = this.get().addTXToPool(txParams, activeWallet.walletType);
      this.waitForTxReceipt(txKey);
      return txPool[txKey];
    } else {
      return undefined;
    }
  };
  startTxTracking = async (txKey: string) => {
    const retryCount = 5;
    const txData = this.get().transactionsPool[txKey];
    // check if tx is in local storage
    if (txData) {
      const client = this.get().clients[txData.chainId];
      if (txData.hash) {
        // Find the transaction in the waiting pool
        for (let i = 0; i < retryCount; i++) {
          try {
            const tx = await client.getTransaction({ hash: txData.hash });

            // If the transaction is found, wait for the receipt
            await this.waitForTxReceipt(txData.hash, tx.nonce);
            return; // Exit the function if successful
          } catch (e) {
            if (i === retryCount - 1) {
              // If the transaction is not found after the last retry, set the status to unknownError (it could be replaced with completely new one or lost in mempool)
              this.updateTXStatus(txData.hash, {
                status: TransactionStatus.Failed,
              });
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

  private waitForTxReceipt = async (txHash: Hex, txNonce?: number) => {
    const chainId = this.get().transactionsPool[txHash].chainId;
    const client = this.get().clients[chainId];
    let txWasReplaced = false;

    try {
      const txn = await client.waitForTransactionReceipt({
        pollingInterval: 8_000,
        hash: txHash,
        onReplaced: (replacement) => {
          this.updateTXStatus(txHash, {
            status: TransactionStatus.Replaced,
            replacedTxHash: replacement.transaction.hash,
          });
          txWasReplaced = true;
        },
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
      const txBlock = await client.getBlock({ blockNumber: txn.blockNumber });
      const timestamp = txBlock.timestamp;
      this.get().txStatusChangedCallback({
        ...updatedTX,
        timestamp,
      });
    } catch (e) {
      this.updateTXStatus(txHash, {
        status: TransactionStatus.Failed,
      });
      console.error('Error when check tx receipt', e);
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
              !draft.transactionsPool[txKey].pending &&
              params.status !== TransactionStatus.Success &&
              params.status !== TransactionStatus.Replaced,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
