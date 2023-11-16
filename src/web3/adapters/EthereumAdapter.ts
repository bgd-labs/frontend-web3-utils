import { produce } from 'immer';
import { Hex, isHex } from 'viem';

import { SafeTransactionServiceUrls } from '../../utils/constants';
import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  BaseTx,
  InitialTx,
  isEthPoolTx,
  ITransactionsSliceWithWallet,
  TransactionStatus,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { AdapterInterface } from './interface';

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

  executeTx = async (params: {
    tx: InitialTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }) => {
    const { tx, activeWallet, chainId, type, payload } = params;

    const from = activeWallet.address;
    if (isHex(tx)) {
      const txParams = {
        chainId,
        hash: tx,
        type,
        payload: payload,
        from,
      };

      if (activeWallet.walletType === 'WalletConnect') {
        // check if tx real on safe (need for safe + wallet connect)
        const response = await fetch(
          `${
            SafeTransactionServiceUrls[txParams.chainId]
          }/multisig-transactions/${tx}/`,
        );

        if (response.ok) {
          const args = {
            tx,
            payload,
            activeWallet,
            chainId,
            type,
          };

          this.get().updateEthAdapter(true);
          return this.get().ethereumAdapter.executeTx(args);
        } else {
          const txPool = this.get().addTXToPool(
            txParams,
            activeWallet.walletType,
          );
          this.waitForTxReceipt(txParams.hash);
          return txPool[txParams.hash];
        }
      } else {
        const txPool = this.get().addTXToPool(
          txParams,
          activeWallet.walletType,
        );
        this.waitForTxReceipt(txParams.hash);
        return txPool[txParams.hash];
      }
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
              this.updateTXStatus({
                hash: txData.hash,
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
          this.updateTXStatus({
            hash: txHash,
            status: TransactionStatus.Replaced,
            replacedHash: replacement.transaction.hash,
          });
          txWasReplaced = true;
        },
      });
      if (txWasReplaced) {
        return;
      }

      this.updateTXStatus({
        hash: txHash,
        status:
          txn.status === 'success'
            ? TransactionStatus.Success
            : TransactionStatus.Reverted,
        to: txn.to as Hex,
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
      this.updateTXStatus({
        hash: txHash,
        status: TransactionStatus.Failed,
      });
      console.error('Error when check tx receipt', e);
    }
  };

  private updateTXStatus = ({
    hash,
    status,
    replacedHash,
    to,
    nonce,
  }: {
    hash: Hex;
    status?: TransactionStatus;
    replacedHash?: Hex;
    to?: Hex;
    nonce?: number;
  }) => {
    this.set((state) =>
      produce(state, (draft) => {
        const tx = draft.transactionsPool[hash];

        if (isEthPoolTx(tx)) {
          tx.pending = false;
          tx.status =
            status !== TransactionStatus.Reverted
              ? status
              : TransactionStatus.Reverted;

          if (to) {
            tx.to = to;
          }

          if (nonce) {
            tx.nonce = nonce;
          }

          if (replacedHash) {
            tx.replacedTxHash = replacedHash;
          }
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
