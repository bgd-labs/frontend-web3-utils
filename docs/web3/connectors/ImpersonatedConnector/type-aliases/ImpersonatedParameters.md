[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/connectors/ImpersonatedConnector](../README.md) / ImpersonatedParameters

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

[src/web3/connectors/ImpersonatedConnector.ts:23](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/connectors/ImpersonatedConnector.ts#L23)
