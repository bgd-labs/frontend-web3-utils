import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Web3ReactHooks } from '@web3-react/core';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Connector, Web3ReactStore } from '@web3-react/types';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { ChainInformation } from '../../utils/chainInfoHelpers';
import { ImpersonatedConnector } from './impersonatedConnector';
export declare type AllConnectorsInitProps = {
    appName: string;
    chains: Record<number, ChainInformation>;
    urls: {
        [chainId: number]: string[];
    };
    defaultChainId?: number;
    wcProjectId?: string;
};
declare type ConnectorGeneric<T> = [T, Web3ReactHooks, Web3ReactStore];
declare type ConnectorType = ConnectorGeneric<MetaMask> | ConnectorGeneric<CoinbaseWallet> | ConnectorGeneric<GnosisSafe> | ConnectorGeneric<ImpersonatedConnector> | ConnectorGeneric<WalletConnectV2>;
export declare const initAllConnectors: (props: AllConnectorsInitProps) => ConnectorType[];
export declare type WalletType = 'Metamask' | 'WalletConnect' | 'Coinbase' | 'GnosisSafe' | 'Impersonated';
export declare function getConnectorName(connector: Connector): WalletType | undefined;
export {};
