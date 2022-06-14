import { TransactionPool } from "../web3/store/transactionsSlice";

export enum LocalStorageKeys {
  LastConnectedWallet = 'LastConnectedWallet',
  TransactionPool = 'TransactionPool'
}

export const setLocalStorageTxPool = <T extends {
  type: string;
  payload: object;
}>(pool: TransactionPool<T>) => {
  const stringifiedPool = JSON.stringify(pool);
  localStorage.setItem(LocalStorageKeys.TransactionPool, stringifiedPool);
};

export const getLocalStorageTxPool = () => {
  return localStorage.getItem(LocalStorageKeys.TransactionPool)
};
