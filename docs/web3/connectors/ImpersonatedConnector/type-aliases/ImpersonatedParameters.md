[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/connectors/ImpersonatedConnector](../README.md) / ImpersonatedParameters

# Type alias: ImpersonatedParameters

> **ImpersonatedParameters**: `object`

## Type declaration

### features?

> `optional` **features**: `object`

### features.connectError?

> `optional` **connectError**: `boolean` \| `Error`

### features.reconnect?

> `optional` **reconnect**: `boolean`

### features.signMessageError?

> `optional` **signMessageError**: `boolean` \| `Error`

### features.signTypedDataError?

> `optional` **signTypedDataError**: `boolean` \| `Error`

### features.switchChainError?

> `optional` **switchChainError**: `boolean` \| `Error`

### getAccountAddress()

> **getAccountAddress**: () => `Hex` \| `undefined`

#### Returns

`Hex` \| `undefined`

## Source

[src/web3/connectors/ImpersonatedConnector.ts:23](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/connectors/ImpersonatedConnector.ts#L23)
