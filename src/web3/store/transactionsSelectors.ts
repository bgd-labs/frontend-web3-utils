import isEqual from 'lodash/isEqual.js';
import { Chain, Hex } from 'viem';

import { gnosisSafeLinksHelper } from '../../utils/constants';
import { BaseTx, TxAdapter } from '../adapters/types';
import { PoolTx, TransactionPool } from './transactionsSlice';

export const selectAllTransactions = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
) => {
  return Object.values(transactionsPool).sort(
    (a, b) => Number(a.localTimestamp) - Number(b.localTimestamp),
  );
};

export const selectPendingTransactions = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
) => {
  return selectAllTransactions(transactionsPool).filter((tx) => tx.pending);
};

export const selectTXByKey = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
  key: string,
) => {
  return transactionsPool[key];
};

export const selectTXByHash = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
  hash: Hex,
) => {
  const txByKey = selectTXByKey<T>(transactionsPool, hash);
  if (txByKey) {
    return txByKey;
  }
  return selectAllTransactions(transactionsPool).find((tx) => tx.hash === hash);
};

export const selectAllTransactionsByWallet = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
  from: Hex,
) => {
  return selectAllTransactions(transactionsPool).filter(
    (tx) => tx.from === from,
  );
};

export const selectPendingTransactionByWallet = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
  from: Hex,
) => {
  return selectPendingTransactions(transactionsPool).filter(
    (tx) => tx.from === from,
  );
};

export const selectLastTxByTypeAndPayload = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
  from: Hex,
  type: T['type'],
  payload: T['payload'],
) => {
  const allTransactions = selectAllTransactionsByWallet(transactionsPool, from);

  const filteredTransactions = allTransactions.filter(
    (tx) => tx.type === type && isEqual(tx.payload, payload),
  );

  const lastFilteredTransaction =
    filteredTransactions[filteredTransactions.length - 1];

  if (lastFilteredTransaction) {
    return selectTXByKey(transactionsPool, lastFilteredTransaction.txKey);
  } else {
    return undefined;
  }
};

export const selectTxExplorerLink = <T extends BaseTx>(
  transactionsPool: TransactionPool<PoolTx<T>>,
  getChainParameters: (chainId: number) => Chain,
  txHash: Hex,
  replacedTxHash?: Hex,
) => {
  const tx = selectTXByHash(transactionsPool, txHash);
  if (!tx) {
    return '';
  }

  const returnValue = (hash: string) => {
    if (tx.adapter !== TxAdapter.Safe) {
      return `${
        getChainParameters(tx.chainId).blockExplorers?.default.url
      }/tx/${hash}`;
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
