import { Chain, createPublicClient, http, PublicClient } from 'viem';
import {
  avalanche,
  avalancheFuji,
  goerli,
  mainnet,
  polygon,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

export const initialChains: Record<number, Chain> = {
  [mainnet.id]: mainnet,
  [polygon.id]: polygon,
  [polygonMumbai.id]: polygonMumbai,
  [avalanche.id]: avalanche,
  [avalancheFuji.id]: avalancheFuji,
  [goerli.id]: goerli,
  [sepolia.id]: sepolia,
};

export const initChainInformationConfig = (chains?: Record<number, Chain>) => {
  const CHAINS = { ...initialChains, ...chains } || {};

  // init clients instances from chain config
  const initalizedClients: Record<number, PublicClient> = {};
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
            transport: http(),
          }) as PublicClient;
          initalizedClients[numberChainId] = client;
          return client;
        }
      },
    } as {
      instance: PublicClient;
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
        ...mainnet,
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
