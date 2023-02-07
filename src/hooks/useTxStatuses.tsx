import { useEffect, useState } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

import { selectLastTxByTypeAndPayload } from '../web3/store/transactionsSelectors';
import { BaseTx, ITransactionsState } from '../web3/store/transactionsSlice';

interface TxStatusesParams<T extends BaseTx> {
  useStore: UseBoundStore<
    StoreApi<{
      getActiveAddress: () => string | undefined;
    }>
  >;
  state: ITransactionsState<T>;
  type: T['type'];
  payload: T['payload'];
}

export const useTxStatuses = <T extends BaseTx>({
  useStore,
  state,
  type,
  payload,
}: TxStatusesParams<T>) => {
  const getActiveAddress = useStore((state) => state.getActiveAddress);
  const activeAddress = getActiveAddress();

  const tx = selectLastTxByTypeAndPayload(
    state,
    activeAddress || '',
    type,
    payload
  );

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTxStart, setIsTxStart] = useState(false);

  const txHash = tx && tx.hash;
  const txPending = tx && tx.pending;
  const txSuccess = tx && tx.status === 1;
  const txChainId = tx && tx.chainId;

  useEffect(() => {
    if (txPending || !!error) {
      setIsTxStart(true);
    }
  }, [txPending, error]);

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
  };
};
