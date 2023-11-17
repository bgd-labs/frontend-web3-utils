import { isHex } from 'viem';

import { EthPoolTx, GelatoPoolTx } from '../store/transactionsSlice';
import { GelatoBaseTx, GelatoTx } from './GelatoAdapter';
import { SafeTx } from './SafeAdapter';
import { BaseTx, ExecuteTxParams, TxKey } from './types';

export function isSafeTx(txKey: TxKey): txKey is SafeTx {
  return (txKey as SafeTx).safeTxHash !== undefined;
}

export function isGelatoTx(tx: TxKey): tx is GelatoTx {
  return (tx as GelatoTx).taskId !== undefined;
}

export function isGelatoBaseTx(tx: BaseTx): tx is GelatoBaseTx {
  return (tx as GelatoBaseTx).taskId !== undefined;
}

export function isGelatoBaseTxWithoutTimestamp(
  tx: Omit<BaseTx, 'localTimestamp'>,
): tx is Omit<GelatoBaseTx, 'localTimestamp'> {
  return (tx as GelatoBaseTx).taskId !== undefined;
}

export function isEthPoolTx(tx: EthPoolTx | GelatoPoolTx): tx is EthPoolTx {
  return (tx as EthPoolTx).hash !== undefined;
}

export function preExecuteTx<T extends BaseTx>(params: ExecuteTxParams<T>) {
  const { txKey, activeWallet, chainId, type, payload } = params;
  const from = activeWallet.address;

  const initialParams = {
    type,
    payload,
    chainId,
    from,
  };

  if (isGelatoTx(txKey)) {
    const txParams = {
      ...initialParams,
      taskId: txKey.taskId,
    };

    return {
      txKey: txKey.taskId,
      activeWallet,
      txParams,
    };
  } else if (isSafeTx(txKey) && isHex(txKey.safeTxHash)) {
    const txParams = {
      ...initialParams,
      hash: txKey.safeTxHash,
    };

    return {
      txKey: txKey.safeTxHash,
      activeWallet,
      txParams,
    };
  } else if (isHex(txKey)) {
    const txParams = {
      ...initialParams,
      hash: txKey,
    };

    return {
      txKey,
      activeWallet,
      txParams,
    };
  } else {
    return {
      txKey,
      activeWallet,
    };
  }
}
