import { ethers } from 'ethers';
import { produce } from 'immer';

import { setLocalStorageTxPool } from '../../utils/localStorage';
// TODO check and move all related types if needed
import {
  BaseTx,
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
    console.log({ transaction });
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
      // TODO: change timeout for gnosis
    }, 2000);

    this.transactionsIntervalsMap[txKey] = Number(newGnosisInterval);
  };

  fetchGnosisTxStatus = async (txKey: string) => {
    const response = await fetch(
      `https://safe-transaction-goerli.safe.global/api/v1/multisig-transactions/${txKey}/`
    );
    if (!response.ok) {
      // TODO: handle error somehow
    } else {
      const gnosisStatus = (await response.json()) as GnosisTxStatusResponse;
      const isPending = !gnosisStatus.isExecuted;
      console.log({ gnosisStatus });
      this.updateGnosisTxStatus(txKey, gnosisStatus);
      if (!isPending) {
        this.stopPollingGnosisTXStatus(txKey);
        const tx = this.get().transactionsPool[txKey];
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
        draft.transactionsPool[txKey].status = statusResponse.isSuccessful
          ? 1
          : 0;
        draft.transactionsPool[txKey].pending = false;
      })
    );
    setLocalStorageTxPool(this.get().transactionsPool);
  };
}
