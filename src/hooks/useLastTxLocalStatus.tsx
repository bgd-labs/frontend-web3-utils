import { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { BaseTx, TransactionStatus } from '../web3/adapters/types';
import { selectLastTxByTypeAndPayload } from '../web3/store/transactionsSelectors';
import { PoolTx, TransactionPool } from '../web3/store/transactionsSlice';

interface LastTxStatusesParams<T extends BaseTx> {
  transactionsPool: TransactionPool<PoolTx<T>>;
  activeAddress: Hex;
  type: T['type'];
  payload: T['payload'];
}

type ExecuteTxWithLocalStatusesParams = {
  customErrorMessage?: string;
  callbackFunction: () => Promise<void>;
};

export type TxLocalStatusTxParams<T extends BaseTx> = PoolTx<T> & {
  isError: boolean;
  isSuccess: boolean;
  isReplaced: boolean;
};

export interface TxLocalStatus<T extends BaseTx> {
  isTxStart: boolean;
  setIsTxStart: (value: boolean) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  fullTxErrorMessage: string;
  setFullTxErrorMessage: (value: string) => void;
  error: string;
  setError: (value: string) => void;
  executeTxWithLocalStatuses: (
    params: ExecuteTxWithLocalStatusesParams,
  ) => Promise<void>;
  tx: TxLocalStatusTxParams<T>;
}

/**
 * useLastTxLocalStatus function
 * @param transactionsPool All transactions data from local storage or zustand store
 * @param activeAddress Connected wallet address
 * @param type Transaction type
 * @param payload Transaction payload data
 */
export const useLastTxLocalStatus = <T extends BaseTx>({
  transactionsPool,
  activeAddress,
  type,
  payload,
}: LastTxStatusesParams<T>) => {
  const tx = selectLastTxByTypeAndPayload(
    transactionsPool,
    activeAddress,
    type,
    payload,
  );

  const [isTxStart, setIsTxStart] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fullTxErrorMessage, setFullTxErrorMessage] = useState('');
  const [error, setError] = useState('');

  const isError = tx?.isError || !!error;
  const isSuccess = tx?.status === TransactionStatus.Success && !isError;
  const isReplaced = tx?.status === TransactionStatus.Replaced;

  useEffect(() => {
    return () => {
      setFullTxErrorMessage('');
      setError('');
    };
  }, []);

  useEffect(() => {
    if (tx?.pending || isError || isReplaced) {
      setIsTxStart(true);
    }
  }, [tx?.pending, isError, isReplaced]);

  useEffect(() => {
    if (tx?.errorMessage) {
      setError(tx.errorMessage);
    }
  }, [tx?.errorMessage]);

  const executeTxWithLocalStatuses = async ({
    customErrorMessage,
    callbackFunction,
  }: ExecuteTxWithLocalStatusesParams) => {
    setError('');
    setLoading(true);
    try {
      await callbackFunction();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setFullTxErrorMessage(errorMessage);
      setError(customErrorMessage || errorMessage);
      console.error('TX error: ', e);
    }
    setLoading(false);
  };

  return {
    isTxStart,
    setIsTxStart,
    loading,
    setLoading,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    error,
    setError,
    executeTxWithLocalStatuses,
    tx: {
      ...tx,
      isError,
      isSuccess,
      isReplaced,
    },
  } as unknown as TxLocalStatus<T>;
};
