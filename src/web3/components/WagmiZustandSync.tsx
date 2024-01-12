import { Config, GetAccountReturnType, watchAccount } from '@wagmi/core';
import { useEffect } from 'react';
import { CreateConnectorFn } from 'wagmi';
import { StoreApi, UseBoundStore } from 'zustand';

import { WalletType } from '../connectors';

export type Connectors = { connector: CreateConnectorFn; type: WalletType }[];

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

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      await changeActiveWalletAccount(account);
    },
  });

  useEffect(() => {
    setWagmiConfig(wagmiConfig);
  }, [wagmiConfig]);

  useEffect(() => {
    if (defaultChainId) {
      setDefaultChainId(defaultChainId);
    }
  }, [defaultChainId]);

  return null;
}
