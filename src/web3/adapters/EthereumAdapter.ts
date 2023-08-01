import { ethers } from 'ethers';
import { produce } from 'immer';

import { setLocalStorageTxPool } from '../../utils/localStorage';
import { StaticJsonRpcBatchProvider } from '../../utils/StaticJsonRpcBatchProvider';
import { BaseTx, ITransactionsSlice } from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GelatoTx } from './GelatoAdapter';
import { AdapterInterface } from './interface';

export class EthereumAdapter<T extends BaseTx> implements AdapterInterface<T> {
  get: () => ITransactionsSlice<T>;
  set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
  transactionsIntervalsMap: Record<string, number | undefined> = {};

  constructor(
    get: () => ITransactionsSlice<T>,
    set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void
  ) {
    this.get = get;
    this.set = set;
  }

  executeTx = async (params: {
    tx: ethers.ContractTransaction | GelatoTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }): Promise<T & { status?: number; pending: boolean }> => {
    const { activeWallet, chainId, type } = params;
    const tx = params.tx as ethers.ContractTransaction;
    // ethereum tx
    const transaction = {
      chainId,
      hash: tx.hash,
      type,
      payload: params.payload,
      from: tx.from,
      to: tx.to as string,
      nonce: tx.nonce,
    };
    const txPool = this.get().addTXToPool(transaction, activeWallet.walletType);
    this.waitForTxReceipt(tx, tx.hash);
    return txPool[tx.hash];
  };

  startTxTracking = async (txKey: string) => {
    const txData = this.get().transactionsPool[txKey];
    if (txData) {
      const provider = this.get().providers[
        txData.chainId
      ] as StaticJsonRpcBatchProvider;
      if (txData.hash) {
        const tx = await provider.getTransaction(txData.hash);
        if (tx) {
          await this.waitForTxReceipt(tx, txData.hash);
        }
      }
    } else {
      // TODO: no transaction in waiting pool
    }
  };

  private waitForTxReceipt = async (
    tx: ethers.providers.TransactionResponse,
    txHash: string
  ) => {
    const chainId = tx.chainId || this.get().transactionsPool[txHash].chainId;
    const provider = this.get().providers[
      chainId
    ] as StaticJsonRpcBatchProvider;

    try {
      const txn = await tx.wait();
      this.updateTXStatus(txHash, txn.status);

      const updatedTX = this.get().transactionsPool[txHash];
      const txBlock = await provider.getBlock(txn.blockNumber);
      const timestamp = txBlock.timestamp;
      this.get().txStatusChangedCallback({
        ...updatedTX,
        timestamp,
      });
    } catch (e) {
      console.log(e);
    }
  };

  private updateTXStatus = (hash: string, status?: number) => {
    this.set((state) =>
      produce(state, (draft) => {
        draft.transactionsPool[hash].status = status;
        draft.transactionsPool[hash].pending = false;
      })
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
