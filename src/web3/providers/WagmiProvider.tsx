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
      wagmiConfig: Config;
      setWagmiConfig: (config: Config) => void;
      changeActiveWalletAccount: (
        account?: GetAccountReturnType,
      ) => Promise<void>;
      setDefaultChainId: (chainId: number) => void;
      getImpersonatedAddress?: () => Hex | undefined;
    }>
  >;
  connectorsInitProps: AllConnectorsInitProps;
}

function Child({
  wagmiConfig,
  useStore,
  connectorsInitProps,
}: WagmiProviderProps & {
  wagmiConfig: Config;
}) {
  const { setDefaultChainId, setWagmiConfig, changeActiveWalletAccount } =
    useStore();

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      console.log('account changed', account);
      await changeActiveWalletAccount(account);
    },
  });

  useEffect(() => {
    setWagmiConfig(wagmiConfig);
  }, []);

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
  const { getImpersonatedAddress, wagmiConfig } = useStore();

  const formattedProps = {
    ...connectorsInitProps,
    getImpersonatedAccount: !!connectorsInitProps.getImpersonatedAccount
      ? connectorsInitProps.getImpersonatedAccount
      : getImpersonatedAddress,
  };

  const [connectors] = useState(initAllConnectors(formattedProps));
  const queryClient = useMemo(() => new QueryClient(), []);

  const config = useMemo(() => {
    const chains = formattedProps.chains;
    if (wagmiConfig) {
      wagmiConfig.chains.forEach((chain) => {
        chains[chain.id] = chain;
      });
    }

    const transports: Record<number, Transport> = {};
    Object.values(chains).forEach((chain) => {
      transports[chain.id] = fallback(
        chain.rpcUrls.default.http.map((url) => http(url)),
      );
    });

    const chainsArray = [
      chains[
        wagmiConfig?.state.chainId || formattedProps.defaultChainId || 1
      ] || mainnet,
      ...Object.values(chains),
    ];

    // const chainsArrayFlags: Record<number, boolean> = {};
    // const chainsArrayUnique: Chain[] = [];
    // for (let i = 0; i < chainsArray.length; i++) {
    //   if (chainsArrayFlags[chainsArray[i].id]) continue;
    //   chainsArrayFlags[chainsArray[i].id] = true;
    //   chainsArrayUnique.push(chainsArray[i]);
    // }
    const chainsArrayUnique = [
      ...new Map(chainsArray.map((item) => [item['id'], item])).values(),
    ];

    return createConfig({
      chains: [chainsArray[0], ...chainsArrayUnique],
      batch: { multicall: true },
      connectors,
      transports,
    });
  }, [wagmiConfig.chains]);

  return (
    <BaseWagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Child
          wagmiConfig={config}
          useStore={useStore}
          connectorsInitProps={formattedProps}
        />
      </QueryClientProvider>
    </BaseWagmiProvider>
  );
}
