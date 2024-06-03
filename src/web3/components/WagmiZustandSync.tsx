import { Config, GetAccountReturnType, watchAccount } from '@wagmi/core';
import { useEffect } from 'react';

export interface WagmiZustandSyncProps {
  wagmiConfig: Config;
  defaultChainId?: number;
  withAutoConnect?: boolean;
  store: {
    setWagmiConfig: (
      config: Config,
      withAutoConnect?: boolean,
    ) => Promise<void>;
    changeActiveWalletAccount: (
      account?: GetAccountReturnType,
    ) => Promise<void>;
    setDefaultChainId: (chainId: number) => void;
  };
}

export function WagmiZustandSync({
  wagmiConfig,
  defaultChainId,
  withAutoConnect,
  store,
}: WagmiZustandSyncProps) {
  useEffect(() => {
    if (defaultChainId) {
      store.setDefaultChainId(defaultChainId);
    }
  }, [defaultChainId]);

  useEffect(() => {
    store.setWagmiConfig(wagmiConfig, withAutoConnect);
  }, [wagmiConfig]);

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      await store.changeActiveWalletAccount(account);
    },
  });
}
