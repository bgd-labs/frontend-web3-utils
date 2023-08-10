import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector, Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Connector, Web3ReactStore } from '@web3-react/types';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

import { ChainInformation } from '../../utils/chainInfoHelpers';
import { ImpersonatedConnector } from './impersonatedConnector';

export type AllConnectorsInitProps = {
  appName: string;
  chains: Record<number, ChainInformation>;
  urls: { [chainId: number]: string[] };
  defaultChainId?: number;
  wcProjectId?: string;
};

type ConnectorGeneric<T> = [T, Web3ReactHooks, Web3ReactStore];

type ConnectorType =
  | ConnectorGeneric<MetaMask>
  | ConnectorGeneric<CoinbaseWallet>
  | ConnectorGeneric<GnosisSafe>
  | ConnectorGeneric<ImpersonatedConnector>
  | ConnectorGeneric<WalletConnectV2>;

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const projectId = props.wcProjectId;
  const wcChains = Object.keys(props.chains).map(Number);
  const metaMask = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions }),
  );

  let walletConnect: ConnectorGeneric<WalletConnectV2> | null = null;

  if (projectId) {
    walletConnect = initializeConnector<WalletConnectV2>(
      (actions) =>
        new WalletConnectV2({
          actions,
          options: {
            projectId,
            chains: wcChains,
            showQrModal: true,
          },
          onError: (error) => {
            console.error('walletconnect error', error);
          },
        }),
    );
  }

  const coinbase = initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: props.chains[props.defaultChainId || wcChains[0]].urls[0],
          appName: props.appName,
        },
      }),
  );

  const gnosisSafe = initializeConnector<GnosisSafe>(
    (actions) => new GnosisSafe({ actions }),
  );

  const impersonatedConnector = initializeConnector<ImpersonatedConnector>(
    (actions) =>
      new ImpersonatedConnector(actions, {
        urls: props.urls,
        chainId: props.defaultChainId || wcChains[0],
      }),
  );

  const connectors: ConnectorType[] = [
    metaMask,
    coinbase,
    gnosisSafe,
    impersonatedConnector,
  ];

  if (walletConnect !== null) {
    connectors.push(walletConnect);
  }

  return connectors;
};

export type WalletType =
  | 'Metamask'
  | 'WalletConnect'
  | 'Coinbase'
  | 'GnosisSafe'
  | 'Impersonated';

export function getConnectorName(connector: Connector): WalletType | undefined {
  if (connector instanceof MetaMask) return 'Metamask';
  if (connector instanceof WalletConnectV2) return 'WalletConnect';
  if (connector instanceof CoinbaseWallet) return 'Coinbase';
  if (connector instanceof GnosisSafe) return 'GnosisSafe';
  if (connector instanceof ImpersonatedConnector) return 'Impersonated';
  return;
}
