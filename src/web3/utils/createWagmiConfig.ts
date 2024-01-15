import { createClient, fallback, Hex, Transport } from 'viem';
import { Chain, mainnet } from 'viem/chains';
import { Config, createConfig, http } from 'wagmi';

import { fallBackConfig, VIEM_CHAINS } from '../../utils/chainInfoHelpers';
import { AllConnectorsInitProps, initAllConnectors } from '../connectors';

interface ICreateWagmiConfig {
  chains: Record<number, Chain>;
  connectorsInitProps: AllConnectorsInitProps;
  wagmiConfig?: Config;
  getImpersonatedAccount?: () => Hex | undefined;
  ssr?: boolean;
}

export function createWagmiConfig({
  chains,
  wagmiConfig,
  connectorsInitProps,
  getImpersonatedAccount,
  ssr,
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
      fallBackConfig,
    );
  });

  const chainsArray = [
    chains[
      wagmiConfig?.state.chainId || formattedProps.defaultChainId || mainnet.id
    ] || mainnet,
    ...Object.values(chains),
  ];

  const chainsArrayUnique = [
    ...new Map(chainsArray.map((item) => [item['id'], item])).values(),
  ];

  return createConfig({
    ssr,
    chains: [
      chainsArray[0],
      ...chainsArrayUnique.filter((chain) => chain.id !== chainsArray[0].id),
      ...Object.values(VIEM_CHAINS).filter(
        (chain) => !chainsArrayUnique.find((c) => chain.id === c.id)?.id,
      ),
    ],
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
