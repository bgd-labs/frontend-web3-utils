import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex, isHex } from 'viem';

import { SafeTransactionServiceUrls } from '../../utils/constants';
import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  BaseTx,
  isEthPoolTx,
  ITransactionsSliceWithWallet,
  TransactionStatus,
  TxKey,
} from '../store/transactionsSlice';
import { preExecuteTx } from './helpers';
import { AdapterInterface, ExecuteTxParams } from './interface';

export type GnosisTxStatusResponse = {
  transactionHash: string;
  safeTxHash: string;
  isExecuted: boolean;
  isSuccessful: boolean | null;
  executionDate: string | null;
  submissionDate: string | null;
  modified: string;
  nonce: number;
};

export type GnosisTxSameNonceResponse = {
  count: number;
  countUniqueNonce: number;
  results: GnosisTxStatusResponse[];
};

export type SafeTx = {
  safeTxHash: string;
};

export function isSafeTx(txKey: TxKey): txKey is SafeTx {
  return (txKey as SafeTx).safeTxHash !== undefined;
}

export class GnosisAdapter<T extends BaseTx> implements AdapterInterface<T> {
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
    const { txKey, activeWallet, txParams, argsForExecute } =
      preExecuteTx(params);

    if (txParams) {
      const safeTxParams = { ...txParams, isSafeTx: true };
      const addToPool = (key: Hex) => {
        const txPool = this.get().addTXToPool(
          safeTxParams,
          activeWallet.walletType,
        );
        this.startTxTracking(key);
        return txPool[key];
      };

      if (isSafeTx(txKey) && isHex(txKey.safeTxHash)) {
        return addToPool(txKey.safeTxHash);
      } else if (isHex(txKey)) {
        // check if tx real on safe (need for safe + wallet connect)
        if (
          activeWallet.walletType === 'WalletConnect' &&
          activeWallet.isContractAddress
        ) {
          const response = await fetch(
            `${
              SafeTransactionServiceUrls[txParams.chainId]
            }/multisig-transactions/${txKey}/`,
          );

          if (response.ok) {
            return addToPool(txKey);
          } else {
            this.get().updateEthAdapter(false);
            return this.get().ethereumAdapter.executeTx(argsForExecute);
          }
        } else {
          return addToPool(txKey);
        }
      } else {
        return undefined;
      }
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

      this.stopPollingGnosisTXStatus(txKey);

      let retryCount = 5;
      const newGnosisInterval = setInterval(async () => {
        if (retryCount > 0) {
          const response = await this.fetchGnosisTxStatus(txKey);
          if (!response.ok) {
            retryCount--;
          }
        } else {
          this.stopPollingGnosisTXStatus(txKey);
          this.get().removeTXFromPool(txKey);
          return;
        }
      }, 5000);

      this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
    }
  };

  private fetchGnosisTxStatus = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    const response = await fetch(
      `${
        SafeTransactionServiceUrls[tx.chainId]
      }/multisig-transactions/${txKey}/`,
    );

    if (response.ok) {
      const gnosisStatus = (await response.json()) as GnosisTxStatusResponse;

      if (gnosisStatus.nonce) {
        const allTxWithSameNonceResponse = await fetch(
          `${SafeTransactionServiceUrls[tx.chainId]}/safes/${this.get()
            .activeWallet?.address}/multisig-transactions/?nonce=${
            gnosisStatus.nonce
          }`,
        );

        if (allTxWithSameNonceResponse.ok) {
          const sameNonceResponse =
            (await allTxWithSameNonceResponse.json()) as GnosisTxSameNonceResponse;

          const isPending =
            !gnosisStatus.isExecuted && sameNonceResponse.count <= 1;

          // check if more than a day passed and tx wasn't executed still, remove the transaction from the pool
          const gnosisStatusModified = dayjs(gnosisStatus.modified);
          const currentTime = dayjs();
          const daysPassed = currentTime.diff(gnosisStatusModified, 'day');
          if (daysPassed >= 1 && isPending) {
            this.stopPollingGnosisTXStatus(txKey);
            this.get().removeTXFromPool(txKey);
          }

          if (sameNonceResponse.count > 1) {
            const replacedHash = sameNonceResponse.results.filter(
              (safeTx) => safeTx.safeTxHash !== gnosisStatus.safeTxHash,
            )[0].safeTxHash;

            if (isHex(replacedHash)) {
              this.updateGnosisTxStatus(txKey, gnosisStatus, replacedHash);
              this.stopPollingGnosisTXStatus(txKey);
            }
          }

          this.updateGnosisTxStatus(txKey, gnosisStatus);

          if (!isPending) {
            this.stopPollingGnosisTXStatus(txKey);
            this.get().txStatusChangedCallback(tx);
          }
        }
      }
    }

    return response;
  };

  private stopPollingGnosisTXStatus = (txKey: string) => {
    const currentInterval = this.transactionsIntervalsMap[txKey];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[txKey] = undefined;
  };

  private updateGnosisTxStatus = (
    txKey: string,
    statusResponse: GnosisTxStatusResponse,
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
