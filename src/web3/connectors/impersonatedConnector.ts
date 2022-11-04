import { Actions, Connector } from '@web3-react/types';
import { ethers, providers } from 'ethers';

export class ImpersonatedProvider extends providers.JsonRpcBatchProvider {
  private copyProvider: providers.JsonRpcBatchProvider;
  constructor(url: string) {
    super(url);
    this.copyProvider = new providers.JsonRpcBatchProvider(url);
  }
  getSigner(address: string): ethers.providers.JsonRpcSigner {
    return this.copyProvider.getUncheckedSigner(address);
  }
}

export class ImpersonatedConnector extends Connector {
  private urls: { [chainId: number]: string[] };
  private chainId: number;
  constructor(
    actions: Actions,
    options: {
      urls: { [chainId: number]: string[] };
      chainId: number;
    }
  ) {
    super(actions);
    this.urls = options.urls;
    this.chainId = options.chainId;
  }
  activate({
    address,
    chainId,
  }: {
    address: string;
    chainId: number;
  }): void | Promise<void> {
    this.actions.startActivation();
    this.customProvider = new ImpersonatedProvider(
      this.urls[chainId || this.chainId][0]
    );
    this.actions.update({
      chainId: chainId || this.chainId,
      accounts: [address],
    });
  }
}
