import { useEffect, useState } from 'react';
import { Hex } from 'viem';

import { isGelatoBaseTx } from '../web3/adapters/GelatoAdapter';
import { selectLastTxByTypeAndPayload } from '../web3/store/transactionsSelectors';
import {
  BaseTx,
  ITransactionsState,
  TransactionStatus,
} from '../web3/store/transactionsSlice';

interface LastTxStatusesParams<T extends BaseTx> {
  state: ITransactionsState<T>;
  activeAddress: Hex;
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

  const [fullTxErrorMessage, setFullTxErrorMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [isTxStart, setIsTxStart] = useState(false);

  const txHash = tx?.hash;
  const txPending = tx?.pending;

  let isError: boolean = false;
  if (tx) {
    if (isGelatoBaseTx(tx)) {
      isError =
        !tx.pending && (tx.status !== TransactionStatus.Success || !!error);
    } else if (
      !tx.pending &&
      tx.status !== TransactionStatus.Success &&
      tx.status !== TransactionStatus.Replaced
    ) {
      isError = true;
    } else {
      isError = !!error;
    }
  }

  const txSuccess = tx?.status === TransactionStatus.Success && !isError;
  const txChainId = tx?.chainId;
  const txWalletType = tx?.walletType;
  const isTxReplaced = tx?.status === TransactionStatus.Replaced;
  const replacedTxHash = tx?.replacedTxHash;

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
        setFullTxErrorMessage(e.message);
        setError(!!errorMessage ? errorMessage : e.message);
      } else if (typeof e === 'string') {
        setFullTxErrorMessage(e);
        setError(!!errorMessage ? errorMessage : e);
      }
      console.error('TX error: ', e);
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
