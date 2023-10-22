import {
  configureChains,
  createConfig,
  GetAccountResult,
  watchAccount,
  watchNetwork,
} from '@wagmi/core';
import React, { useEffect, useState } from 'react';
import { Chain } from 'viem';
import { publicProvider } from 'wagmi/providers/public';
import { StoreApi, UseBoundStore } from 'zustand';

import {
  AllConnectorsInitProps,
  ConnectorType,
  initAllConnectors,
} from '../connectors';

interface WagmiProviderProps {
  useStore: UseBoundStore<
    StoreApi<{
      changeActiveWalletAccount: (account?: GetAccountResult) => Promise<void>;
      changeActiveWalletChain: (chain?: Chain) => Promise<void>;
      setConnectors: (connectors: ConnectorType[]) => void;
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
  const { setConnectors, changeActiveWalletAccount, changeActiveWalletChain } =
    useStore();

  watchAccount(async (data) => {
    if (data.address) {
      await changeActiveWalletAccount(data);
    }
  });
  watchNetwork(async (data) => {
    if (data.chain?.id) {
      await changeActiveWalletChain(data.chain);
    }
  });

  useEffect(() => {
    if (connectors) {
      setConnectors(connectors);
    }
  }, [connectors]);

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
