/**
 * A set of parameters and a function for initializing connectors for connecting a wallet.
 * @module Wallets/ConnectorsInitialize
 */

import { Hex } from 'viem';
import {
  coinbaseWallet,
  injected,
  metaMask,
  safe,
  walletConnect,
} from 'wagmi/connectors';

import { safeSdkOptions } from '../../utils/constants';
import { impersonated } from './ImpersonatedConnector';

export type AllConnectorsInitProps = {
  appName: string;
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
  Metamask = 'metamask',
  WalletConnect = 'walletConnect',
  Coinbase = 'coinbaseWallet',
  Safe = 'safe',
  Impersonated = 'impersonated',
}

/**
 * Function for initializing connectors for connecting a wallet.
 */
export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const injectedConnector = injected();
  const metamaskConnector = metaMask({
    dappMetadata: { name: props.appName, url: props.wcParams.metadata.url },
  });
  const coinbaseConnector = coinbaseWallet({
    appName: props.appName,
  });
  const gnosisSafeConnector = safe({
    ...safeSdkOptions,
  });

  const connectors = [
    injectedConnector,
    metamaskConnector,
    coinbaseConnector,
    gnosisSafeConnector,
  ];

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
