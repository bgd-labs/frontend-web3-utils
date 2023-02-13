import { useEffect, useState } from 'react';

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
  const txSuccess = tx && tx.status === 1;
  const txChainId = tx && tx.chainId;
  const txWalletType = tx && tx.walletType;

  useEffect(() => {
    if (txPending || !!error) {
      setIsTxStart(true);
    }
  }, [txPending, error]);

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
    executeTxWithLocalStatuses,
  };
};