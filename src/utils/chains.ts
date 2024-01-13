import { Chain } from 'viem/chains';
import * as viemChains from 'viem/chains';

export const VIEM_CHAINS: Record<number, Chain> = Object.values(
  viemChains,
).reduce((acc, chain) => {
  return { ...acc, [chain.id]: chain };
}, {});
