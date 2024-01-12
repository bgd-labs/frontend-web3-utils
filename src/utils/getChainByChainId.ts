// TOOD: need change

import {
  arbitrum,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  bscTestnet,
  gnosis,
  goerli,
  mainnet,
  metis,
  optimism,
  polygon,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

export function getChainByChainId(chainId: number) {
  switch (chainId) {
    case mainnet.id:
      return mainnet;
    case polygon.id:
      return polygon;
    case avalanche.id:
      return avalanche;
    case bsc.id:
      return bsc;
    case base.id:
      return base;
    case arbitrum.id:
      return arbitrum;
    case metis.id:
      return metis;
    case optimism.id:
      return optimism;
    case gnosis.id:
      return gnosis;
    case goerli.id:
      return goerli;
    case sepolia.id:
      return sepolia;
    case polygonMumbai.id:
      return polygonMumbai;
    case avalancheFuji.id:
      return avalancheFuji;
    case bscTestnet.id:
      return bscTestnet;
    default:
      return undefined;
  }
}
