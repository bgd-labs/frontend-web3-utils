import { Chain } from 'viem';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { SafeConnector } from 'wagmi/connectors/safe';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

import { safeSdkOptions } from '../../utils/constants';
import { ImpersonatedConnector } from './ImpersonatedConnector';

export type ConnectorType =
  | InjectedConnector
  | WalletConnectConnector
  | CoinbaseWalletConnector
  | SafeConnector
  | ImpersonatedConnector;

export type AllConnectorsInitProps = {
  appName: string;
  chains: Record<number, Chain>;
  defaultChainId?: number;
  wcParams?: {
    projectId: string;
    metadata: {
      name: string;
      description: string;
      url: string;
      icons: string[];
    };
  };
};

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const chains = Object.values(props.chains);
  const chainIds = Object.keys(props.chains).map(Number);

  const wcParams = props.wcParams;
  let walletConnect: WalletConnectConnector | null = null;
  if (wcParams) {
    walletConnect = new WalletConnectConnector({
      chains,
      options: {
        ...wcParams,
      },
    });
  }

  const injected = new InjectedConnector({
    chains,
    options: {
      name: (detectedName) =>
        `${
          typeof detectedName === 'string'
            ? detectedName
            : detectedName.join(', ')
        }`,
    },
  });
  const coinbase = new CoinbaseWalletConnector({
    chains,
    options: {
      appName: props.appName,
      jsonRpcUrl:
        props.chains[props.defaultChainId || chainIds[0]].rpcUrls.default
          .http[0],
    },
  });
  const gnosisSafe = new SafeConnector({
    chains,
    options: safeSdkOptions,
  });

  const impersonated = new ImpersonatedConnector({
    chains,
    options: {
      chainId: props.chains[props.defaultChainId || chainIds[0]].id,
      flags: {
        isAuthorized: false,
      },
    },
  });

  const connectors: ConnectorType[] = [
    injected,
    coinbase,
    gnosisSafe,
    impersonated,
  ];
  if (walletConnect !== null) {
    connectors.push(walletConnect);
  }

  return connectors;
};

export type WalletType =
  | 'Injected'
  | 'WalletConnect'
  | 'Coinbase'
  | 'Safe'
  | 'Impersonated';

export function getConnectorName(
  connector: ConnectorType,
): WalletType | undefined {
  if (connector instanceof InjectedConnector) return 'Injected';
  if (connector instanceof WalletConnectConnector) return 'WalletConnect';
  if (connector instanceof CoinbaseWalletConnector) return 'Coinbase';
  if (connector instanceof SafeConnector) return 'Safe';
  if (connector instanceof ImpersonatedConnector) return 'Impersonated';
  return;
}
