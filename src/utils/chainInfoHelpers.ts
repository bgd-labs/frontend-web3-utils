import { Chain, createPublicClient, fallback, http, PublicClient } from 'viem';
import * as viemChains from 'viem/chains';

import { ClientsRecord } from '../types/base';

export const fallBackConfig = {
  rank: false,
  retryDelay: 100,
  retryCount: 5,
};

export const VIEM_CHAINS: Record<number, Chain> = Object.values(
  viemChains,
).reduce((acc, chain) => {
  return { ...acc, [chain.id]: chain };
}, {});

export const initialChains: Record<number, Chain> = {
  [viemChains.mainnet.id]: viemChains.mainnet,
  [viemChains.polygon.id]: viemChains.polygon,
  [viemChains.polygonMumbai.id]: viemChains.polygonMumbai,
  [viemChains.avalanche.id]: viemChains.avalanche,
  [viemChains.avalancheFuji.id]: viemChains.avalancheFuji,
  [viemChains.goerli.id]: viemChains.goerli,
  [viemChains.sepolia.id]: viemChains.sepolia,
};

export const initChainInformationConfig = (chains?: Record<number, Chain>) => {
  const CHAINS = { ...initialChains, ...chains } || {};

  // init clients instances from chain config
  const initalizedClients: ClientsRecord = {};
  const clientInstances = Object.values(CHAINS).reduce<{
    [chainId: number]: {
      instance: PublicClient;
    };
  }>((accumulator, chain) => {
    const numberChainId = Number(chain.id);
    accumulator[numberChainId] = {
      get instance() {
        if (initalizedClients[numberChainId]) {
          return initalizedClients[numberChainId];
        } else {
          const client = createPublicClient({
            batch: {
              multicall: true,
            },
            chain,
            transport: fallback(
              chain.rpcUrls.default.http.map((url) => http(url)),
              fallBackConfig,
            ),
          });
          initalizedClients[numberChainId] = client;
          return client;
        }
      },
    };
    return accumulator;
  }, {});

  function getChainParameters(chainId: number): Chain {
    const chainInformation = CHAINS[chainId];
    if (chainInformation) {
      return chainInformation;
    } else {
      // this case can only ever occure when a wallet is connected with an unknown chainId which will not allow interaction
      return {
        ...viemChains.mainnet,
        id: chainId,
        name: `unknown network: ${chainId}`,
      };
    }
  }

  return {
    clientInstances,
    getChainParameters,
  };
};
