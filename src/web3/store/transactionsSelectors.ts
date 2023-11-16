import isEqual from 'lodash/isEqual.js';
import { Chain, Hex } from 'viem';

import { gnosisSafeLinksHelper } from '../../utils/constants';
import { isGelatoBaseTx } from '../adapters/GelatoAdapter';
import { BaseTx, GelatoBaseTx, ITransactionsState } from './transactionsSlice';

export const selectAllTransactions = <T extends BaseTx>(
  state: ITransactionsState<T>,
) => {
  return Object.values(state.transactionsPool).sort(
    (a, b) => Number(a.localTimestamp) - Number(b.localTimestamp),
  );
};

export const selectPendingTransactions = <T extends BaseTx>(
  state: ITransactionsState<T>,
) => {
  return selectAllTransactions(state).filter((tx) => tx.pending);
};

export const selectTXByKey = <T extends BaseTx>(
  state: ITransactionsState<T>,
  key: string,
) => {
  return state.transactionsPool[key];
};

export const selectTXByHash = <T extends BaseTx>(
  state: ITransactionsState<T>,
  hash: Hex,
) => {
  const txByKey = selectTXByKey<T>(state, hash);
  if (txByKey) {
    return txByKey;
  }
  return selectAllTransactions(state).find((tx) => tx.hash === hash);
};

export const selectAllTransactionsByWallet = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: Hex,
) => {
  return selectAllTransactions(state).filter((tx) => tx.from === from);
};

export const selectPendingTransactionByWallet = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: Hex,
) => {
  return selectPendingTransactions(state).filter((tx) => tx.from === from);
};

export const selectLastTxByTypeAndPayload = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: Hex,
  type: T['type'],
  payload: T['payload'],
) => {
  const allTransactions = selectAllTransactionsByWallet(state, from);

  const filteredTransactions = allTransactions.filter(
    (tx) => tx.type === type && isEqual(tx.payload, payload),
  );

  const lastFilteredTransaction =
    filteredTransactions[filteredTransactions.length - 1];

  if (lastFilteredTransaction) {
    if (isGelatoBaseTx(lastFilteredTransaction)) {
      return selectTXByKey(state, lastFilteredTransaction.taskId);
    } else {
      if (lastFilteredTransaction.hash) {
        return selectTXByKey(state, lastFilteredTransaction.hash);
      } else {
        return undefined;
      }
    }
  } else {
    return undefined;
  }
};

export const selectTxExplorerLink = <T extends BaseTx>(
  state: ITransactionsState<T>,
  getChainParameters: (chainId: number) => Chain,
  txHash: Hex,
  replacedTxHash?: Hex,
) => {
  const tx = selectTXByHash(state, txHash);
  if (!tx) {
    return '';
  }

  const returnValue = (hash: string) => {
    if (!tx.isSafeTx) {
      return `${getChainParameters(tx.chainId).blockExplorers?.default
        .url}/tx/${hash}`;
    } else {
      return `${gnosisSafeLinksHelper[tx.chainId]}${
        tx.from
      }/transactions/tx?id=multisig_${tx.from}_${hash}`;
    }
  };

  if (!!replacedTxHash) {
    return returnValue(replacedTxHash);
  } else {
    return returnValue(txHash);
  }
};

export const selectIsGelatoTXPending = (
  gelatoStatus?: GelatoBaseTx['gelatoStatus'],
) => {
  return (
    gelatoStatus === undefined ||
    gelatoStatus === 'CheckPending' ||
    gelatoStatus === 'WaitingForConfirmation' ||
    gelatoStatus === 'ExecPending'
  );
};
