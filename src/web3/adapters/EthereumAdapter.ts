import { produce } from 'immer';
import { GetTransactionReturnType, Hex, PublicClient } from 'viem';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { BaseTx, ITransactionsSlice, NewTx } from '../store/transactionsSlice';
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
  }): Promise<T & { status?: number; pending: boolean }> => {
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
    if (txData) {
      const client = this.get().clients[txData.chainId] as PublicClient;

      if (txData.hash) {
        // Find the transaction in the waiting pool
        for (let i = 0; i < retryCount; i++) {
          const tx = await client.getTransaction({ hash: txData.hash });
          // If the transaction is found, wait for the receipt
          if (tx) {
            await this.waitForTxReceipt(tx, txData.hash);
            return; // Exit the function if successful
          }
        }
        // Wait before the next retry
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } else {
      // TODO: no transaction in waiting pool
    }
  };

  private waitForTxReceipt = async (
    tx: GetTransactionReturnType,
    txHash: Hex,
  ) => {
    const chainId = tx.chainId || this.get().transactionsPool[txHash].chainId;
    const client = this.get().clients[chainId] as PublicClient;

    try {
      // TODO: need added onReplaced logic
      const txn = await client.waitForTransactionReceipt({ hash: tx.hash });
      this.updateTXStatus(txHash, txn.status);

      const updatedTX = this.get().transactionsPool[txHash];
      const txBlock = await client.getBlock({ blockNumber: txn.blockNumber });
      const timestamp = txBlock.timestamp;
      this.get().txStatusChangedCallback({
        ...updatedTX,
        timestamp,
      });
    } catch (e) {
      console.error(e);
    }
  };

  private updateTXStatus = (hash: string, status?: 'success' | 'reverted') => {
    this.set((state) =>
      produce(state, (draft) => {
        draft.transactionsPool[hash].status =
          status === 'success'
            ? 1
            : draft.transactionsPool[hash].pending
            ? undefined
            : 0;
        draft.transactionsPool[hash].pending = false;
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
