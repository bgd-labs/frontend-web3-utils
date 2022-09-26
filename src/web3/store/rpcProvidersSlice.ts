import type { AddEthereumChainParameter } from '@web3-react/types';
import { providers } from 'ethers';
import { produce } from 'immer';

import { StoreSlice } from '../../types/store';

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
  chainInformation: ChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

export type IRpcProvidersSlice = {
  providers: Record<number, providers.StaticJsonRpcProvider>;
  urls: Record<number, string[]>;
  setProvider: (chainId: number) => void;
  getChainParameters: (chainId: number) => AddEthereumChainParameter | number;
};

export function createRpcProvidersSlice({
  chains,
}: {
  chains: {
    [chainId: number]: ChainInformation;
  };
}): {
  initProviders: Record<number, providers.StaticJsonRpcProvider>;
  store: StoreSlice<IRpcProvidersSlice>;
} {
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

  // init providers from chains config
  const initProviders = Object.keys(chains).reduce<{
    [chainId: number]: providers.StaticJsonRpcProvider;
  }>((accumulator, chainId) => {
    const numberChainId = Number(chainId);

    accumulator[numberChainId] = new providers.StaticJsonRpcProvider(
      urls[numberChainId][0]
    );
    return accumulator;
  }, {});

  return {
    initProviders,
    store: (set) => ({
      providers: initProviders,
      urls,
      setProvider: (chainId) => {
        if (typeof chains[chainId] === 'undefined') {
          throw new Error(
            `Parameters for chainId: ${chainId} are not set in the 'CHAINS' config. Please set parameters for chainId: ${chainId} and try again.`
          );
        } else {
          const providerUrl = urls[chainId][0];

          set((state) =>
            produce(state, (draft) => {
              draft.providers[chainId] = new providers.StaticJsonRpcProvider(
                providerUrl
              );
            })
          );
        }
      },
      getChainParameters: (chainId) => {
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
      },
    }),
  };
}
