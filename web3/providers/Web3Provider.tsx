import { UseBoundStore, StoreApi } from "zustand";
import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import {
  useWeb3React,
  Web3ReactProvider,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import type { Connector } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { useEffect } from "react";
import { ImpersonatedConnector } from "../connectors/impersonatedConnector";
import { Wallet, WalletType } from '../store/walletSlice';
import { AllConnectorsInitProps, initAllConnectors } from '../connectors/allConnectors';
import { BaseTx } from '../store/transactionsSlice';

function getName(connector: Connector): WalletType | undefined {
  if (connector instanceof MetaMask) return "Metamask";
  if (connector instanceof WalletConnect) return "WalletConnect";
  if (connector instanceof CoinbaseWallet) return "Coinbase";
  if (connector instanceof ImpersonatedConnector) return "Impersonated";
  return;
}

interface Props{
  useStore: UseBoundStore<StoreApi<{
    setActiveWallet: (wallet: Omit<Wallet, "signer">) => void;
    changeChainID: (chainID: number) => void;
  }>>
  connectorsInitProps: AllConnectorsInitProps;

}

function Child<T extends BaseTx>({ useStore }: Omit<Props, "connectorsInitProps">) {
  const { connector, chainId, isActive, accounts, provider } = useWeb3React();

  const setActiveWallet = useStore((state) => state.setActiveWallet);
  const changeChainID = useStore((state) => state.changeChainID);

  useEffect(() => {
    const walletType = getName(connector);
    if (walletType && accounts && isActive && provider) {
      // TODO: don't forget to change to different
      setActiveWallet({
        walletType,
        accounts,
        chainId,
        provider,
        isActive,
      });
    }
  }, [isActive, chainId, provider, accounts]);

  useEffect(() => {
    if (chainId) {
      changeChainID(chainId);
    }
  }, [chainId]);
  return null;
}

export const Web3Provider = <T extends BaseTx>({
  useStore,
  connectorsInitProps,
}: Props) => {
  const connectors = initAllConnectors(connectorsInitProps);
  return (
    <Web3ReactProvider connectors={connectors.mappedConnectors}>
      <Child useStore={useStore} connectors={connectors} />
    </Web3ReactProvider>
  );
};
