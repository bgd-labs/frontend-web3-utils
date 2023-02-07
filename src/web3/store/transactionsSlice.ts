import { ethers } from 'ethers';
import { Draft, produce } from 'immer';

import { StoreSlice } from '../../types/store';
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from '../../utils/localStorage';
import { StaticJsonRpcBatchProvider } from '../../utils/StaticJsonRpcBatchProvider';
import { WalletType } from '../connectors';
import { IWalletSlice } from './walletSlice';

export type BaseTx = {
  type: string;
  hash: string;
  from: string;
  to: string;
  nonce: number;
  payload?: object;
  chainId: number;
  timestamp?: number;
};

export type ProvidersRecord = Record<number, StaticJsonRpcBatchProvider>;

export type TransactionPool<T extends BaseTx> = Record<string, T>;

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<
    T & {
      status?: number;
      pending: boolean;
      walletType: WalletType;
    }
  >;
  providers: ProvidersRecord;
}

interface ITransactionsActions<T extends BaseTx> {
  setProvider: (chainId: number, provider: StaticJsonRpcBatchProvider) => void;
  txStatusChangedCallback: (
    data: T & {
      status?: number;
    }
  ) => void;
  executeTx: (params: {
    body: () => Promise<ethers.ContractTransaction>;
    params: {
      type: T['type'];
      payload: T['payload'];
      desiredChainID: number;
    };
  }) => Promise<
    T & {
      status?: number;
      pending: boolean;
    }
  >;
  waitForTx: (hash: string) => Promise<void>;
  waitForTxReceipt: (
    tx: ethers.providers.TransactionResponse,
    txHash: string
  ) => Promise<void>;
  updateTXStatus: (hash: string, status?: number) => void;
  initTxPool: () => void;
}

export type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> &
  ITransactionsState<T>;

export function createTransactionsSlice<T extends BaseTx>({
  txStatusChangedCallback,
  defaultProviders,
}: {
  txStatusChangedCallback: (tx: T) => void;
  defaultProviders: ProvidersRecord;
}): StoreSlice<
  ITransactionsSlice<T>,
  Pick<IWalletSlice, 'checkAndSwitchNetwork' | 'activeWallet'>
> {
  return (set, get) => ({
    transactionsPool: {},
    providers: defaultProviders,
    txStatusChangedCallback,
    executeTx: async ({ body, params }) => {
      await get().checkAndSwitchNetwork(params.desiredChainID);
      const activeWallet = get().activeWallet;
      if (!activeWallet) {
        throw new Error('No wallet connected');
      }
      const tx = await body();
      const chainId = Number(params.desiredChainID);
      const transaction = {
        chainId,
        hash: tx.hash,
        type: params.type,
        payload: params.payload,
        from: tx.from,
        to: tx.to,
        nonce: tx.nonce,
      };
      set((state) =>
        produce(state, (draft) => {
          draft.transactionsPool[transaction.hash] = {
            ...transaction,
            pending: true,
            walletType: activeWallet.walletType,
          } as Draft<
            T & {
              pending: boolean;
              walletType: WalletType;
            }
          >;
        })
      );
      const txPool = get().transactionsPool;
      setLocalStorageTxPool(txPool);
      get().waitForTxReceipt(tx, tx.hash);
      return txPool[tx.hash];
    },

    waitForTx: async (hash) => {
      const txData = get().transactionsPool[hash];
      if (txData) {
        const provider = get().providers[
          txData.chainId
        ] as StaticJsonRpcBatchProvider;
        const tx = await provider.getTransaction(txData.hash);
        await get().waitForTxReceipt(tx, txData.hash);
      } else {
        // TODO: no transaction in waiting pool
      }
    },

    waitForTxReceipt: async (
      tx: ethers.providers.TransactionResponse,
      txHash: string
    ) => {
      const chainId = tx.chainId || get().transactionsPool[txHash].chainId;
      const provider = get().providers[chainId] as StaticJsonRpcBatchProvider;
      const txn = await tx.wait();

      get().updateTXStatus(txHash, txn.status);

      const updatedTX = get().transactionsPool[txHash];
      const txBlock = await provider.getBlock(txn.blockNumber);
      get().txStatusChangedCallback({
        ...updatedTX,
        timestamp: txBlock.timestamp,
      });
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
        // ignore transactions from GnosisSafe is gnosis is not connected due to different tx hashes
        const txObservable = tx.walletType != 'GnosisSafe';
        if (tx.pending && txObservable) {
          get().waitForTx(tx.hash);
        }
      });
    },

    setProvider: (chainID: number, provider: StaticJsonRpcBatchProvider) => {
      set((state) =>
        produce(state, (draft) => {
          draft.providers[chainID] = provider;
        })
      );
    },
  });
}
