import { Connector, Actions } from "@web3-react/types";
import { ethers, providers } from "ethers";
export declare class ImpersonatedProvider extends providers.JsonRpcProvider {
    private copyProvider;
    constructor(url: string);
    getSigner(address: string): ethers.providers.JsonRpcSigner;
}
export declare class ImpersonatedConnector extends Connector {
    private rpcURL;
    constructor(actions: Actions, options: {
        rpcUrl: string;
    });
    activate(address: string): void | Promise<void>;
}
