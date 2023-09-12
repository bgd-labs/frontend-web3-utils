import { Network } from '@ethersproject/networks';
import { providers } from 'ethers';
export declare class StaticJsonRpcBatchProvider extends providers.JsonRpcBatchProvider {
    detectNetwork(): Promise<Network>;
}
