import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Config, GetAccountReturnType, watchAccount } from '@wagmi/core';
import React, { useEffect } from 'react';
import { CreateConnectorFn, WagmiProvider as BaseWagmiProvider } from 'wagmi';
import { StoreApi, UseBoundStore } from 'zustand';

import { WalletType } from '../connectors';

const queryClient = new QueryClient();

export type Connectors = { connector: CreateConnectorFn; type: WalletType }[];

interface WagmiProviderProps {
  wagmiConfig: Config;
  defaultChainId?: number;
  useStore: UseBoundStore<
    StoreApi<{
      setWagmiConfig: (config: Config) => void;
      changeActiveWalletAccount: (
        account?: GetAccountReturnType,
      ) => Promise<void>;
      setDefaultChainId: (chainId: number) => void;
    }>
  >;
}

function Child({
  wagmiConfig,
  defaultChainId,
  useStore,
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
  }, [wagmiConfig]);

  useEffect(() => {
    if (defaultChainId) {
      setDefaultChainId(defaultChainId);
    }
  }, [defaultChainId]);

  return null;
}

export function WagmiProvider({
  wagmiConfig,
  defaultChainId,
  useStore,
}: WagmiProviderProps) {
  // const formattedProps = {
  //   ...connectorsInitProps,
  //   getImpersonatedAccount: !!connectorsInitProps.getImpersonatedAccount
  //     ? connectorsInitProps.getImpersonatedAccount
  //     : getImpersonatedAddress,
  // };
  //
  // const [connectors] = useState(initAllConnectors(formattedProps));

  // const config = useMemo(() => {
  //   const chains = formattedProps.chains;
  //   if (wagmiConfig) {
  //     wagmiConfig.chains.forEach((chain) => {
  //       chains[chain.id] = chain;
  //     });
  //   }
  //
  //   const transports: Record<number, Transport> = {};
  //   Object.values(chains).forEach((chain) => {
  //     transports[chain.id] = fallback(
  //       chain.rpcUrls.default.http.map((url) => http(url)),
  //     );
  //   });
  //
  //   const chainsArray = [
  //     chains[
  //       wagmiConfig?.state.chainId || formattedProps.defaultChainId || 1
  //     ] || mainnet,
  //     ...Object.values(chains),
  //   ];
  //
  //   // const chainsArrayFlags: Record<number, boolean> = {};
  //   // const chainsArrayUnique: Chain[] = [];
  //   // for (let i = 0; i < chainsArray.length; i++) {
  //   //   if (chainsArrayFlags[chainsArray[i].id]) continue;
  //   //   chainsArrayFlags[chainsArray[i].id] = true;
  //   //   chainsArrayUnique.push(chainsArray[i]);
  //   // }
  //   const chainsArrayUnique = [
  //     ...new Map(chainsArray.map((item) => [item['id'], item])).values(),
  //   ];
  //
  //   return createConfig({
  //     chains: [chainsArray[0], ...chainsArrayUnique],
  //     batch: { multicall: true },
  //     connectors,
  //     transports,
  //   });
  // }, [wagmiConfig?.chains]);

  return (
    <BaseWagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Child
          wagmiConfig={wagmiConfig}
          useStore={useStore}
          defaultChainId={defaultChainId}
        />
      </QueryClientProvider>
    </BaseWagmiProvider>
  );
}
