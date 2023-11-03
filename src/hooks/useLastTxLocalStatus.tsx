import { useEffect, useState } from 'react';

import { isGelatoBaseTx } from '../web3/adapters/GelatoAdapter';
import { selectLastTxByTypeAndPayload } from '../web3/store/transactionsSelectors';
import {
  BaseTx,
  ITransactionsState,
  TransactionStatus,
} from '../web3/store/transactionsSlice';

interface LastTxStatusesParams<T extends BaseTx> {
  state: ITransactionsState<T>;
  activeAddress: string;
  type: T['type'];
  payload: T['payload'];
}

type ExecuteTxWithLocalStatusesParams = {
  errorMessage?: string;
  callbackFunction: () => Promise<void>;
};

export const useLastTxLocalStatus = <T extends BaseTx>({
  state,
  activeAddress,
  type,
  payload,
}: LastTxStatusesParams<T>) => {
  const tx = selectLastTxByTypeAndPayload(state, activeAddress, type, payload);

  const [fullTxErrorMessage, setFullTxErrorMessage] = useState<string | Error>(
    '',
  );
  const [error, setError] = useState<string | Error>('');
  const [loading, setLoading] = useState(false);
  const [isTxStart, setIsTxStart] = useState(false);

  const txHash = tx && tx.hash;
  const txPending = tx && tx.pending;
  const isError =
    tx && isGelatoBaseTx(tx)
      ? !tx.pending && (tx.status !== TransactionStatus.Success || !!error)
      : (tx &&
          !tx.pending &&
          tx.status !== TransactionStatus.Success &&
          tx.status !== TransactionStatus.Replaced) ||
        !!error;
  const txSuccess = tx && tx.status === TransactionStatus.Success && !isError;
  const txChainId = tx && tx.chainId;
  const txWalletType = tx && tx.walletType;
  const isTxReplaced = tx && tx.status === TransactionStatus.Replaced;
  const replacedTxHash = tx && tx.replacedTxHash;

  useEffect(() => {
    return () => {
      setFullTxErrorMessage('');
      setError('');
    };
  }, []);

  useEffect(() => {
    if (txPending || isError || isTxReplaced) {
      setIsTxStart(true);
    }
  }, [txPending, isError, isTxReplaced]);

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
      if (e instanceof Error) {
        console.error('TX error: ', e);
        setFullTxErrorMessage(!!e?.message ? e.message : e);
        setError(!!errorMessage ? errorMessage : !!e?.message ? e.message : e);
      }
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
    fullTxErrorMessage,
    setFullTxErrorMessage,
    isTxReplaced,
    replacedTxHash,
  };
};
