import type { AddEthereumChainParameter } from '@web3-react/types';
import { StaticJsonRpcBatchProvider } from './StaticJsonRpcBatchProvider';
export declare const ETH: AddEthereumChainParameter['nativeCurrency'];
export declare const MATIC: AddEthereumChainParameter['nativeCurrency'];
export declare const AVAX: AddEthereumChainParameter['nativeCurrency'];
interface BasicChainInformation {
    urls: string[];
    name: string;
}
interface ExtendedChainInformation extends BasicChainInformation {
    nativeCurrency: AddEthereumChainParameter['nativeCurrency'];
    blockExplorerUrls: AddEthereumChainParameter['blockExplorerUrls'];
}
export declare type ChainInformation = BasicChainInformation & ExtendedChainInformation;
export declare const initialChains: {
    [chainId: number]: ChainInformation;
};
export declare const initChainInformationConfig: (chains?: {
    [chainId: number]: BasicChainInformation | ExtendedChainInformation;
} | undefined) => {
    urls: {
        [chainId: number]: string[];
    };
    providerInstances: {
        [chainId: number]: {
            instance: StaticJsonRpcBatchProvider;
        };
    };
    getChainParameters: (chainId: number) => AddEthereumChainParameter;
};
export {};
