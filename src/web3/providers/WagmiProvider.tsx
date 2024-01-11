import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  Config,
  createConfig,
  GetAccountReturnType,
  watchAccount,
} from '@wagmi/core';
import React, { useEffect, useMemo, useState } from 'react';
import { fallback, Hex, http, Transport } from 'viem';
import { mainnet } from 'viem/chains';
import { CreateConnectorFn, WagmiProvider as BaseWagmiProvider } from 'wagmi';
import { StoreApi, UseBoundStore } from 'zustand';

import {
  AllConnectorsInitProps,
  initAllConnectors,
  WalletType,
} from '../connectors';

export type Connectors = { connector: CreateConnectorFn; type: WalletType }[];

interface WagmiProviderProps {
  useStore: UseBoundStore<
    StoreApi<{
      setWagmiConfig: (config: Config) => void;
      changeActiveWalletAccount: (
        account?: GetAccountReturnType,
      ) => Promise<void>;
      setConnectors: (connectors: Connectors) => void;
      setDefaultChainId: (chainId: number) => void;
      getImpersonatedAddress?: () => Hex | undefined;
    }>
  >;
  connectorsInitProps: AllConnectorsInitProps;
}

function Child({
  wagmiConfig,
  useStore,
  connectors,
  connectorsInitProps,
}: WagmiProviderProps & {
  wagmiConfig: Config;
  connectors: Connectors;
}) {
  const {
    setConnectors,
    setDefaultChainId,
    setWagmiConfig,
    changeActiveWalletAccount,
  } = useStore();

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      console.log('account changed', account);
      await changeActiveWalletAccount(account);
    },
  });

  useEffect(() => {
    setWagmiConfig(wagmiConfig);
  }, [wagmiConfig]);

  useEffect(() => {
    if (connectors) {
      setConnectors(connectors);
    }
  }, [connectors.length]);

  useEffect(() => {
    if (connectorsInitProps.defaultChainId) {
      setDefaultChainId(connectorsInitProps.defaultChainId);
    }
  }, [connectorsInitProps.defaultChainId]);

  return null;
}

export function WagmiProvider({
  useStore,
  connectorsInitProps,
}: WagmiProviderProps) {
  const { getImpersonatedAddress } = useStore();

  const formattedProps = {
    ...connectorsInitProps,
    getImpersonatedAccount: !!connectorsInitProps.getImpersonatedAccount
      ? connectorsInitProps.getImpersonatedAccount
      : getImpersonatedAddress,
  };

  const [connectors] = useState(initAllConnectors(formattedProps));
  const [mappedConnectors] = useState<Connectors>(
    connectors.map((connector) => connector),
  );

  const config = useMemo(() => {
    const chains = Object.values(formattedProps.chains);
    const transports: Record<number, Transport> = {};
    chains.forEach((chain) => {
      transports[chain.id] = fallback(
        chain.rpcUrls.default.http.map((url) => http(url)),
      );
    });

    console.log('chains in config', chains);

    return {
      wagmiConfig: createConfig({
        chains: [
          chains[formattedProps.defaultChainId || 0] || mainnet,
          ...chains,
        ],
        connectors: connectors.map((connector) => connector.connector),
        transports,
      }),
      queryClient: new QueryClient(),
    };
  }, []);

  return (
    <BaseWagmiProvider config={config.wagmiConfig}>
      <QueryClientProvider client={config.queryClient}>
        <Child
          wagmiConfig={config.wagmiConfig}
          useStore={useStore}
          connectors={mappedConnectors}
          connectorsInitProps={formattedProps}
        />
      </QueryClientProvider>
    </BaseWagmiProvider>
  );
}
