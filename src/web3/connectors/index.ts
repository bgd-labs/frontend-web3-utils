import { Chain, Hex } from 'viem';
import {
  coinbaseWallet,
  injected,
  safe,
  walletConnect,
} from 'wagmi/connectors';

import { safeSdkOptions } from '../../utils/constants';
import { impersonated } from './ImpersonatedConnector';

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
  getImpersonatedAccount?: () => Hex;
};

export enum WalletType {
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  Coinbase = 'coinbase',
  Safe = 'safe',
  Impersonated = 'Impersonated Connector',
}

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const injectedConnector = injected();
  const coinbaseConnector = coinbaseWallet({
    appName: props.appName,
  });
  const gnosisSafe = safe({
    ...safeSdkOptions,
  });

  const connectors = [injectedConnector, coinbaseConnector, gnosisSafe];

  const wcParams = props.wcParams;
  if (wcParams && !props.getImpersonatedAccount) {
    const walletConnectConnector = walletConnect({
      projectId: wcParams.projectId,
      metadata: wcParams.metadata,
    });
    return [walletConnectConnector, ...connectors];
  } else if (!wcParams && !!props.getImpersonatedAccount) {
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [impersonatedConnector, ...connectors];
  } else if (wcParams && !!props.getImpersonatedAccount) {
    const walletConnectConnector = walletConnect({
      projectId: wcParams.projectId,
      metadata: wcParams.metadata,
    });
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [walletConnectConnector, impersonatedConnector, ...connectors];
  } else {
    return connectors;
  }
};
