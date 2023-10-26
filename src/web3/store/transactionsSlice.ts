import { PublicClient } from '@wagmi/core';
import { Draft, produce } from 'immer';
import { Hex } from 'viem';

import { StoreSlice } from '../../types/store';
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from '../../utils/localStorage';
import { EthereumAdapter } from '../adapters/EthereumAdapter';
import {
  GelatoAdapter,
  GelatoTx,
  GelatoTXState,
  isGelatoBaseTx,
  isGelatoBaseTxWithoutTimestamp,
  isGelatoTx,
} from '../adapters/GelatoAdapter';
import { GnosisAdapter } from '../adapters/GnosisAdapter';
import { AdapterInterface } from '../adapters/interface';
import { WalletType } from '../connectors';
import { IWalletSlice } from './walletSlice';

export type BaseTx = EthBaseTx | GelatoBaseTx;

export type InitialTx = Hex | GelatoTx;
export type NewTx = { hash: Hex } | GelatoTx;

type BasicTx = {
  chainId: number;
  type: string;
  from: Hex;
  payload?: object;
  localTimestamp: number;
  timestamp?: number;
  errorMessage?: string;
};

export type EthBaseTx = BasicTx & {
  hash: Hex;
  to: Hex;
  nonce: number;
};

export type GelatoBaseTx = BasicTx & {
  taskId: string;
  hash?: Hex;
  gelatoStatus?: GelatoTXState;
};

export type ClientsRecord = Record<number, PublicClient>;

export type TransactionsSliceBaseType = {
  clients: ClientsRecord;
  setClient: (chainId: number, client: PublicClient) => void;
  initTxPool: () => void;
  updateEthAdapter: (gnosis: boolean) => void;
};

export type TransactionPool<T extends BaseTx> = Record<string, T>;

export enum TransactionStatus {
  Reverted = 'Reverted',
  Success = 'Success',
  Replaced = 'Replaced',
  Failed = 'Failed'
}

type PoolTx<T extends BaseTx> = T & {
  status?: TransactionStatus;
  pending: boolean;
  walletType: WalletType;
  replacedTxHash?: string;
};

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<PoolTx<T>>;
  transactionsIntervalsMap: Record<string, number | undefined>;
}

export interface ITransactionsActions<T extends BaseTx> {
  gelatoAdapter: AdapterInterface<T>;
  ethereumAdapter: AdapterInterface<T>;
  txStatusChangedCallback: (
    data: T & {
      status?: TransactionStatus;
      timestamp?: number;
    },
  ) => void;
  executeTx: (params: {
    body: () => Promise<InitialTx>;
    params: {
      type: T['type'];
      payload: T['payload'];
      desiredChainID: number;
    };
  }) => Promise<
    T & {
      status?: TransactionStatus;
      pending: boolean;
    }
  >;
  addTXToPool: (
    tx:
      | Omit<GelatoBaseTx, 'localTimestamp'>
      | Omit<EthBaseTx, 'localTimestamp'>,
    activeWallet: WalletType,
  ) => TransactionPool<PoolTx<T>>;
  removeTXFromPool: (txKey: string) => void;
  isGelatoAvailable: boolean;
  checkIsGelatoAvailable: (chainId: number) => Promise<void>;
  updateEthAdapter: (gnosis: boolean) => void;
}

export type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> &
  ITransactionsState<T> &
  TransactionsSliceBaseType;

export function createTransactionsSlice<T extends BaseTx>({
  txStatusChangedCallback,
  defaultClients,
}: {
  txStatusChangedCallback: (tx: T) => void;
  defaultClients: ClientsRecord;
}): StoreSlice<
  ITransactionsSlice<T>,
  Pick<IWalletSlice, 'checkAndSwitchNetwork' | 'activeWallet'>
> {
  return (set, get) => ({
    transactionsPool: {},
    transactionsIntervalsMap: {},
    clients: defaultClients,
    txStatusChangedCallback,
    gelatoAdapter: new GelatoAdapter(get, set), // TODO: think when to init, maybe only when working with gelato or it's available
    ethereumAdapter: new EthereumAdapter(get, set), // This might be a Gnosis Safe adapter, re-inits when wallet.type === GnosisSafe
    executeTx: async ({ body, params }) => {
      await get().checkAndSwitchNetwork(params.desiredChainID);
      const activeWallet = get().activeWallet;
      if (!activeWallet) {
        throw new Error('No wallet connected');
      }

      const chainId = Number(params.desiredChainID);

      const tx: InitialTx = await body();
      const args = {
        tx: isGelatoTx(tx) ? tx : { hash: tx },
        payload: params.payload,
        activeWallet,
        chainId,
        type: params.type,
      };

      return isGelatoTx(tx) // in case of gnosis safe it works in a same way
        ? get().gelatoAdapter.executeTx(args)
        : get().ethereumAdapter.executeTx(args);
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
          }),
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
          }),
        );
      }
      const txPool = get().transactionsPool;
      setLocalStorageTxPool(txPool);
      return txPool;
    },
    removeTXFromPool: (txKey) => {
      set((state) =>
        produce(state, (draft) => {
          delete draft.transactionsPool[txKey];
        }),
      );
      const txPool = get().transactionsPool;
      setLocalStorageTxPool(txPool);
    },
    initTxPool: () => {
      const localStorageTXPool = getLocalStorageTxPool();
      if (localStorageTXPool) {
        const transactionsPool = JSON.parse(localStorageTXPool);
        console.log({transactionsPool})
        // TODO: figure out type casting from string via ZOD or similar
        set(() => ({
          transactionsPool,
        }));
      }
      Object.values(get().transactionsPool).forEach((tx) => {
        if (tx.pending) {
          if (isGelatoBaseTx(tx)) {
            get().gelatoAdapter.startTxTracking(tx.taskId);
          } else {
            if (tx.hash) {
              get().ethereumAdapter.startTxTracking(tx.hash);
            }
          }
        }
      });
    },

    setClient: (chainId, client) => {
      const stateClients = get().clients;
      const updatedClients = (stateClients[chainId] = client);
      set({ clients: updatedClients });
    },

    isGelatoAvailable: true,
    checkIsGelatoAvailable: async (chainId) => {
      try {
        const response = await fetch(`https://relay.gelato.digital/relays/v2`);
        if (!response.ok) {
          set({ isGelatoAvailable: false });
        } else {
          const listOfRelays = (await response.json()) as { relays: string[] };
          const isRelayAvailable = !!listOfRelays.relays.find(
            (id) => +id === chainId,
          );
          set({ isGelatoAvailable: isRelayAvailable });
        }
      } catch (e) {
        set({ isGelatoAvailable: false });
        console.error(e);
      }
    },
    updateEthAdapter: (gnosis: boolean) => {
      set((state) =>
        produce(state, (draft) => {
          draft.ethereumAdapter = gnosis
            ? new GnosisAdapter(get, set)
            : new EthereumAdapter(get, set);
        }),
      );
    },
  });
}
