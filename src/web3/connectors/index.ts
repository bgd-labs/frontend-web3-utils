// TODO: need add mock connector

import { Chain } from 'viem';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { SafeConnector } from 'wagmi/connectors/safe';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';

export type ConnectorType =
  | InjectedConnector
  | WalletConnectConnector
  | CoinbaseWalletConnector
  | SafeConnector;

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
    options: {
      allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/],
      debug: false,
    },
  });

  const connectors: ConnectorType[] = [injected, coinbase, gnosisSafe];
  if (walletConnect !== null) {
    connectors.push(walletConnect);
  }

  return connectors;
};

export type WalletType =
  | 'Metamask'
  | 'WalletConnect'
  | 'Coinbase'
  | 'GnosisSafe';

export function getConnectorName(
  connector: ConnectorType,
): WalletType | undefined {
  if (connector instanceof InjectedConnector) return 'Metamask'; // TODO: change to injected
  if (connector instanceof WalletConnectConnector) return 'WalletConnect';
  if (connector instanceof CoinbaseWalletConnector) return 'Coinbase';
  if (connector instanceof SafeConnector) return 'GnosisSafe';
  return;
}
