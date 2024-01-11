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
  getImpersonatedAccount?: () => Hex | undefined;
};

export enum WalletType {
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  Coinbase = 'coinbase',
  Safe = 'safe',
  Impersonated = 'impersonated',
}

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const injectedConnector = {
    connector: injected(),
    type: WalletType.Injected,
  };
  const coinbaseConnector = {
    connector: coinbaseWallet({
      appName: props.appName,
    }),
    type: WalletType.Coinbase,
  };
  const gnosisSafeConnector = {
    connector: safe({
      ...safeSdkOptions,
    }),
    type: WalletType.Safe,
  };

  const connectors = [
    injectedConnector,
    coinbaseConnector,
    gnosisSafeConnector,
  ];

  const wcParams = props.wcParams;
  if (wcParams && !props.getImpersonatedAccount) {
    const walletConnectConnector = {
      connector: walletConnect({
        projectId: wcParams.projectId,
        metadata: wcParams.metadata,
      }),
      type: WalletType.WalletConnect,
    };
    return [walletConnectConnector, ...connectors];
  } else if (!wcParams && !!props.getImpersonatedAccount) {
    const impersonatedConnector = {
      connector: impersonated({
        getAccountAddress: props.getImpersonatedAccount,
      }),
      type: WalletType.Impersonated,
    };
    return [impersonatedConnector, ...connectors];
  } else if (wcParams && !!props.getImpersonatedAccount) {
    const walletConnectConnector = {
      connector: walletConnect({
        projectId: wcParams.projectId,
        metadata: wcParams.metadata,
      }),
      type: WalletType.WalletConnect,
    };
    const impersonatedConnector = {
      connector: impersonated({
        getAccountAddress: props.getImpersonatedAccount,
      }),
      type: WalletType.Impersonated,
    };
    return [walletConnectConnector, impersonatedConnector, ...connectors];
  } else {
    return connectors;
  }
};
