import _ from 'lodash';

import { BaseTx, ITransactionsState } from './transactionsSlice';

export const selectAllTransactions = <T extends BaseTx>(
  state: ITransactionsState<T>
) => {
  return Object.values(state.transactionsPool).sort(
    (a, b) => a.nonce - b.nonce
  );
};

export const selectPendingTransactions = <T extends BaseTx>(
  state: ITransactionsState<T>
) => {
  return selectAllTransactions(state).filter((tx) => tx.pending);
};

export const selectTXByHash = <T extends BaseTx>(
  state: ITransactionsState<T>,
  hash: string
) => {
  return state.transactionsPool[hash];
};

export const selectLastTxByTypeAndPayload = <T extends BaseTx>(
  state: ITransactionsState<T>,
  type: T['type'],
  payload: T['payload']
) => {
  const allTransactions = selectAllTransactions(state);
  const filteredTransactions = allTransactions.filter(
    (tx) => tx.type === type && _.isEqual(tx.payload, payload)
  );
  const lastFilteredTransaction =
    filteredTransactions[filteredTransactions.length - 1];

  return selectTXByHash(state, lastFilteredTransaction.hash);
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
