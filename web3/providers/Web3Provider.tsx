import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import {
  useWeb3React,
  Web3ReactHooks,
  Web3ReactProvider,
} from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import type { Connector, Web3ReactStore } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { useEffect } from "react";
import { ImpersonatedConnector } from "../connectors/impersonatedConnector";
import { Wallet, WalletType } from "../store/walletSlice";

function getName(connector: Connector): WalletType | undefined {
  if (connector instanceof MetaMask) return "Metamask";
  if (connector instanceof WalletConnect) return "WalletConnect";
  if (connector instanceof CoinbaseWallet) return "Coinbase";
  if (connector instanceof ImpersonatedConnector) return "Impersonated";
  return;
}

type Props = {
  connectors:
    | [Connector, Web3ReactHooks][]
    | [Connector, Web3ReactHooks, Web3ReactStore][];
  setActiveWallet: (wallet: Omit<Wallet, "signer">) => void;
  changeChainID: (chainID: number) => void;
};

function Child({ setActiveWallet, changeChainID }: Omit<Props, "connectors">) {
  const { connector, chainId, isActive, accounts, provider } = useWeb3React();
  // const setActiveWallet = useStore((state) => state.setActiveWallet);
  // const changeChainID = useStore((state) => state.changeActiveWalletChainId);
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

export const Web3Provider = ({
  connectors,
  setActiveWallet,
  changeChainID,
}: Props) => {
  return (
    <Web3ReactProvider connectors={connectors}>
      <Child setActiveWallet={setActiveWallet} changeChainID={changeChainID} />
    </Web3ReactProvider>
  );
};
