import { AddEthereumChainParameter } from '@web3-react/types';
import isEqual from 'lodash/isEqual';

import {
  BaseTx,
  GelatoBaseTx,
  isGelatoBaseTx,
  ITransactionsState,
} from './transactionsSlice';

export const selectAllTransactions = <T extends BaseTx>(
  state: ITransactionsState<T>
) => {
  return Object.values(state.transactionsPool).sort(
    (a, b) => Number(a.localTimestamp) - Number(b.localTimestamp)
  );
};

export const selectPendingTransactions = <T extends BaseTx>(
  state: ITransactionsState<T>
) => {
  return selectAllTransactions(state).filter((tx) => tx.pending);
};

export const selectTXByKey = <T extends BaseTx>(
  state: ITransactionsState<T>,
  key: string
) => {
  return state.transactionsPool[key];
};

export const selectTXByHash = <T extends BaseTx>(
  state: ITransactionsState<T>,
  hash: string
) => {
  const txByKey = selectTXByKey<T>(state, hash);
  if (txByKey) {
    return txByKey;
  }
  return selectAllTransactions(state).find((tx) => tx.hash == hash);
};

export const selectAllTransactionsByWallet = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: string
) => {
  return selectAllTransactions(state).filter((tx) => tx.from == from);
};

export const selectPendingTransactionByWallet = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: string
) => {
  return selectPendingTransactions(state).filter((tx) => tx.from == from);
};

export const selectLastTxByTypeAndPayload = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: string,
  type: T['type'],
  payload: T['payload']
) => {
  const allTransactions = selectAllTransactionsByWallet(state, from);
  const filteredTransactions = allTransactions.filter(
    (tx) => tx.type === type && isEqual(tx.payload, payload)
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
  getChainParameters: (chainId: number) => AddEthereumChainParameter,
  txHash: string
) => {
  const tx = selectTXByHash(state, txHash);
  if (!tx) {
    return '';
  }

  const gnosisSafeLinksHelper: Record<number, string> = {
    1: 'https://app.safe.global/eth:',
    5: 'https://app.safe.global/gor:',
  };

  if (tx.walletType !== 'GnosisSafe') {
    return `${
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      getChainParameters(tx.chainId).blockExplorerUrls[0]
    }/tx/${txHash}`;
  } else {
    return `${gnosisSafeLinksHelper[tx.chainId]}${
      tx.from
    }/transactions/tx?id=multisig_${tx.from}_${txHash}`;
  }
};

export const selectIsGelatoTXPending = (
  gelatoStatus?: GelatoBaseTx['gelatoStatus']
) => {
  return (
    gelatoStatus == undefined ||
    gelatoStatus == 'CheckPending' ||
    gelatoStatus == 'WaitingForConfirmation' ||
    gelatoStatus == 'ExecPending'
  );
};
