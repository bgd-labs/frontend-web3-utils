import { MockProvider, MockProviderOptions } from '@wagmi/connectors/mock';
import { Connector, ConnectorData, WalletClient } from '@wagmi/core';
import { Account, createWalletClient, getAddress, Hex, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import type { Chain } from 'viem/chains';
import { mainnet } from 'viem/chains';

export function normalizeChainId(chainId: string | number | bigint) {
  if (typeof chainId === 'string')
    return Number.parseInt(
      chainId,
      chainId.trim().substring(0, 2) === '0x' ? 16 : 10,
    );
  if (typeof chainId === 'bigint') return Number(chainId);
  return chainId;
}

type MockConnectorOptions = Omit<
  MockProviderOptions,
  'chainId' | 'walletClient'
> & {
  chainId?: number;
};

export class ImpersonatedConnector extends Connector<
  MockProvider,
  MockConnectorOptions
> {
  readonly id = 'impersonated';
  readonly name = 'Impersonated';
  readonly ready = true;
  private account: Account;

  #provider?: MockProvider;

  constructor({
    chains,
    options,
  }: {
    chains?: Chain[];
    options: MockConnectorOptions;
  }) {
    super({
      chains,
      options: {
        ...options,
        chainId: options.chainId ?? chains?.[0]?.id,
      },
    });
    this.account = privateKeyToAccount(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    );
  }

  setAccount(account: Account | undefined) {
    if (account) {
      this.account = account;
    }
  }

  async connect({ chainId }: { address?: Hex; chainId?: number } = {}) {
    const provider = await this.getProvider({
      chainId,
    });
    provider.on('accountsChanged', this.onAccountsChanged);
    provider.on('chainChanged', this.onChainChanged);
    provider.on('disconnect', this.onDisconnect);

    this.emit('message', { type: 'connecting' });

    const accounts = await provider.enable();
    const account = getAddress(accounts[0] as string);
    const id = normalizeChainId(provider.chainId);
    const unsupported = this.isChainUnsupported(id);
    const data = { account, chain: { id, unsupported }, provider };

    if (!this.options.flags?.noSwitchChain)
      this.switchChain = this.#switchChain;

    return new Promise<Required<ConnectorData>>((res) =>
      setTimeout(() => res(data), 100),
    );
  }

  async disconnect() {
    const provider = await this.getProvider();
    await provider.disconnect();

    provider.removeListener('accountsChanged', this.onAccountsChanged);
    provider.removeListener('chainChanged', this.onChainChanged);
    provider.removeListener('disconnect', this.onDisconnect);
  }

  async getAccount() {
    const provider = await this.getProvider();
    const accounts = await provider.getAccounts();
    const account = accounts[0];
    if (!account) throw new Error('Failed to get account');
    // return checksum address
    return getAddress(account);
  }

  async getChainId() {
    const provider = await this.getProvider();
    return normalizeChainId(provider.chainId);
  }

  async getProvider({ chainId }: { chainId?: number } = {}) {
    const chain = this.chains.find((chain) => chain.id === chainId);
    if (!this.#provider || chainId)
      this.#provider = new MockProvider({
        ...this.options,
        chainId: chainId ?? this.options.chainId ?? this.chains[0]!.id,
        walletClient: createWalletClient({
          account: this.account,
          chain: chain || mainnet,
          transport: http(chain?.rpcUrls.default.http[0]),
        }),
      });
    return this.#provider;
  }

  async getWalletClient(): Promise<WalletClient> {
    const provider = await this.getProvider();
    return provider.getWalletClient();
  }

  async isAuthorized() {
    try {
      const provider = await this.getProvider();
      const account = await provider.getAccounts();
      return this.options.flags?.isAuthorized ?? !!account;
    } catch {
      return false;
    }
  }

  async #switchChain(chainId: number) {
    const provider = await this.getProvider();
    await provider.switchChain(chainId);
    return (
      this.chains.find((x) => x.id === chainId) ?? {
        id: chainId,
        name: `Chain ${chainId}`,
        network: `${chainId}`,
        nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
        rpcUrls: { default: { http: [''] }, public: { http: [''] } },
      }
    );
  }

  async watchAsset(asset: {
    address: string;
    decimals?: number;
    image?: string;
    symbol: string;
  }) {
    const provider = await this.getProvider();
    return provider.watchAsset(asset);
  }

  protected onAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) this.emit('disconnect');
    else this.emit('change', { account: getAddress(accounts[0] as string) });
  };

  protected onChainChanged = (chainId: number | string) => {
    const id = normalizeChainId(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit('change', { chain: { id, unsupported } });
  };

  protected onDisconnect = () => {
    this.emit('disconnect');
  };

  toJSON() {
    return '<MockConnector>';
  }
}
