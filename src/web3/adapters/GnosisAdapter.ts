import { ethers } from 'ethers';
import { produce } from 'immer';

import { SafeTransactionServiceUrls } from '../../utils/constants';
import { setLocalStorageTxPool } from '../../utils/localStorage';
import {
  BaseTx,
  EthBaseTx,
  GelatoTx,
  GnosisTxStatusResponse,
  ITransactionsSlice,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { GnosisAdapterInterface } from './interface';

export class GnosisAdapter<T extends BaseTx>
  implements GnosisAdapterInterface<T>
{
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
    this.startTxTracking(tx.hash);
    return txPool[tx.hash];
  };

  startTxTracking = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    const isPending = tx.pending;
    if (!isPending) {
      return;
    }
    this.stopPollingGnosisTXStatus(txKey);

    const newGnosisInterval = setInterval(() => {
      this.fetchGnosisTxStatus(txKey);
      // TODO: maybe change timeout or even stop tracking after some time (1day/week)
    }, 5000);

    this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
  };

  fetchGnosisTxStatus = async (txKey: string) => {
    const tx = this.get().transactionsPool[txKey];
    const response = await fetch(
      `${
        SafeTransactionServiceUrls[tx.chainId]
      }/multisig-transactions/${txKey}/`
    );
    if (!response.ok) {
      // TODO: handle error if need, for now just skipping and do nothing with failed response
    } else {
      const gnosisStatus = (await response.json()) as GnosisTxStatusResponse;
      const isPending = !gnosisStatus.isExecuted;
      this.updateGnosisTxStatus(txKey, gnosisStatus);
      if (!isPending) {
        this.stopPollingGnosisTXStatus(txKey);
        this.get().txStatusChangedCallback(tx);
      }
    }
  };

  stopPollingGnosisTXStatus = (txKey: string) => {
    const currentInterval = this.transactionsIntervalsMap[txKey];
    clearInterval(currentInterval);
    this.transactionsIntervalsMap[txKey] = undefined;
  };

  updateGnosisTxStatus = (
    txKey: string,
    statusResponse: GnosisTxStatusResponse
  ) => {
    this.set((state) =>
      produce(state, (draft) => {
        const tx = draft.transactionsPool[txKey] as EthBaseTx & {
          pending: boolean;
          status?: number;
        };
        tx.status = +!!statusResponse.isSuccessful; // turns boolean | null to 0 or 1
        tx.pending = !statusResponse.isExecuted;
        tx.nonce = statusResponse.nonce;
      })
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
