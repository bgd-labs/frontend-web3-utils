'use client';

import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { Connector } from '@web3-react/types';
import React, { useEffect, useState } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';

import {
  AllConnectorsInitProps,
  getConnectorName,
  initAllConnectors,
} from '../connectors';
import { Wallet } from '../store/walletSlice';

interface Web3ProviderProps {
  useStore: UseBoundStore<
    StoreApi<{
      setActiveWallet: (wallet: Omit<Wallet, 'signer'>) => void;
      changeActiveWalletChainId: (chainID: number) => void;
      setConnectors: (connectors: Connector[]) => void;
      disconnectActiveWallet: () => void;
    }>
  >;
  connectorsInitProps: AllConnectorsInitProps;
}

function Child({
  useStore,
  connectors,
}: Omit<Web3ProviderProps, 'connectorsInitProps'> & {
  connectors: Connector[];
}) {
  const { connector, chainId, isActive, accounts, provider } = useWeb3React();

  const setActiveWallet = useStore((state) => state.setActiveWallet);
  const setConnectors = useStore((state) => state.setConnectors);
  const disconnectActiveWallet = useStore(
    (state) => state.disconnectActiveWallet
  );

  const [currentWalletType, setCurrentWalletType] = useState<string>('');


  useEffect(() => {
    if (connectors) {
      setConnectors(connectors);
    }
  }, [connectors]);

  useEffect(() => {
    const walletType = connector && getConnectorName(connector);
    if (walletType && accounts && isActive && provider) {
      setCurrentWalletType(walletType);
      // TODO: don't forget to change to different
      setActiveWallet({
        walletType,
        accounts,
        chainId,
        provider,
        isActive,
        isContractAddress: false,
      });
    } else if (currentWalletType !== walletType){
      disconnectActiveWallet();
    }
  }, [isActive, chainId, provider, accounts]);
  return null;
}

export function Web3Provider({
  useStore,
  connectorsInitProps,
}: Web3ProviderProps) {
  const [connectors] = useState(initAllConnectors(connectorsInitProps));
  const [mappedConnectors] = useState(
    connectors.map((connector) => connector[0])
  );
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child useStore={useStore} connectors={mappedConnectors} />
    </Web3ReactProvider>
  );
}
