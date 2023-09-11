'use client';

import { useEffect, useState } from 'react';

import { isGelatoBaseTx } from '../web3/adapters/GelatoAdapter';
import { selectLastTxByTypeAndPayload } from '../web3/store/transactionsSelectors';
import { BaseTx, ITransactionsState } from '../web3/store/transactionsSlice';

interface LastTxStatusesParams<T extends BaseTx> {
  state: ITransactionsState<T>;
  activeAddress: string;
  type: T['type'];
  payload: T['payload'];
}

type ExecuteTxWithLocalStatusesParams = {
  errorMessage: string;
  callbackFunction: () => Promise<void>;
};

export const useLastTxLocalStatus = <T extends BaseTx>({
  state,
  activeAddress,
  type,
  payload,
}: LastTxStatusesParams<T>) => {
  const tx = selectLastTxByTypeAndPayload(state, activeAddress, type, payload);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTxStart, setIsTxStart] = useState(false);

  const txHash = tx && tx.hash;
  const txPending = tx && tx.pending;
  const isError =
    tx && isGelatoBaseTx(tx)
      ? !tx.pending && (tx.status !== 1 || !!error)
      : (tx && !tx.pending && tx.status !== 1) || !!error;
  const txSuccess = tx && tx.status === 1 && !isError;
  const txChainId = tx && tx.chainId;
  const txWalletType = tx && tx.walletType;

  useEffect(() => {
    if (txPending || isError) {
      setIsTxStart(true);
    }
  }, [txPending, isError]);

  useEffect(() => {
    if (tx?.errorMessage) {
      setError(tx.errorMessage);
    }
  }, [tx?.errorMessage]);

  async function executeTxWithLocalStatuses({
    errorMessage,
    callbackFunction,
  }: ExecuteTxWithLocalStatusesParams) {
    setError('');
    setLoading(true);
    try {
      await callbackFunction();
    } catch (e) {
      console.error('TX error: ', e);
      setError(errorMessage);
    }
    setLoading(false);
  }

  return {
    error,
    setError,
    loading,
    setLoading,
    isTxStart,
    setIsTxStart,
    txHash,
    txPending,
    txSuccess,
    txChainId,
    txWalletType,
    isError,
    executeTxWithLocalStatuses,
  };
};
