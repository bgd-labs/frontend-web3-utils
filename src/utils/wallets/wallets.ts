import { WalletIdentityFlag, WalletLabel } from './types';

const metamask = {
  identityFlag: WalletIdentityFlag.MetaMask,
  label: WalletLabel.MetaMask,
  icon: async () => (await import('./icons/metamask.js')).default,
};

export const wallets = [metamask];
