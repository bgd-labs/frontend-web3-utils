import type { AddEthereumChainParameter } from '@web3-react/types';
import { providers } from 'ethers';

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
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
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
  const initalizedProviders: Record<number, providers.JsonRpcBatchProvider> =
    {};

  const providerInstances = Object.keys(chains).reduce<{
    [chainId: number]: {
      instance: providers.JsonRpcBatchProvider;
    };
  }>((accumulator, chainId) => {
    const numberChainId = Number(chainId);
    const providerInstance = {
      get instance() {
        if (initalizedProviders[numberChainId]) {
          return initalizedProviders[numberChainId];
        } else {
          // TODO: add fallback provider to utilize all the urls
          let provider = new providers.JsonRpcBatchProvider(
            urls[numberChainId][0]
          );
          initalizedProviders[numberChainId] = provider;
          return provider;
        }
      },
    } as {
      instance: providers.JsonRpcBatchProvider;
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
      return chainId;
    }
  }

  return {
    urls,
    providerInstances,
    getChainParameters,
  };
};
