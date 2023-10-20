import React, { ReactNode, useEffect, useState } from 'react';
import {
  configureChains,
  createConfig,
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
  WagmiConfig,
} from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { StoreApi, UseBoundStore } from 'zustand';

import {
  AllConnectorsInitProps,
  ConnectorType,
  getConnectorName,
  initAllConnectors,
} from '../connectors';
import { Wallet } from '../store/walletSlice';

interface WagmiProviderProps {
  useStore: UseBoundStore<
    StoreApi<{
      setActiveWallet: (wallet: Wallet) => void;
      changeActiveWalletChainId: (chainID: number) => void;
      setConnectors: (connectors: ConnectorType[]) => void;
      disconnectActiveWallet: () => void;
    }>
  >;
  connectorsInitProps: AllConnectorsInitProps;
  children: ReactNode;
}

function Child({
  useStore,
  connectors,
  children,
}: Omit<WagmiProviderProps, 'connectorsInitProps'> & {
  connectors: ConnectorType[];
}) {
  const { connector, isConnected, address: account } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();

  const setActiveWallet = useStore((state) => state.setActiveWallet);
  const setConnectors = useStore((state) => state.setConnectors);
  const disconnectActiveWallet = useStore(
    (state) => state.disconnectActiveWallet,
  );

  const [currentWalletType, setCurrentWalletType] = useState<string>('');

  useEffect(() => {
    if (connectors) {
      setConnectors(connectors);
    }
  }, [connectors]);

  useEffect(() => {
    const walletType =
      connector && getConnectorName(connector as ConnectorType);

    console.log('wallet client', walletClient);

    if (
      walletType &&
      account &&
      isConnected &&
      publicClient &&
      walletClient &&
      walletClient.data
    ) {
      console.log('here');
      setCurrentWalletType(walletType);
      // TODO: don't forget to change to different
      setActiveWallet({
        walletType,
        account,
        chainId,
        client: publicClient,
        walletClient: walletClient.data,
        isActive: isConnected,
        isContractAddress: false,
      });
    } else if (currentWalletType !== walletType) {
      disconnectActiveWallet();
    }
  }, [isConnected, chainId, publicClient, account, walletClient]);

  return children;
}

// TODO: maybe need fix
export function WagmiProvider({
  useStore,
  connectorsInitProps,
  children,
}: WagmiProviderProps) {
  const [connectors] = useState(initAllConnectors(connectorsInitProps));
  const [mappedConnectors] = useState<ConnectorType[]>(
    connectors.map((connector) => connector),
  );

  const { publicClient } = configureChains(
    Object.values(connectorsInitProps.chains),
    [publicProvider()],
  );

  const client = createConfig({
    autoConnect: false,
    publicClient,
    connectors,
  });

  return (
    <WagmiConfig config={client}>
      <Child useStore={useStore} connectors={mappedConnectors}>
        {children}
      </Child>
    </WagmiConfig>
  );
}
