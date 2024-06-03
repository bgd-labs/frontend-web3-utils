/**
 * Function for getting info about installed browser wallet.
 * @module Wallets/getBrowserWalletLabelAndIcon
 */

import { wallets } from './wallets';
import { defaultWallet } from './wallets/defaultWallet';

/**
 * Function for getting info about installed browser wallet.
 */
export function getBrowserWalletLabelAndIcon() {
  const defaultBrowserWallet = {
    label: defaultWallet.label,
    icon: defaultWallet.icon,
  };

  if (typeof window !== 'undefined') {
    if (window.ethereum) {
      const userBrowserWallets = wallets.filter(
        (wallet) => !!window.ethereum[wallet.identityFlag],
      );
      if (userBrowserWallets.length > 1 || userBrowserWallets.length === 0) {
        return defaultBrowserWallet;
      } else {
        return {
          label: userBrowserWallets[0].label,
          icon: userBrowserWallets[0].icon,
        };
      }
    } else {
      return defaultBrowserWallet;
    }
  } else {
    return defaultBrowserWallet;
  }
}
