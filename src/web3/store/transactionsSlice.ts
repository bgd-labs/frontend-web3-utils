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

export type BaseTx = EthBaseTx | GelatoBaseTx

type EthBaseTx = {
  type: string;
  payload?: object;
  hash: string;
  from: string;
  to: string;
  nonce: number;
  chainId: number;
  timestamp?: number;
}

type GelatoBaseTx = {
  from: string;
  taskID: string;
  type: string;
  chainId: number;
  timestamp?: number;
  payload?: object;
  hash?: string
}

type GelatoTx = {
  taskID: string
}

export type ProvidersRecord = Record<number, StaticJsonRpcBatchProvider>;

export type TransactionsSliceBaseType = {
  providers: ProvidersRecord;
  setProvider: (chainId: number, provider: StaticJsonRpcBatchProvider) => void;
  initTxPool: () => void;
};

export type TransactionPool<T extends BaseTx> = Record<string, T>;

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<
    T & {
      status?: number;
      pending: boolean;
      walletType: WalletType;
    }
  >;
}


function isGelatoTx(tx: ethers.ContractTransaction | GelatoTx): tx is GelatoTx {
  return (tx as GelatoTx).taskID !== undefined
}

function isGelatoBaseTx(tx: BaseTx): tx is GelatoBaseTx {
  return (tx as GelatoBaseTx).taskID !== undefined
}
interface ITransactionsActions<T extends BaseTx> {
  txStatusChangedCallback: (
    data: T & {
      status?: number;
      timestamp?: number
    }
  ) => void;
  executeTx: (params: {
    body: () => Promise<ethers.ContractTransaction | GelatoTx>;
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
}

export type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> &
  ITransactionsState<T> &
  TransactionsSliceBaseType;

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
      const chainId = Number(params.desiredChainID);
      const tx = await body();
      // TODO: dedub methods to separate ones
      if (isGelatoTx(tx)) {
        // TODO: verify with multiple accounts
        const from = activeWallet.accounts[0]
        const gelatoTX: GelatoBaseTx = {
          from,
          chainId,
          type: params.type,
          taskID: tx.taskID
        }
        // gelato tx
        set((state) =>
          produce(state, (draft) => {
            draft.transactionsPool[gelatoTX.taskID] = {
              ...gelatoTX,
              pending: true,
              walletType: activeWallet.walletType,
            } as Draft<
              T & {
                pending: boolean;
                walletType: WalletType;
              }
            >;
          }))

        const txPool = get().transactionsPool;
        setLocalStorageTxPool(txPool);
        // get().waitForTxReceipt(tx, tx.hash);
        return txPool[tx.taskID];

      } else {
        // ethereum tx
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
      }
    },

    waitForTx: async (txKey) => {
      const txData = get().transactionsPool[txKey];
      if (txData) {
        if (isGelatoBaseTx(txData)) {
          // handle gelato wait
        } else {
          const provider = get().providers[
            txData.chainId
          ] as StaticJsonRpcBatchProvider;
          const tx = await provider.getTransaction(txData.hash);
          await get().waitForTxReceipt(tx, txData.hash); 
        }
      } else {
        // TODO: no transaction in waiting pool
      }
    },

    waitForTxReceipt: async (tx, txHash) => {
      // type casting here as well
      const chainId = tx.chainId || get().transactionsPool[txHash].chainId;
      const provider = get().providers[chainId] as StaticJsonRpcBatchProvider;
      const txn = await tx.wait();

      get().updateTXStatus(txHash, txn.status);

      const updatedTX = get().transactionsPool[txHash];
      const txBlock = await provider.getBlock(txn.blockNumber);
      const timestamp = txBlock.timestamp 
      get().txStatusChangedCallback({
        ...updatedTX,
        timestamp,
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
          if (isGelatoBaseTx(tx)) {
            // get().wait
          } else {
            get().waitForTx(tx.hash);
          }
        }
      });
    },

    setProvider: (chainID, provider) => {
      set((state) =>
        produce(state, (draft) => {
          draft.providers[chainID] = provider;
        })
      );
    },
  });
}
