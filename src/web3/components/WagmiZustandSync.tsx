import { Config, GetAccountReturnType, watchAccount } from '@wagmi/core';
import { useEffect } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

interface WagmiZustandSyncProps {
  wagmiConfig: Config;
  defaultChainId?: number;
  useStore: UseBoundStore<
    StoreApi<{
      setWagmiConfig: (config: Config) => void;
      changeActiveWalletAccount: (
        account?: GetAccountReturnType,
      ) => Promise<void>;
      setDefaultChainId: (chainId: number) => void;
    }>
  >;
}

export function WagmiZustandSync({
  wagmiConfig,
  defaultChainId,
  useStore,
}: WagmiZustandSyncProps & {
  wagmiConfig: Config;
}) {
  const { setDefaultChainId, setWagmiConfig, changeActiveWalletAccount } =
    useStore();

  useEffect(() => {
    if (defaultChainId) {
      setDefaultChainId(defaultChainId);
    }
  }, [defaultChainId]);

  useEffect(() => {
    setWagmiConfig(wagmiConfig);
  }, [wagmiConfig]);

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      await changeActiveWalletAccount(account);
    },
  });

  return null;
}
