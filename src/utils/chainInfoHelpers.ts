import type { AddEthereumChainParameter } from '@web3-react/types';

import { StaticJsonRpcBatchProvider } from './StaticJsonRpcBatchProvider';

export const ETH: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Ether',
  symbol: 'ETH',
  decimals: 18,
};

export const MATIC: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Matic',
  symbol: 'MATIC',
  decimals: 18,
};

export const AVAX: AddEthereumChainParameter['nativeCurrency'] = {
  name: 'Avax',
  symbol: 'AVAX',
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
  blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}

export type ChainInformation = BasicChainInformation | ExtendedChainInformation;

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation)?.nativeCurrency;
}

export const initChainInformationConfig = (chains: {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
}) => {
  // init urls from chains config
  const urls = Object.keys(chains).reduce<{ [chainId: number]: string[] }>(
    (accumulator, chainId) => {
      const validURLs: string[] = chains[Number(chainId)].urls;

      if (validURLs.length) {
        accumulator[Number(chainId)] = validURLs;
      }

      return accumulator;
    },
    {}
  );

  // init provider instances from chain config
  const initalizedProviders: Record<number, StaticJsonRpcBatchProvider> = {};

  const providerInstances = Object.keys(chains).reduce<{
    [chainId: number]: {
      instance: StaticJsonRpcBatchProvider;
    };
  }>((accumulator, chainId) => {
    const numberChainId = Number(chainId);
    const providerInstance = {
      get instance() {
        if (initalizedProviders[numberChainId]) {
          return initalizedProviders[numberChainId];
        } else {
          // TODO: add fallback provider to utilize all the urls
          const provider = new StaticJsonRpcBatchProvider(
            urls[numberChainId][0]
          );
          initalizedProviders[numberChainId] = provider;
          return provider;
        }
      },
    } as {
      instance: StaticJsonRpcBatchProvider;
    };

    accumulator[numberChainId] = providerInstance;
    return accumulator;
  }, {});

  function getChainParameters(
    chainId: number
  ): AddEthereumChainParameter | number {
    const chainInformation = chains[chainId];
    if (isExtendedChainInformation(chainInformation)) {
      return {
        chainId,
        chainName: chainInformation.name,
        nativeCurrency: chainInformation.nativeCurrency,
        rpcUrls: chainInformation.urls,
        blockExplorerUrls: chainInformation.blockExplorerUrls,
      };
    } else {
      // this case can only ever occure when a wallet is connected with a unknown chainId which will not allow interaction
      // TODO: need fix
      return {
        chainId,
        chainName: `unknown network: ${chainId}`,
        nativeCurrency: ETH,
        rpcUrls: ['https://ethereum.publicnode.com'],
        blockExplorerUrls: ['https://etherscan.io'],
      };
    }
  }

  return {
    urls,
    providerInstances,
    getChainParameters,
  };
};
