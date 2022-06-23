import { BaseTx, ITransactionsState } from "./transactionsSlice";

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
  if (state.transactionsPool[hash]) {
    return state.transactionsPool[hash]
  }
};
