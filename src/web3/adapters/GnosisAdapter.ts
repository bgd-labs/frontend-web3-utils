import dayjs from 'dayjs';
import { produce } from 'immer';
import { Hex, isHex, toHex } from 'viem';

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

export function isSafeTx(tx: InitialTx): tx is SafeTx {
  return (tx as SafeTx).safeTxHash !== undefined;
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

  executeTx = async (params: {
    tx: InitialTx;
    activeWallet: Wallet;
    payload: object | undefined;
    chainId: number;
    type: T['type'];
  }) => {
    const { tx, activeWallet, chainId, type, payload } = params;
    const from = activeWallet.address;

    const initialParams = {
      chainId,
      type,
      payload: payload,
      from,
    };

    if (isSafeTx(tx)) {
      console.log('isSafeTx', tx);
      const txParams = {
        ...initialParams,
        hash: toHex(tx.safeTxHash),
      };
      this.startTxTracking(txParams.hash);
      const txPool = this.get().addTXToPool(txParams, activeWallet.walletType);
      return txPool[txParams.hash];
    } else if (isHex(tx)) {
      console.log('isHex', tx);
      const txParams = {
        ...initialParams,
        hash: tx,
      };
      this.startTxTracking(txParams.hash);
      const txPool = this.get().addTXToPool(txParams, activeWallet.walletType);
      return txPool[txParams.hash];
    } else {
      console.log('undefined', tx);
      return undefined;
    }
  };

  startTxTracking = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    if (isEthPoolTx(tx)) {
      console.log('start tx', tx);
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

      console.log('fetch address', this.get().activeWallet?.address);

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
            return response;
          }

          if (sameNonceResponse.count > 1) {
            const replacedHash = sameNonceResponse.results.filter(
              (safeTx) => safeTx.safeTxHash !== gnosisStatus.safeTxHash,
            )[0].safeTxHash;

            this.updateGnosisTxStatus(txKey, gnosisStatus, toHex(replacedHash));
            this.stopPollingGnosisTXStatus(txKey);

            return response;
          }

          this.updateGnosisTxStatus(txKey, gnosisStatus);

          if (!isPending) {
            this.stopPollingGnosisTXStatus(txKey);
            this.get().txStatusChangedCallback(tx);
          }

          return response;
        }
        return response;
      } else {
        return response;
      }
    } else {
      return response;
    }
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
        const tx = draft.transactionsPool[txKey];
        if (isEthPoolTx(tx)) {
          if (!!replacedHash) {
            tx.replacedTxHash = replacedHash;
          }

          tx.nonce = statusResponse.nonce;

          if (statusResponse.isExecuted || !!replacedHash) {
            if (statusResponse.isSuccessful) {
              tx.status = TransactionStatus.Success;
            } else if (!!replacedHash) {
              tx.status = TransactionStatus.Replaced;
            } else {
              tx.status = TransactionStatus.Reverted;
            }
          }

          tx.pending = !statusResponse.isExecuted && !replacedHash;
        }
      }),
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
