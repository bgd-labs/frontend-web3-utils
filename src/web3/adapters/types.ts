/**
 * Generic types for transactions.
 * @module TransactionAdapters/types
 */

import { Hex } from 'viem';

import {
  ITransactionsSliceWithWallet,
  PoolTx,
} from '../store/transactionsSlice';
import { EthBaseTx } from './EthereumAdapter';
import { GelatoBaseTx, GelatoTx } from './GelatoAdapter';
import { SafeTx } from './SafeAdapter';

// generic
export enum TxAdapter {
  Ethereum = 'ethereum',
  Safe = 'safe',
  Gelato = 'gelato',
}

export type BasicTx = {
  adapter: TxAdapter;
  chainId: number;
  type: string;
  from: Hex;
  localTimestamp: number;
  txKey: Hex | string;
  payload?: object;
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

export type InitialTxParams<T extends BaseTx> = {
  adapter: TxAdapter;
  txKey?: Hex | string;
  type: T['type'];
  payload: object | undefined;
  chainId: number;
  from: Hex;
};

// adapters
export interface AdapterInterface<T extends BaseTx> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;
  startTxTracking: (tx: PoolTx<T>) => Promise<void>;
}
