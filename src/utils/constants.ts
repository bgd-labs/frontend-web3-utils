import {
  arbitrum,
  avalanche,
  goerli,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';

export const SafeTransactionServiceUrls: { [key in number]: string } = {
  [mainnet.id]: 'https://safe-transaction-mainnet.safe.global/api/v1',
  [goerli.id]: 'https://safe-transaction-goerli.safe.global/api/v1',
  [optimism.id]: 'https://safe-transaction-optimism.safe.global/api/v1',
  [polygon.id]: 'https://safe-transaction-polygon.safe.global/api/v1',
  [arbitrum.id]: 'https://safe-transaction-arbitrum.safe.global/api/v1',
  [avalanche.id]: 'https://safe-transaction-avalanche.safe.global/api/v1',
};
