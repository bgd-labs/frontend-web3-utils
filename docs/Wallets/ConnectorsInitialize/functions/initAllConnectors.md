[Modules](../../../README.md) / [Wallets/ConnectorsInitialize](../README.md) / initAllConnectors

> **initAllConnectors**(`props`): (`CreateConnectorFn`\<`EthereumProvider`, `object`, `object`\> \| `CreateConnectorFn`\<`object`, `object`, `object`\> \| `CreateConnectorFn`\<`ProviderInterface` & `object`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\> \| `CreateConnectorFn`\<`CoinbaseWalletProvider`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\> \| `CreateConnectorFn`\<`SafeAppProvider`, `Record`\<`string`, `unknown`\>, `object`\> \| `CreateConnectorFn`\<`object`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>)[]

Function for initializing connectors for connecting a wallet.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `props` | [`AllConnectorsInitProps`](../type-aliases/AllConnectorsInitProps.md) |

## Returns

(`CreateConnectorFn`\<`EthereumProvider`, `object`, `object`\> \| `CreateConnectorFn`\<`object`, `object`, `object`\> \| `CreateConnectorFn`\<`ProviderInterface` & `object`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\> \| `CreateConnectorFn`\<`CoinbaseWalletProvider`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\> \| `CreateConnectorFn`\<`SafeAppProvider`, `Record`\<`string`, `unknown`\>, `object`\> \| `CreateConnectorFn`\<`object`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>)[]

## Source

[src/web3/connectors/index.ts:43](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/connectors/index.ts#L43)
