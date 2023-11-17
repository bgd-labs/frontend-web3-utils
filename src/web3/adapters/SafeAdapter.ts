import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex, isHex } from 'viem';

import { SafeTransactionServiceUrls } from '../../utils/constants';
import { setLocalStorageTxPool } from '../../utils/localStorage';
import { ITransactionsSliceWithWallet } from '../store/transactionsSlice';
import { isEthPoolTx, preExecuteTx } from './helpers';
import {
  AdapterInterface,
  BaseTx,
  ExecuteTxParams,
  TransactionStatus,
} from './types';

export type SafeTxStatusResponse = {
  transactionHash: string;
  safeTxHash: string;
  isExecuted: boolean;
  isSuccessful: boolean | null;
  executionDate: string | null;
  submissionDate: string | null;
  modified: string;
  nonce: number;
};

export type SafeTxSameNonceResponse = {
  count: number;
  countUniqueNonce: number;
  results: SafeTxStatusResponse[];
};

export type SafeTx = {
  safeTxHash: string;
};

export class SafeAdapter<T extends BaseTx> implements AdapterInterface<T> {
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
    if (txParams) {
      const safeTxParams = { ...txParams, isSafeTx: true };
      const txPool = this.get().addTXToPool(
        safeTxParams,
        activeWallet.walletType,
      );
      this.startTxTracking(txKey);
      return txPool[txKey];
    } else {
      return undefined;
    }
  };

  startTxTracking = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];

    if (isEthPoolTx(tx)) {
      const isPending = tx.pending;
      if (!isPending) {
        return;
      }

      this.stopPollingSafeTXStatus(txKey);

      let retryCount = 5;
      const newGnosisInterval = setInterval(async () => {
        if (retryCount > 0) {
          const response = await this.fetchSafeTxStatus(txKey);
          if (!response.ok) {
            retryCount--;
          }
        } else {
          this.stopPollingSafeTXStatus(txKey);
          this.get().removeTXFromPool(txKey);
          return;
        }
      }, 5000);

      this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
    }
  };

  private fetchSafeTxStatus = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    const response = await fetch(
      `${
        SafeTransactionServiceUrls[tx.chainId]
      }/multisig-transactions/${txKey}/`,
    );

    if (response.ok) {
      const safeStatus = (await response.json()) as SafeTxStatusResponse;

      if (safeStatus.nonce) {
        const allTxWithSameNonceResponse = await fetch(
          `${SafeTransactionServiceUrls[tx.chainId]}/safes/${this.get()
            .activeWallet?.address}/multisig-transactions/?nonce=${
            safeStatus.nonce
          }`,
        );

        if (allTxWithSameNonceResponse.ok) {
          const sameNonceResponse =
            (await allTxWithSameNonceResponse.json()) as SafeTxSameNonceResponse;

          const isPending =
            !safeStatus.isExecuted && sameNonceResponse.count <= 1;

          // check if more than a day passed and tx wasn't executed still, remove the transaction from the pool
          const gnosisStatusModified = dayjs(safeStatus.modified);
          const currentTime = dayjs();
          const daysPassed = currentTime.diff(gnosisStatusModified, 'day');
          if (daysPassed >= 1 && isPending) {
            this.stopPollingSafeTXStatus(txKey);
            this.get().removeTXFromPool(txKey);
            return response;
          }

          if (sameNonceResponse.count > 1) {
            const replacedHash = sameNonceResponse.results.filter(
              (safeTx) => safeTx.safeTxHash !== safeStatus.safeTxHash,
            )[0].safeTxHash;

            if (isHex(replacedHash)) {
              this.updateSafeTxStatus(txKey, safeStatus, replacedHash);
              this.stopPollingSafeTXStatus(txKey);
              return response;
            }
          }

          this.updateSafeTxStatus(txKey, safeStatus);

          if (!isPending) {
            this.stopPollingSafeTXStatus(txKey);
            this.get().txStatusChangedCallback(tx);
          }
        }
      }
    }

    return response;
  };

  private stopPollingSafeTXStatus = (txKey: string) => {
    const currentInterval = this.transactionsIntervalsMap[txKey];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[txKey] = undefined;
  };

  private updateSafeTxStatus = (
    txKey: string,
    statusResponse: SafeTxStatusResponse,
    replacedHash?: Hex,
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        let status = undefined;
        if (statusResponse.isExecuted || !!replacedHash) {
          if (statusResponse.isSuccessful) {
            status = TransactionStatus.Success;
          } else if (!!replacedHash) {
            status = TransactionStatus.Replaced;
          } else {
            status = TransactionStatus.Reverted;
          }
        }

        const pending = !statusResponse.isExecuted && !replacedHash;

        if (isEthPoolTx(draft.transactionsPool[txKey])) {
          draft.transactionsPool[txKey] = {
            ...draft.transactionsPool[txKey],
            pending,
            status,
            nonce: statusResponse.nonce,
            replacedTxHash: replacedHash,
            isError:
              !pending &&
              status !== TransactionStatus.Success &&
              status !== TransactionStatus.Replaced,
          };
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
