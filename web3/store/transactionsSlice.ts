import { providers } from "ethers";

type Web3ProvidersSlice = {
  l1Provider: providers.JsonRpcProvider;
  l2Provider: providers.JsonRpcProvider;
};

import produce, { Draft } from "immer";
import { StoreSlice } from "../../types/store";
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from "../../utils/localStorage";

type BaseTx = {
  type: string;
  payload: object;
  network: "L2" | "L1";
  hash: string;
};

export type CreateProposalTx<T extends BaseTx> = T;

export type TransactionPool<T extends BaseTx> = Record<string, T>;

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<T>;
}

interface ITransactionsActions<T extends BaseTx> {
  callbackObserver: (data: T) => void;
  addTx: (data: T) => void;
  waitForTx: (hash: string) => void;
  removeTx: (hash: string) => void;
  initTxPool: () => void;
}

export type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> &
  ITransactionsState<T>;

export function createTransactionsSlice<T extends BaseTx>({
  callbackObserver,
}: {
  callbackObserver: (tx: T) => void;
}): // callbackObserver: (tx: T) => void
StoreSlice<ITransactionsSlice<T>, Web3ProvidersSlice> {
  return (set, get) => ({
    transactionsPool: {},
    callbackObserver,

    addTx: async (data) => {
      set((state) =>
        produce(state, (draft) => {
          draft.transactionsPool[data.hash] = data as Draft<T>;
        })
      );
      const txPool = get().transactionsPool;
      setLocalStorageTxPool(txPool);
      get().waitForTx(data.hash);
    },

    waitForTx: async (hash) => {
      const txData = get().transactionsPool[hash];
      if (txData) {
        const provider =
          txData.network == "L2" ? get().l2Provider : get().l1Provider;
        const txn = await provider.getTransactionReceipt(hash);
        if (txn.status == 1) {
          get().callbackObserver(txData);
        } else {
          // TODO: notify about failed tx
        }
        get().removeTx(hash);
      } else {
        // TODO: no transaction in waiting pool
      }
    },

    removeTx: async (hash) => {
      set((state) =>
        produce(state, (draft) => {
          delete draft.transactionsPool[hash];
        })
      );
      setLocalStorageTxPool(get().transactionsPool);
    },
    initTxPool: () => {
      const localStorageTXPool = getLocalStorageTxPool();
      if (localStorageTXPool) {
        const transactionsPool = JSON.parse(localStorageTXPool);
        // TODO: figure out type casting from string via ZOD or similar
        set(() => ({
          transactionsPool,
        }));
      }
      Object.keys(get().transactionsPool).forEach((hash) => {
        get().waitForTx(hash);
      });
    },
  });
}
