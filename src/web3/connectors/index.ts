import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';

import { ChainInformation } from '../store/rpcProvidersSlice';
import { ImpersonatedConnector } from './impersonatedConnector';

export type AllConnectorsInitProps = {
  appName: string;
  chains: Record<number, ChainInformation>;
  urls: { [chainId: number]: string[] };
  desiredChainId: number;
};

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const metaMask = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions })
  );

  const walletConnect = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: props.urls,
        },
      })
  );

  const coinbase = initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: props.chains[props.desiredChainId].urls[0],
          appName: props.appName,
        },
      })
  );

  const impersonatedConnector = initializeConnector<ImpersonatedConnector>(
    (actions) =>
      new ImpersonatedConnector(actions, {
        rpcUrl: props.chains[props.desiredChainId].urls[0],
        chainId: props.desiredChainId,
      })
  );

  return [metaMask, walletConnect, coinbase, impersonatedConnector];
};

export type WalletType =
  | 'Metamask'
  | 'WalletConnect'
  | 'Coinbase'
  | 'Impersonated';

export function getConnectorName(connector: Connector): WalletType | undefined {
  if (connector instanceof MetaMask) return 'Metamask';
  if (connector instanceof WalletConnect) return 'WalletConnect';
  if (connector instanceof CoinbaseWallet) return 'Coinbase';
  if (connector instanceof ImpersonatedConnector) return 'Impersonated';
  return;
}
