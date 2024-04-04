import dayjs from 'dayjs';
import { Draft, produce } from 'immer';
import { Client, Hex, isHex } from 'viem';

import { ClientsRecord } from '../../types/base';
import { StoreSlice } from '../../types/store';
import { SafeTransactionServiceUrls } from '../../utils/constants';
import {
  getLocalStorageTxPool,
  setLocalStorageTxPool,
} from '../../utils/localStorage';
import { EthBaseTx, EthereumAdapter } from '../adapters/EthereumAdapter';
import { GelatoAdapter, GelatoBaseTx } from '../adapters/GelatoAdapter';
import { isGelatoTxKey, isSafeTxKey } from '../adapters/helpers';
import { SafeAdapter } from '../adapters/SafeAdapter';
import {
  BaseTx,
  InitialTxParams,
  TransactionStatus,
  TxAdapter,
  TxKey,
} from '../adapters/types';
import { WalletType } from '../connectors';
import { IWalletSlice } from './walletSlice';

export type PoolTxParams = {
  pending: boolean;
  walletType: WalletType;
  status?: TransactionStatus;
  replacedTxHash?: Hex;
};
export type PoolTx<T extends BaseTx> = T & PoolTxParams;
export type EthPoolTx = EthBaseTx & PoolTxParams;
export type GelatoPoolTx = GelatoBaseTx & PoolTxParams;
export type TransactionPool<T extends BaseTx> = Record<string, T>;

export type TransactionsSliceBaseType = {
  clients: ClientsRecord;
  setClient: (chainId: number, client: Client) => void;
  initTxPool: () => void;
};

export interface ITransactionsState<T extends BaseTx> {
  adapters: {
    [TxAdapter.Ethereum]: EthereumAdapter<T>;
    [TxAdapter.Safe]?: SafeAdapter<T>;
    [TxAdapter.Gelato]?: GelatoAdapter<T>;
  };
  setAdapter: (adapter: TxAdapter) => void;

  transactionsPool: TransactionPool<PoolTx<T>>;
  transactionsIntervalsMap: Record<string, number | undefined>;

  isGelatoAvailable: boolean;
  checkIsGelatoAvailable: (chainId: number) => Promise<void>;
}

export interface ITransactionsActions<T extends BaseTx> {
  txStatusChangedCallback: (
    data: T & {
      status?: TransactionStatus;
      timestamp?: number;
    },
  ) => void;
  executeTx: (params: {
    body: () => Promise<TxKey | undefined>;
    params: {
      type: T['type'];
      payload: T['payload'];
      desiredChainID: number;
    };
  }) => Promise<TransactionPool<T & PoolTxParams>[string] | undefined>;
  addTXToPool: (tx: InitialTxParams<T>) => TransactionPool<PoolTx<T>>;
  removeTXFromPool: (txKey: string) => void;
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
  txStatusChangedCallback: (tx: T) => Promise<void>;
  defaultClients: ClientsRecord;
}): StoreSlice<
  ITransactionsSlice<T>,
  Pick<IWalletSlice, 'checkAndSwitchNetwork' | 'activeWallet'>
> {
  return (set, get) => ({
    txStatusChangedCallback,
    clients: defaultClients,
    setClient: (chainId, client) => {
      set((state) =>
        produce(state, (draft) => {
          draft.clients[chainId] = client as Draft<Client>;
        }),
      );
    },

    transactionsPool: {},
    transactionsIntervalsMap: {},

    adapters: {
      [TxAdapter.Ethereum]: new EthereumAdapter(get, set),
    },
    setAdapter: (adapter) => {
      const currentAdapter = get().adapters[adapter];
      if (!currentAdapter) {
        set((state) =>
          produce(state, (draft) => {
            if (adapter === TxAdapter.Gelato) {
              draft.adapters[adapter] = new GelatoAdapter(get, set);
            } else if (adapter === TxAdapter.Safe) {
              draft.adapters[adapter] = new SafeAdapter(get, set);
            }
          }),
        );
      }
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
          const adapter = get().adapters[tx.adapter];
          if (adapter) {
            adapter.startTxTracking(tx);
          } else if (!adapter && tx.adapter === TxAdapter.Gelato) {
            get().setAdapter(TxAdapter.Gelato);
            get().adapters[tx.adapter]?.startTxTracking(tx);
          } else if (!adapter && tx.adapter === TxAdapter.Safe) {
            get().setAdapter(TxAdapter.Safe);
            get().adapters[tx.adapter]?.startTxTracking(tx);
          }
        }
      });
    },

    executeTx: async ({ body, params }) => {
      await get().checkAndSwitchNetwork(params.desiredChainID);
      const txKey = await body();
      if (!txKey) {
        throw new Error("Can't get tx key");
      }

      const { desiredChainID, payload, type } = params;

      const activeWallet = get().activeWallet;
      if (!activeWallet) {
        throw new Error('No wallet connected');
      }

      const chainId = Number(desiredChainID);
      let adapterType = TxAdapter.Ethereum;
      let newTxKey: Hex | string | undefined = isHex(txKey) ? txKey : undefined;

      if (isGelatoTxKey(txKey)) {
        adapterType = TxAdapter.Gelato;
        newTxKey = txKey.taskId;
        get().setAdapter(TxAdapter.Gelato);
      } else if (
        isSafeTxKey(txKey) ||
        activeWallet.walletType === WalletType.Safe
      ) {
        adapterType = TxAdapter.Safe;
        if (isSafeTxKey(txKey)) {
          newTxKey = txKey.safeTxHash;
        } else {
          newTxKey = txKey;
        }
        get().setAdapter(TxAdapter.Safe);
      } else if (
        activeWallet.walletType === WalletType.WalletConnect &&
        activeWallet.isContractAddress
      ) {
        // check if tx real on safe (only for safe + wallet connect)
        const response = await fetch(
          `${SafeTransactionServiceUrls[chainId]}/multisig-transactions/${txKey}/`,
        );
        if (response.ok) {
          adapterType = TxAdapter.Safe;
          get().setAdapter(TxAdapter.Safe);
        }
      }

      const txInitialParams = {
        adapter: adapterType,
        txKey: newTxKey,
        type,
        payload,
        chainId,
        from: activeWallet.address,
      };

      if (txInitialParams.txKey) {
        const txPool = get().addTXToPool(txInitialParams);
        const adapter = get().adapters[txInitialParams.adapter];
        if (adapter) {
          if (adapter instanceof EthereumAdapter) {
            if (isHex(txInitialParams.txKey)) {
              adapter.waitForTxReceipt(txInitialParams.txKey);
            }
          } else {
            adapter.startTxTracking(txPool[txInitialParams.txKey]);
          }
        }
        return txPool[txInitialParams.txKey];
      } else {
        return undefined;
      }
    },

    addTXToPool: (params) => {
      const localTimestamp = dayjs().unix();

      set((state) =>
        produce(state, (draft) => {
          if (params.txKey) {
            draft.transactionsPool[params.txKey] = {
              ...params,
              hash:
                params.adapter !== TxAdapter.Gelato ? params.txKey : undefined,
              taskId:
                params.adapter === TxAdapter.Gelato ? params.txKey : undefined,
              pending: true,
              walletType: get().activeWallet?.walletType,
              localTimestamp,
            } as Draft<PoolTx<T>>;
          }
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
      setLocalStorageTxPool(get().transactionsPool);
    },

    // need for gelato only
    isGelatoAvailable: true,
    checkIsGelatoAvailable: async (chainId) => {
      get().setAdapter(TxAdapter.Gelato);
      const adapter = get().adapters[TxAdapter.Gelato];
      const isAvailable = await adapter?.checkIsGelatoAvailable(chainId);
      set({ isGelatoAvailable: isAvailable });
    },
  });
}
