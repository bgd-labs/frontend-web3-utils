import { Actions, Connector } from '@web3-react/types';
import { ethers, providers } from 'ethers';

export class ImpersonatedProvider extends providers.JsonRpcProvider {
  private copyProvider: providers.JsonRpcProvider;
  constructor(url: string) {
    super(url);
    this.copyProvider = new providers.JsonRpcProvider(url);
  }
  getSigner(address: string): ethers.providers.JsonRpcSigner {
    return this.copyProvider.getUncheckedSigner(address);
  }
}

export class ImpersonatedConnector extends Connector {
  private rpcURL: string;
  constructor(
    actions: Actions,
    options: {
      rpcUrl: string;
    }
  ) {
    super(actions);
    this.rpcURL = options.rpcUrl;
  }
  activate(address: string): void | Promise<void> {
    this.actions.startActivation();
    this.customProvider = new ImpersonatedProvider(this.rpcURL);
    this.actions.update({
      chainId: 1,
      accounts: [address],
    });
  }
}
