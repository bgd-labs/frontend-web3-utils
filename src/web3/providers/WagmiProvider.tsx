import {
  configureChains,
  createConfig,
  GetAccountResult,
  watchAccount,
} from '@wagmi/core';
import React, { useEffect, useState } from 'react';
import { publicProvider } from 'wagmi/providers/public';
import { StoreApi, UseBoundStore } from 'zustand';

import {
  AllConnectorsInitProps,
  ConnectorType,
  getConnectorName,
  initAllConnectors,
} from '../connectors';
import { Wallet } from '../store/walletSlice';

interface WagmiProviderProps {
  useStore: UseBoundStore<
    StoreApi<{
      setActiveWallet: (wallet: Wallet) => void;
      changeActiveWalletChainId: (chainID: number) => void;
      setConnectors: (connectors: ConnectorType[]) => void;
      disconnectActiveWallet: () => void;
    }>
  >;
  connectorsInitProps: AllConnectorsInitProps;
}

function Child({
  useStore,
  connectors,
}: Omit<WagmiProviderProps, 'connectorsInitProps'> & {
  connectors: ConnectorType[];
}) {
  const [account, setAccount] = useState<GetAccountResult | undefined>(
    undefined,
  );
  watchAccount((data) => {
    setAccount(data);
  });

  const setConnectors = useStore((state) => state.setConnectors);
  const disconnectActiveWallet = useStore(
    (state) => state.disconnectActiveWallet,
  );

  const [currentWalletType, setCurrentWalletType] = useState<string>('');

  useEffect(() => {
    if (connectors) {
      setConnectors(connectors);
    }
  }, [connectors]);

  useEffect(() => {
    if (account && account.address && account.isConnected) {
      const walletType =
        account.connector &&
        getConnectorName(account.connector as ConnectorType);

      if (walletType) {
        setCurrentWalletType(walletType);
      } else if (currentWalletType !== walletType) {
        disconnectActiveWallet();
      }
    }
  }, [account]);

  return null;
}

export function WagmiProvider({
  useStore,
  connectorsInitProps,
}: WagmiProviderProps) {
  const [connectors] = useState(initAllConnectors(connectorsInitProps));
  const [mappedConnectors] = useState<ConnectorType[]>(
    connectors.map((connector) => connector),
  );

  const { publicClient } = configureChains(
    Object.values(connectorsInitProps.chains),
    [publicProvider()],
  );

  createConfig({
    autoConnect: false,
    publicClient,
    connectors,
  });

  return <Child useStore={useStore} connectors={mappedConnectors} />;
}
