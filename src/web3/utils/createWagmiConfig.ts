import { createClient, fallback, Hex, Transport } from 'viem';
import { Chain, mainnet } from 'viem/chains';
import { Config, createConfig, http } from 'wagmi';

import { fallBackConfig } from '../../utils/chainInfoHelpers';
import { AllConnectorsInitProps, initAllConnectors } from '../connectors';

interface ICreateWagmiConfig {
  chains: Record<number, Chain>;
  connectorsInitProps: AllConnectorsInitProps;
  wagmiConfig?: Config;
  getImpersonatedAccount?: () => Hex | undefined;
}

export function createWagmiConfig({
  chains,
  wagmiConfig,
  connectorsInitProps,
  getImpersonatedAccount,
}: ICreateWagmiConfig) {
  const formattedProps = {
    ...connectorsInitProps,
    getImpersonatedAccount,
  };

  const connectors = initAllConnectors(formattedProps);

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
    chains[wagmiConfig?.state.chainId || formattedProps.defaultChainId || 1] ||
      mainnet,
    ...Object.values(chains),
  ];

  const chainsArrayUnique = [
    ...new Map(chainsArray.map((item) => [item['id'], item])).values(),
  ];

  return createConfig({
    chains: [chainsArray[0], ...chainsArrayUnique],
    multiInjectedProviderDiscovery: false,
    connectors,
    client({ chain }) {
      return createClient({
        chain,
        batch: {
          multicall: true,
        },
        transport: fallback(
          chain.rpcUrls.default.http.map((url: string) => http(url)),
          fallBackConfig,
        ),
      });
    },
  });
}
