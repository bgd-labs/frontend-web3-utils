import { PublicClient } from '@wagmi/core';
import dayjs from 'dayjs';
import { Draft, produce } from 'immer';
import { Hex } from 'viem';

import { ClientsRecord } from '../../types/base';
import { StoreSlice } from '../../types/store';
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from '../../utils/localStorage';
import { BaseAdapter } from '../adapters/BaseAdapter';
import { EthBaseTx } from '../adapters/EthereumAdapter';
import { GelatoBaseTx } from '../adapters/GelatoAdapter';
import {
  BaseAdapterInterface,
  BaseTx,
  BaseTxWithoutTime,
  TransactionStatus,
  TxKey,
} from '../adapters/types';
import { WalletType } from '../connectors';
import { IWalletSlice } from './walletSlice';

export type PoolTxParams = {
  status?: TransactionStatus;
  pending: boolean;
  walletType: WalletType;
  replacedTxHash?: Hex;
};

export type EthPoolTx = EthBaseTx & PoolTxParams;
export type GelatoPoolTx = GelatoBaseTx & PoolTxParams;

export type PoolTx<T extends BaseTx> = T & PoolTxParams;

export type TransactionsSliceBaseType = {
  clients: ClientsRecord;
  setClient: (chainId: number, client: PublicClient) => void;
  initTxPool: () => void;
};

export type TransactionPool<T extends BaseTx> = Record<string, T>;

export interface ITransactionsState<T extends BaseTx> {
  transactionsPool: TransactionPool<PoolTx<T>>;
  transactionsIntervalsMap: Record<string, number | undefined>;
}

export interface ITransactionsActions<T extends BaseTx> {
  adapter: BaseAdapterInterface<T>;

  txStatusChangedCallback: (
    data: T & {
      status?: TransactionStatus;
      timestamp?: number;
    },
  ) => void;
  executeTx: (params: {
    body: () => Promise<TxKey>;
    params: {
      type: T['type'];
      payload: T['payload'];
      desiredChainID: number;
    };
  }) => Promise<TransactionPool<T & PoolTxParams>[string] | undefined>;
  addTXToPool: (
    tx: BaseTxWithoutTime,
    activeWallet: WalletType,
  ) => TransactionPool<PoolTx<T>>;
  removeTXFromPool: (txKey: string) => void;

  isGelatoAvailable: boolean;
  checkIsGelatoAvailable: (chainId: number) => Promise<void>;
}

export type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> &
  ITransactionsState<T> &
  TransactionsSliceBaseType;

export type ITransactionsSliceWithWallet<T extends BaseTx> =
  ITransactionsSlice<T> &
    Pick<IWalletSlice, 'checkAndSwitchNetwork' | 'activeWallet'>;

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
    clients: defaultClients,
    setClient: (chainId, client) => {
      set((state) =>
        produce(state, (draft) => {
          draft.clients[chainId] = client as Draft<PublicClient>;
        }),
      );
    },

    txStatusChangedCallback,

    adapter: new BaseAdapter(get, set),

    transactionsPool: {},
    transactionsIntervalsMap: {},

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
        get().adapter.startTxTracking(tx);
      });
    },

    executeTx: async ({ body, params }) => {
      await get().checkAndSwitchNetwork(params.desiredChainID);
      const txKey = await body();
      return get().adapter.executeTx({ txKey, params });
    },

    addTXToPool: (tx, walletType) => {
      const localTimestamp = dayjs().unix();
      const txKey = get().adapter.getTxKey(tx);

      set((state) =>
        produce(state, (draft) => {
          draft.transactionsPool[txKey] = {
            ...tx,
            pending: true,
            walletType,
            localTimestamp,
          } as Draft<PoolTx<T>>;
        }),
      );

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

    // need for gelato only
    isGelatoAvailable: true,
    checkIsGelatoAvailable: async (chainId) => {
      const isAvailable = await get().adapter.checkIsGelatoAvailable(chainId);
      set({ isGelatoAvailable: isAvailable });
    },
  });
}
