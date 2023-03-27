import { ethers } from 'ethers';
import { Draft, produce } from 'immer';

import { StoreSlice } from '../../types/store';
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from '../../utils/localStorage';
import { StaticJsonRpcBatchProvider } from '../../utils/StaticJsonRpcBatchProvider';
import { EthereumAdapter } from '../adapters/EthereumAdapter';
import { GelatoAdapter } from '../adapters/GelatoAdapter';
import { WalletType } from '../connectors';
// import { selectIsGelatoTXPending } from './transactionsSelectors';
import { IWalletSlice } from './walletSlice';

export type BaseTx = EthBaseTx | GelatoBaseTx;

type GelatoTXState =
  | 'WaitingForConfirmation'
  | 'CheckPending'
  | 'ExecSuccess'
  | 'Cancelled'
  | 'ExecPending';

export type GelatoTaskStatusResponse = {
  task: {
    chainId: number;
    taskId: string;
    taskState: GelatoTXState;
    creationDate?: string;
    executionDate?: string;
    transactionHash?: string;
    blockNumber?: number;
    lastCheckMessage?: string;
  };
};

type BasicTx = {
  chainId: number;
  type: string;
  from: string;
  payload?: object;
  localTimestamp: number;
  timestamp?: number;
  errorMessage?: string;
};

export type EthBaseTx = BasicTx & {
  hash: string;
  to: string;
  nonce: number;
};

export type GelatoBaseTx = BasicTx & {
  taskId: string;
  hash?: string;
  gelatoStatus?: GelatoTXState;
};

export type GelatoTx = {
  taskId: string;
};

export type ProvidersRecord = Record<number, StaticJsonRpcBatchProvider>;

export type TransactionsSliceBaseType = {
  providers: ProvidersRecord;
  setProvider: (chainId: number, provider: StaticJsonRpcBatchProvider) => void;
  initTxPool: () => void;
};

export type TransactionPool<T extends BaseTx> = Record<string, T>;

type PoolTx<T extends BaseTx> = T & {
  status?: number;
  pending: boolean;
  walletType: WalletType;
};

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<PoolTx<T>>;
  transactionsIntervalsMap: Record<string, number | undefined>;
}

export function isGelatoTx(
  tx: ethers.ContractTransaction | GelatoTx
): tx is GelatoTx {
  return (tx as GelatoTx).taskId !== undefined;
}

export function isGelatoBaseTx(tx: BaseTx): tx is GelatoBaseTx {
  return (tx as GelatoBaseTx).taskId !== undefined;
}

function isGelatoBaseTxWithoutTimestamp(
  tx: Omit<BaseTx, 'localTimestamp'>
): tx is Omit<GelatoBaseTx, 'localTimestamp'> {
  return (tx as GelatoBaseTx).taskId !== undefined;
}
export interface ITransactionsActions<T extends BaseTx> {
  // startPollingGelatoTXStatus: (taskId: string) => void;
  // stopPollingGelatoTXStatus: (taskId: string) => void;
  // fetchGelatoTXStatus: (taskId: string) => void;
  gelatoAdapter: GelatoAdapter<T>;
  ethereumAdapter: EthereumAdapter<T>;
  txStatusChangedCallback: (
    data: T & {
      status?: number;
      timestamp?: number;
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
  // waitForTx: (hash: string) => Promise<void>;
  // waitForTxReceipt: (
  //   tx: ethers.providers.TransactionResponse,
  //   txHash: string
  // ) => Promise<void>;
  // updateTXStatus: (hash: string, status?: number) => void;
  // updateGelatoTX: (
  //   taskId: string,
  //   gelatoStatus: GelatoTaskStatusResponse
  // ) => void;
  addTXToPool: (
    tx:
      | Omit<GelatoBaseTx, 'localTimestamp'>
      | Omit<EthBaseTx, 'localTimestamp'>,
    activeWallet: WalletType
  ) => TransactionPool<PoolTx<T>>;
  isGelatoAvailable: boolean;
  checkIsGelatoAvailable: (chainId: number) => Promise<void>;
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
    transactionsIntervalsMap: {},
    providers: defaultProviders,
    txStatusChangedCallback,
    gelatoAdapter: new GelatoAdapter(get, set), // TODO: think when to init, maybe only when working with gelato
    ethereumAdapter: new EthereumAdapter(get, set), // This might be a Gnosis Safe adapter
    executeTx: async ({ body, params }) => {
      await get().checkAndSwitchNetwork(params.desiredChainID);
      const activeWallet = get().activeWallet;
      if (!activeWallet) {
        throw new Error('No wallet connected');
      }
      const chainId = Number(params.desiredChainID);
      const tx = await body();
      const args = {
        // TODO: update arguments in adapters
        tx,
        payload: params.payload,
        activeWallet,
        chainId,
        type: params.type,
      };
      // TODO: dedub methods to separate ones
      return isGelatoTx(tx) // in case of gnosis safe it could work in a same way
        ? get().gelatoAdapter.executeTx(args)
        : get().ethereumAdapter.executeTx(args);
      // if (isGelatoTx(tx)) {
      //   // TODO: verify with multiple accounts
      //   const from = activeWallet.accounts[0];
      //   const gelatoTX: Omit<GelatoBaseTx, 'localTimestamp'> = {
      //     from,
      //     chainId,
      //     type: params.type,
      //     taskId: tx.taskId,
      //     payload: params.payload,
      //   };
      //   const txPool = get().addTXToPool(gelatoTX, activeWallet.walletType);
      //   get().startPollingGelatoTXStatus(tx.taskId);
      //   return txPool[tx.taskId];
      // } else {
      //   // ethereum tx
      //   const transaction = {
      //     chainId,
      //     hash: tx.hash,
      //     type: params.type,
      //     payload: params.payload,
      //     from: tx.from,
      //     to: tx.to as string,
      //     nonce: tx.nonce,
      //   };
      //   const txPool = get().addTXToPool(transaction, activeWallet.walletType);
      //   get().waitForTxReceipt(tx, tx.hash);
      //   return txPool[tx.hash];
      // }
    },

    addTXToPool: (transaction, walletType) => {
      const localTimestamp = new Date().getTime();
      if (isGelatoBaseTxWithoutTimestamp(transaction)) {
        set((state) =>
          produce(state, (draft) => {
            draft.transactionsPool[transaction.taskId] = {
              ...transaction,
              pending: true,
              walletType,
              localTimestamp,
            } as Draft<
              T & {
                pending: boolean;
                walletType: WalletType;
                localTimestamp: number;
              }
            >;
          })
        );

        const txPool = get().transactionsPool;
        setLocalStorageTxPool(txPool);
      } else {
        set((state) =>
          produce(state, (draft) => {
            draft.transactionsPool[transaction.hash] = {
              ...transaction,
              pending: true,
              walletType,
              localTimestamp,
            } as Draft<
              T & {
                pending: boolean;
                walletType: WalletType;
              }
            >;
          })
        );
      }
      const txPool = get().transactionsPool;
      setLocalStorageTxPool(txPool);
      return txPool;
    },

    // waitForTx: async (txKey) => {
    //   const txData = get().transactionsPool[txKey];
    //   if (txData) {
    //     if (isGelatoBaseTx(txData)) {
    //       // handle gelato wait
    //     } else {
    //       const provider = get().providers[
    //         txData.chainId
    //       ] as StaticJsonRpcBatchProvider;
    //       if (txData.hash) {
    //         const tx = await provider.getTransaction(txData.hash);
    //         await get().waitForTxReceipt(tx, txData.hash);
    //       }
    //     }
    //   } else {
    //     // TODO: no transaction in waiting pool
    //   }
    // },

    // waitForTxReceipt: async (tx, txHash) => {
    //   // type casting here as well
    //   const chainId = tx.chainId || get().transactionsPool[txHash].chainId;
    //   const provider = get().providers[chainId] as StaticJsonRpcBatchProvider;
    //   const txn = await tx.wait();

    //   get().updateTXStatus(txHash, txn.status);

    //   const updatedTX = get().transactionsPool[txHash];
    //   const txBlock = await provider.getBlock(txn.blockNumber);
    //   const timestamp = txBlock.timestamp;
    //   get().txStatusChangedCallback({
    //     ...updatedTX,
    //     timestamp,
    //   });
    // },

    // updateTXStatus: (hash, status) => {
    //   set((state) =>
    //     produce(state, (draft) => {
    //       draft.transactionsPool[hash].status = status;
    //       draft.transactionsPool[hash].pending = false;
    //     })
    //   );

    //   setLocalStorageTxPool(get().transactionsPool);
    // },
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
            get().gelatoAdapter.startPollingGelatoTXStatus(tx.taskId);
          } else {
            if (tx.hash) {
              get().ethereumAdapter.waitForTx(tx.hash);
            }
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

    // stopPollingGelatoTXStatus: (taskId: string) => {
    //   const currentInterval = get().transactionsIntervalsMap[taskId];
    //   clearInterval(currentInterval);
    //   set((state) =>
    //     produce(state, (draft) => {
    //       draft.transactionsIntervalsMap[taskId] = undefined;
    //     })
    //   );
    // },

    // startPollingGelatoTXStatus: (taskId: string) => {
    //   const tx = get().transactionsPool[taskId];
    //   if (isGelatoBaseTx(tx)) {
    //     const isPending = selectIsGelatoTXPending(tx.gelatoStatus);
    //     if (!isPending) {
    //       return;
    //     }
    //   }
    //   get().stopPollingGelatoTXStatus(taskId);

    //   const newGelatoInterval = setInterval(() => {
    //     get().fetchGelatoTXStatus(taskId);
    //     // TODO: change timeout for gelato
    //   }, 2000);

    //   set((state) =>
    //     produce(state, (draft) => {
    //       draft.transactionsIntervalsMap[taskId] = Number(newGelatoInterval);
    //     })
    //   );
    // },

    // updateGelatoTX: (
    //   taskId: string,
    //   statusResponse: GelatoTaskStatusResponse
    // ) => {
    //   set((state) =>
    //     produce(state, (draft) => {
    //       const tx = draft.transactionsPool[taskId] as GelatoBaseTx & {
    //         pending: boolean;
    //         status?: number;
    //       };
    //       tx.gelatoStatus = statusResponse.task.taskState;
    //       tx.pending = selectIsGelatoTXPending(statusResponse.task.taskState);
    //       tx.hash = statusResponse.task.transactionHash;
    //       tx.status = statusResponse.task.taskState == 'ExecSuccess' ? 1 : 2;
    //       if (statusResponse.task.executionDate) {
    //         const timestamp = new Date(
    //           statusResponse.task.executionDate
    //         ).getTime();
    //         tx.timestamp = timestamp;
    //       }
    //       if (statusResponse.task.lastCheckMessage) {
    //         tx.errorMessage = statusResponse.task.lastCheckMessage;
    //       }
    //     })
    //   );
    //   setLocalStorageTxPool(get().transactionsPool);
    // },

    // fetchGelatoTXStatus: async (taskId: string) => {
    //   const response = await fetch(
    //     `https://relay.gelato.digital/tasks/status/${taskId}/`
    //   );
    //   if (!response.ok) {
    //     // TODO: handle error somehow
    //     // throw new Error('Gelato API error')
    //   } else {
    //     const gelatoStatus =
    //       (await response.json()) as GelatoTaskStatusResponse;
    //     const isPending = selectIsGelatoTXPending(gelatoStatus.task.taskState);
    //     get().updateGelatoTX(taskId, gelatoStatus);
    //     if (!isPending) {
    //       get().stopPollingGelatoTXStatus(taskId);
    //       const tx = get().transactionsPool[taskId];
    //       get().txStatusChangedCallback(tx);
    //     }
    //   }
    // },

    isGelatoAvailable: true,
    checkIsGelatoAvailable: async (chainId) => {
      const response = await fetch(`https://relay.gelato.digital/relays/v2`);
      if (!response.ok) {
        set({ isGelatoAvailable: false });
      } else {
        const listOfRelays = (await response.json()) as { relays: string[] };
        const isRelayAvailable = !!listOfRelays.relays.find(
          (id) => +id === chainId
        );
        set({ isGelatoAvailable: isRelayAvailable });
      }
    },
  });
}
