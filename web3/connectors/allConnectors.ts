import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import type { AddEthereumChainParameter } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { ImpersonatedConnector } from "./impersonatedConnector";

export interface BasicChainInformation {
  urls: string[];
  name: string;
}

export interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}

export type AllConnectorsInitProps = {
  appName: string;
  chains: Record<number, BasicChainInformation | ExtendedChainInformation>;
  desiredChainId: number;
};

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const metaMask = initializeConnector<MetaMask>(
    (actions) => new MetaMask({ actions })
  );

  const URLS: { [chainId: number]: string[] } = Object.keys(
    props.chains
  ).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
    const validURLs: string[] = props.chains[Number(chainId)].urls;

    if (validURLs.length) {
      accumulator[Number(chainId)] = validURLs;
    }

    return accumulator;
  }, {});

  const walletConnect = initializeConnector<WalletConnect>(
    (actions) =>
      new WalletConnect({
        actions,
        options: {
          rpc: URLS,
        }
      })
  );

  const coinbase = initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions, 
        options: {
          url: props.chains[props.desiredChainId].urls[0],
          appName: props.appName,
        }
      })
  );

  const impersonatedConnector = initializeConnector<ImpersonatedConnector>(
    (actions) =>
      new ImpersonatedConnector(actions, {
        rpcUrl: props.chains[props.desiredChainId].urls[0],
      })
  );

  const mappedConnectors: [
    MetaMask | WalletConnect | CoinbaseWallet | ImpersonatedConnector,
    Web3ReactHooks
  ][] = [
    [metaMask[0], metaMask[1]],
    [walletConnect[0], walletConnect[1]],
    [coinbase[0], coinbase[1]],
    [impersonatedConnector[0], impersonatedConnector[1]],
  ];

  return {
    metaMask,
    walletConnect,
    coinbase,
    impersonatedConnector,
    mappedConnectors,
  };
};
