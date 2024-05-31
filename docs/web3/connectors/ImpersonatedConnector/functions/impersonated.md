[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/connectors/ImpersonatedConnector](../README.md) / impersonated

# Function: impersonated()

> **impersonated**(`parameters`): `CreateConnectorFn`\<`object`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>

## Parameters

• **parameters**: [`ImpersonatedParameters`](../type-aliases/ImpersonatedParameters.md)

## Returns

`CreateConnectorFn`\<`object`, `Record`\<`string`, `unknown`\>, `Record`\<`string`, `unknown`\>\>

### config

> **config**: `TransportConfig`\<`"custom"`, `EIP1193RequestFn`\>

### request

> **request**: `EIP1193RequestFn`\<`WalletRpcSchema`\>

### value?

> `optional` **value**: `object`

## Source

[src/web3/connectors/ImpersonatedConnector.ts:37](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/connectors/ImpersonatedConnector.ts#L37)
