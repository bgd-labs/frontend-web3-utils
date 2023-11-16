import { isHex } from 'viem';

import {
  BaseTx,
  ITransactionsSliceWithWallet,
} from '../store/transactionsSlice';
import { isGelatoTx } from './GelatoAdapter';
import { isSafeTx } from './GnosisAdapter';
import { ExecuteTxParams } from './interface';

export class BaseAdapter<T extends BaseTx> {
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

  preExecuteTx = (params: ExecuteTxParams<T>) => {
    const { txKey, activeWallet, chainId, type, payload } = params;
    const from = activeWallet.address;

    const initialParams = {
      type,
      payload,
      chainId,
    };

    const argsForExecute = {
      txKey,
      activeWallet,
      ...initialParams,
    };

    const initialParamsForAddTxToPool = {
      ...initialParams,
      from,
    };

    if (isGelatoTx(txKey)) {
      const txParams = {
        ...initialParamsForAddTxToPool,
        taskId: txKey.taskId,
      };

      return {
        txKey,
        activeWallet,
        txParams,
        argsForExecute,
      };
    } else if (isSafeTx(txKey) && isHex(txKey.safeTxHash)) {
      const txParams = {
        ...initialParamsForAddTxToPool,
        hash: txKey.safeTxHash,
      };

      return {
        txKey,
        activeWallet,
        txParams,
        argsForExecute,
      };
    } else if (isHex(txKey)) {
      const txParams = {
        ...initialParamsForAddTxToPool,
        hash: txKey,
      };

      return {
        txKey,
        activeWallet,
        txParams,
        argsForExecute,
      };
    } else {
      return {
        txKey,
        activeWallet,
        argsForExecute,
      };
    }
  };
}
