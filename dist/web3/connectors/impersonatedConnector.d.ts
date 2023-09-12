import { Actions, Connector } from '@web3-react/types';
import { ethers, providers } from 'ethers';
export declare class ImpersonatedProvider extends providers.JsonRpcProvider {
    private copyProvider;
    constructor(url: string);
    getSigner(address: string): ethers.providers.JsonRpcSigner;
}
export declare class ImpersonatedConnector extends Connector {
    private urls;
    private chainId;
    constructor(actions: Actions, options: {
        urls: {
            [chainId: number]: string[];
        };
        chainId: number;
    });
    activate({ address, chainId, }: {
        address: string;
        chainId: number;
    }): void | Promise<void>;
}
