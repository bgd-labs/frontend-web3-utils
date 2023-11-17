import { SafeTransactionServiceUrls } from '../../utils/constants';
import {
  ITransactionsSliceWithWallet,
  PoolTx,
} from '../store/transactionsSlice';
import { EthereumAdapter } from './EthereumAdapter';
import { GelatoAdapter } from './GelatoAdapter';
import {
  isGelatoBaseTx,
  isGelatoBaseTxWithoutTimestamp,
  isGelatoTx,
  isSafeTx,
} from './helpers';
import { SafeAdapter } from './SafeAdapter';
import {
  BaseAdapterInterface,
  BaseTx,
  BaseTxWithoutTime,
  TxKey,
} from './types';

export class BaseAdapter<T extends BaseTx> implements BaseAdapterInterface<T> {
  get: () => ITransactionsSliceWithWallet<T>;
  set: (
    fn: (
      state: ITransactionsSliceWithWallet<T>,
    ) => ITransactionsSliceWithWallet<T>,
  ) => void;

  ethereumAdapter: EthereumAdapter<T>;
  safeAdapter: SafeAdapter<T>;
  gelatoAdapter: GelatoAdapter<T>;

  constructor(
    get: () => ITransactionsSliceWithWallet<T>,
    set: (
      fn: (
        state: ITransactionsSliceWithWallet<T>,
      ) => ITransactionsSliceWithWallet<T>,
    ) => void,
  ) {
    this.get = get;
    this.set = set;

    this.ethereumAdapter = new EthereumAdapter<T>(get, set);
    this.safeAdapter = new SafeAdapter<T>(get, set);
    this.gelatoAdapter = new GelatoAdapter<T>(get, set);
  }

  executeTx = async (params: {
    txKey: TxKey;
    params: {
      type: T['type'];
      payload: T['payload'];
      desiredChainID: number;
    };
  }) => {
    const txKey = params.txKey;
    const { desiredChainID, payload, type } = params.params;

    const activeWallet = this.get().activeWallet;
    if (!activeWallet) {
      throw new Error('No wallet connected');
    }

    const chainId = Number(desiredChainID);

    const args = {
      txKey,
      payload,
      activeWallet,
      chainId,
      type,
    };

    if (isGelatoTx(txKey)) {
      return this.gelatoAdapter.executeTx(args);
    } else if (isSafeTx(txKey) || activeWallet.walletType === 'Safe') {
      return this.safeAdapter.executeTx(args);
    } else if (
      activeWallet.walletType === 'WalletConnect' &&
      activeWallet.isContractAddress
    ) {
      // check if tx real on safe (only for safe + wallet connect)
      const response = await fetch(
        `${SafeTransactionServiceUrls[chainId]}/multisig-transactions/${txKey}/`,
      );
      if (response.ok) {
        return this.safeAdapter.executeTx(args);
      } else {
        return this.ethereumAdapter.executeTx(args);
      }
    } else {
      return this.ethereumAdapter.executeTx(args);
    }
  };

  startTxTracking = async (tx: PoolTx<T>) => {
    if (tx.pending) {
      if (isGelatoBaseTx(tx)) {
        return this.gelatoAdapter.startTxTracking(tx.taskId);
      } else if (tx.hash && tx.isSafeTx) {
        return this.safeAdapter.startTxTracking(tx.hash);
      } else if (tx.hash) {
        return this.ethereumAdapter.startTxTracking(tx.hash);
      }
    }
  };

  getTxKey = (tx: BaseTxWithoutTime) => {
    if (isGelatoBaseTxWithoutTimestamp(tx)) {
      return tx.taskId;
    } else {
      return tx.hash;
    }
  };

  checkIsGelatoAvailable = async (chainId: number) => {
    return this.gelatoAdapter.checkIsGelatoAvailable(chainId);
  };
}
