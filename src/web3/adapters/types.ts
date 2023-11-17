import { Hex } from 'viem';

import {
  ITransactionsSliceWithWallet,
  PoolTx,
  PoolTxParams,
  TransactionPool,
} from '../store/transactionsSlice';
import { Wallet } from '../store/walletSlice';
import { EthBaseTx } from './EthereumAdapter';
import { GelatoBaseTx, GelatoTx } from './GelatoAdapter';
import { SafeTx } from './SafeAdapter';

// generic
export type BasicTx = {
  chainId: number;
  type: string;
  from: Hex;
  payload?: object;
  isSafeTx?: boolean;
  localTimestamp: number;
  timestamp?: number;
  isError?: boolean;
  errorMessage?: string;
};

export enum TransactionStatus {
  Reverted = 'Reverted',
  Success = 'Success',
  Replaced = 'Replaced',
  Failed = 'Failed',
}

export type TxKey = Hex | GelatoTx | SafeTx;
export type BaseTx = EthBaseTx | GelatoBaseTx;
export type BaseTxWithoutTime =
  | Omit<GelatoBaseTx, 'localTimestamp'>
  | Omit<EthBaseTx, 'localTimestamp'>;

// adapters
export type ExecuteTx<T extends BaseTx> = (params: {
  txKey: TxKey;
  params: {
    type: T['type'];
    payload: T['payload'];
    desiredChainID: number;
  };
}) => Promise<TransactionPool<T & PoolTxParams>[string] | undefined>;

export interface BaseAdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;

  executeTx: ExecuteTx<T>;
  startTxTracking: (tx: PoolTx<T>) => Promise<void>;
  getTxKey: (tx: BaseTxWithoutTime) => string;
  checkIsGelatoAvailable: (chainId: number) => Promise<boolean>;
}

export type ExecuteTxParams<T extends BaseTx> = {
  txKey: TxKey;
  activeWallet: Wallet;
  payload: object | undefined;
  chainId: number;
  type: T['type'];
};

export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;
  executeTx: (params: ExecuteTxParams<T>) => Promise<
    | (T & {
        status?: TransactionStatus;
        pending: boolean;
      })
    | undefined
  >;
  startTxTracking: (txId: string) => Promise<void>;
}
