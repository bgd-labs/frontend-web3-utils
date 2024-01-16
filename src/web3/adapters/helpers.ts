import { EthPoolTx, GelatoPoolTx } from '../store/transactionsSlice';
import { GelatoBaseTx, GelatoTaskState, GelatoTx } from './GelatoAdapter';
import { SafeTx } from './SafeAdapter';
import { BaseTx, TxAdapter, TxKey } from './types';

export function isEthPoolTx(tx: EthPoolTx | GelatoPoolTx): tx is EthPoolTx {
  return (tx as EthPoolTx).hash !== undefined;
}
export function isSafeTxKey(txKey: TxKey): txKey is SafeTx {
  return (txKey as SafeTx).safeTxHash !== undefined;
}

export function isGelatoTxKey(tx: TxKey): tx is GelatoTx {
  return (tx as GelatoTx).taskId !== undefined;
}

export function isGelatoBaseTx(tx: BaseTx): tx is GelatoBaseTx {
  return (tx as GelatoBaseTx).adapter === TxAdapter.Gelato;
}

export function isGelatoTXPending(gelatoStatus?: GelatoBaseTx['gelatoStatus']) {
  return (
    gelatoStatus === undefined ||
    gelatoStatus === GelatoTaskState.CheckPending ||
    gelatoStatus === GelatoTaskState.ExecPending ||
    gelatoStatus === GelatoTaskState.WaitingForConfirmation
  );
}
