import { Config, GetAccountReturnType, watchAccount } from '@wagmi/core';
import { useEffect } from 'react';

interface WagmiZustandSyncProps {
  wagmiConfig: Config;
  defaultChainId?: number;
  store: {
    setWagmiConfig: (config: Config) => Promise<void>;
    changeActiveWalletAccount: (
      account?: GetAccountReturnType,
    ) => Promise<void>;
    setDefaultChainId: (chainId: number) => void;
  };
}

export function WagmiZustandSync({
  wagmiConfig,
  defaultChainId,
  store,
}: WagmiZustandSyncProps & {
  wagmiConfig: Config;
}) {
  useEffect(() => {
    if (defaultChainId) {
      store.setDefaultChainId(defaultChainId);
    }
  }, [defaultChainId]);

  useEffect(() => {
    store.setWagmiConfig(wagmiConfig);
  }, [wagmiConfig]);

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      await store.changeActiveWalletAccount(account);
    },
  });

  return null;
}
