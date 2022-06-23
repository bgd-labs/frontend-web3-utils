import { ethers, providers } from "ethers";

import produce, { Draft } from "immer";
import { StoreSlice } from "../../types/store";
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from "../../utils/localStorage";

export type BaseTx = {
  type: string;
  hash: string;
  from: string;
  to: string;
  nonce: number;
  payload?: object;
  chainId: number;
};

export type ProvidersRecord = Record<number, ethers.providers.JsonRpcProvider>;

export type TransactionPool<T extends BaseTx> = Record<string, T>;

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<
    T & {
      status?: number;
      pending: boolean;
    }
  >;
}

interface ITransactionsActions<T extends BaseTx> {
  callbackObserver: (
    data: T & {
      status?: number;
    }
  ) => void;
  addTx: (data: {
    tx: Pick<
      ethers.providers.TransactionResponse,
      "from" | "to" | "hash" | "chainId" | "nonce"
    >;
    payload: T["payload"];
    type: T["type"];
  }) => Promise<void>;
  waitForTx: (hash: string) => Promise<void>;
  updateTXStatus: (hash: string, status?: number) => void;
  initTxPool: () => void;
}

export type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> &
  ITransactionsState<T>;

export function createTransactionsSlice<T extends BaseTx>({
  callbackObserver,
  providers,
}: {
  callbackObserver: (tx: T) => void;
  providers: ProvidersRecord;
}): StoreSlice<ITransactionsSlice<T>> {
  return (set, get) => ({
    transactionsPool: {},
    callbackObserver,

    addTx: async (transaction) => {
      // fix for forks, which do not provider chainID
      const chainId = Number(transaction.tx.chainId);
      if (providers[chainId]) {
        const tx = {
          chainId,
          hash: transaction.tx.hash,
          type: transaction.type,
          payload: transaction.payload,
          from: transaction.tx.from,
          to: transaction.tx.to,
          nonce: transaction.tx.nonce,
        };
        set((state) =>
          produce(state, (draft) => {
            draft.transactionsPool[tx.hash] = {
              ...tx,
              pending: true,
            } as Draft<
              T & {
                pending: boolean;
              }
            >;
          })
        );
        const txPool = get().transactionsPool;
        setLocalStorageTxPool(txPool);
        await get().waitForTx(tx.hash);
      }
    },

    waitForTx: async (hash) => {
      const txData = get().transactionsPool[hash];
      if (txData) {
        const provider = providers[txData.chainId] as providers.JsonRpcProvider;

        const tx = await provider.getTransaction(hash);
        const txn = await tx.wait();
        get().updateTXStatus(hash, txn.status);
        const updatedTX = get().transactionsPool[hash];
        get().callbackObserver({
          ...updatedTX,
        });
      } else {
        // TODO: no transaction in waiting pool
      }
    },
    updateTXStatus: (hash, status) => {
      set((state) =>
        produce(state, (draft) => {
          draft.transactionsPool[hash].status = status;
          draft.transactionsPool[hash].pending = false;
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
      Object.values(get().transactionsPool).forEach((tx) => {
        if (tx.pending) {
          get().waitForTx(tx.hash);
        }
      });
    },
  });
}
