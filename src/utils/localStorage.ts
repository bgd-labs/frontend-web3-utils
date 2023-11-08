import { WalletType } from '../web3/connectors';
import { BaseTx, TransactionPool } from '../web3/store/transactionsSlice';

export enum LocalStorageKeys {
  LastConnectedWallet = 'LastConnectedWallet',
  TransactionPool = 'TransactionPool',
}

export const setLocalStorageTxPool = <T extends BaseTx>(
  pool: TransactionPool<T>,
) => {
  const stringifiedPool = JSON.stringify(pool);
  localStorage.setItem(LocalStorageKeys.TransactionPool, stringifiedPool);
};

export const getLocalStorageTxPool = () => {
  return localStorage.getItem(LocalStorageKeys.TransactionPool);
};

export const setLocalStorageWallet = (walletType: WalletType) => {
  localStorage.setItem(LocalStorageKeys.LastConnectedWallet, walletType);
};

export const deleteLocalStorageWallet = () => {
  localStorage.removeItem(LocalStorageKeys.LastConnectedWallet);
  localStorage.removeItem('wagmi.wallet');
};

export const clearWalletLinkLocalStorage = () => {
  localStorage.removeItem('walletconnect');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:version');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:session:id');
  localStorage.removeItem(
    '-walletlink:https://www.walletlink.org:session:secret',
  );
  localStorage.removeItem(
    '-walletlink:https://www.walletlink.org:session:linked',
  );
  localStorage.removeItem('-walletlink:https://www.walletlink.org:AppVersion');
  localStorage.removeItem('-walletlink:https://www.walletlink.org:Addresses');
  localStorage.removeItem(
    '-walletlink:https://www.walletlink.org:walletUsername',
  );
};

export const clearWalletConnectV2LocalStorage = () => {
  localStorage.removeItem('wc@2:core:0.3//messages');
  localStorage.removeItem('wc@2:client:0.3//proposal');
  localStorage.removeItem('wc@2:universal_provider:/namespaces');
  localStorage.removeItem('wc@2:core:0.3//subscription');
  localStorage.removeItem('wc@2:core:0.3//history');
  localStorage.removeItem('wc@2:core:0.3//expirer');
  localStorage.removeItem('wc@2:core:0.3//pairing');
  localStorage.removeItem('wc@2:universal_provider:/optionalNamespaces');
  localStorage.removeItem('wc@2:core:0.3//keychain');
  localStorage.removeItem('wc@2:client:0.3//session');
  localStorage.removeItem('wc@2:universal_provider:/sessionProperties');
  localStorage.removeItem('wc@2:ethereum_provider:/chainId');
};
