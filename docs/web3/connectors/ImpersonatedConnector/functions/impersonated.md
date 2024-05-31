[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/connectors/ImpersonatedConnector](../README.md) / impersonated

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

[src/web3/connectors/ImpersonatedConnector.ts:37](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/connectors/ImpersonatedConnector.ts#L37)
