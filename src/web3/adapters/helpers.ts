import { isHex } from 'viem';

import { BaseTx } from '../store/transactionsSlice';
import { isGelatoTx } from './GelatoAdapter';
import { isSafeTx } from './GnosisAdapter';
import { ExecuteTxParams } from './interface';

export function preExecuteTx<T extends BaseTx>(params: ExecuteTxParams<T>) {
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
}
