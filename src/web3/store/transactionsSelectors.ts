import isEqual from 'lodash/isEqual.js';
import { Chain } from 'viem';
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  goerli,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';

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
  hash: string,
) => {
  const txByKey = selectTXByKey<T>(state, hash);
  if (txByKey) {
    return txByKey;
  }
  return selectAllTransactions(state).find((tx) => tx.hash === hash);
};

export const selectAllTransactionsByWallet = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: string,
) => {
  return selectAllTransactions(state).filter((tx) => tx.from === from);
};

export const selectPendingTransactionByWallet = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: string,
) => {
  return selectPendingTransactions(state).filter((tx) => tx.from === from);
};

export const selectLastTxByTypeAndPayload = <T extends BaseTx>(
  state: ITransactionsState<T>,
  from: string,
  type: T['type'],
  payload: T['payload'],
) => {
  const allTransactions = selectAllTransactionsByWallet(state, from);

  console.log('allTransactions', allTransactions);

  const filteredTransactions = allTransactions.filter(
    (tx) => tx.type === type && isEqual(tx.payload, payload),
  );

  console.log('filteredTransactions', filteredTransactions);

  const lastFilteredTransaction =
    filteredTransactions[filteredTransactions.length - 1];

  console.log('lastFilteredTransaction', lastFilteredTransaction);

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
  txHash: string,
) => {
  const tx = selectTXByHash(state, txHash);
  if (!tx) {
    return '';
  }

  const gnosisSafeLinksHelper: Record<number, string> = {
    [mainnet.id]: 'https://app.safe.global/eth:',
    [goerli.id]: 'https://app.safe.global/gor:',
    [optimism.id]: 'https://app.safe.global/oeth:',
    [polygon.id]: 'https://app.safe.global/matic:',
    [arbitrum.id]: 'https://app.safe.global/arb1:',
    [avalanche.id]: 'https://app.safe.global/avax:',
    [bsc.id]: 'https://app.safe.global/bnb:',
    [base.id]: 'https://app.safe.global/base:',
  };

  if (tx.walletType !== 'GnosisSafe') {
    return `${getChainParameters(tx.chainId).blockExplorers?.default
      .url}/tx/${txHash}`;
  } else {
    return `${gnosisSafeLinksHelper[tx.chainId]}${
      tx.from
    }/transactions/tx?id=multisig_${tx.from}_${txHash}`;
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
