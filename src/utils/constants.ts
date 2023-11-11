import {
  arbitrum,
  avalanche,
  base,
  bsc,
  goerli,
  mainnet,
  optimism,
  polygon,
} from 'viem/chains';

export const safeSdkOptions = {
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  debug: false,
};

export const gnosisSafeLinksHelper: Record<number, string> = {
  [mainnet.id]: 'https://app.safe.global/eth:',
  [goerli.id]: 'https://app.safe.global/gor:',
  [optimism.id]: 'https://app.safe.global/oeth:',
  [polygon.id]: 'https://app.safe.global/matic:',
  [arbitrum.id]: 'https://app.safe.global/arb1:',
  [avalanche.id]: 'https://app.safe.global/avax:',
  [bsc.id]: 'https://app.safe.global/bnb:',
  [base.id]: 'https://app.safe.global/base:',
};

export const SafeTransactionServiceUrls: { [key in number]: string } = {
  [mainnet.id]: 'https://safe-transaction-mainnet.safe.global/api/v1',
  [goerli.id]: 'https://safe-transaction-goerli.safe.global/api/v1',
  [optimism.id]: 'https://safe-transaction-optimism.safe.global/api/v1',
  [polygon.id]: 'https://safe-transaction-polygon.safe.global/api/v1',
  [arbitrum.id]: 'https://safe-transaction-arbitrum.safe.global/api/v1',
  [avalanche.id]: 'https://safe-transaction-avalanche.safe.global/api/v1',
  [bsc.id]: 'https://safe-transaction-bsc.safe.global/api/v1',
  [base.id]: 'https://safe-transaction-base.safe.global/api/v1',
};
