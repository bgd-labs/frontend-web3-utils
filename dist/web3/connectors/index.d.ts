import { CoinbaseWallet } from "@web3-react/coinbase-wallet";
import { MetaMask } from "@web3-react/metamask";
import type { AddEthereumChainParameter } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";
import { Connector } from '@web3-react/types';
import { ImpersonatedConnector } from "./impersonatedConnector";
export interface BasicChainInformation {
    urls: string[];
    name: string;
}
export interface ExtendedChainInformation extends BasicChainInformation {
    nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
    blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}
export declare type AllConnectorsInitProps = {
    appName: string;
    chains: Record<number, BasicChainInformation | ExtendedChainInformation>;
    desiredChainId: number;
};
export declare const initAllConnectors: (props: AllConnectorsInitProps) => ([MetaMask, import("@web3-react/core").Web3ReactHooks, import("zustand").StoreApi<import("@web3-react/types").Web3ReactState>] | [WalletConnect, import("@web3-react/core").Web3ReactHooks, import("zustand").StoreApi<import("@web3-react/types").Web3ReactState>] | [CoinbaseWallet, import("@web3-react/core").Web3ReactHooks, import("zustand").StoreApi<import("@web3-react/types").Web3ReactState>] | [ImpersonatedConnector, import("@web3-react/core").Web3ReactHooks, import("zustand").StoreApi<import("@web3-react/types").Web3ReactState>])[];
export declare type WalletType = "Metamask" | "WalletConnect" | "Coinbase" | "Impersonated";
export declare function getConnectorName(connector: Connector): WalletType | undefined;
