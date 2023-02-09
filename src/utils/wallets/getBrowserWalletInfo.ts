import { wallets } from './wallets';

export function getBrowserWalletInfo() {
  if (typeof window !== 'undefined') {
    const userBrowserWallets = wallets.filter(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      (wallet) => !!window.ethereum[wallet.identityFlag]
    );
    if (userBrowserWallets.length > 1 || userBrowserWallets.length === 0) {
      return {
        label: 'Browser wallet',
        icon: async () => (await import('./icons/defaultIcon.js')).default,
      };
    } else {
      return {
        label: userBrowserWallets[0].label,
        icon: userBrowserWallets[0].icon,
      };
    }
  } else {
    return undefined;
  }
}
