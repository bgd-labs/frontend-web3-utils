[**Default Options Example**](../../../README.md) • **Docs**

***

[Default Options Example](../../../modules.md) / [hooks/useLastTxLocalStatus](../README.md) / TxLocalStatus

# Interface: TxLocalStatus\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../../../web3/adapters/types/type-aliases/BaseTx.md)

## Properties

### error

> **error**: `string`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:33](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L33)

***

### executeTxWithLocalStatuses()

> **executeTxWithLocalStatuses**: (`params`) => `Promise`\<`void`\>

#### Parameters

• **params**: `ExecuteTxWithLocalStatusesParams`

#### Returns

`Promise`\<`void`\>

#### Source

[src/hooks/useLastTxLocalStatus.tsx:35](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L35)

***

### fullTxErrorMessage

> **fullTxErrorMessage**: `string`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:31](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L31)

***

### isTxStart

> **isTxStart**: `boolean`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:27](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L27)

***

### loading

> **loading**: `boolean`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:29](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L29)

***

### setError()

> **setError**: (`value`) => `void`

#### Parameters

• **value**: `string`

#### Returns

`void`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:34](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L34)

***

### setFullTxErrorMessage()

> **setFullTxErrorMessage**: (`value`) => `void`

#### Parameters

• **value**: `string`

#### Returns

`void`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:32](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L32)

***

### setIsTxStart()

> **setIsTxStart**: (`value`) => `void`

#### Parameters

• **value**: `boolean`

#### Returns

`void`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:28](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L28)

***

### setLoading()

> **setLoading**: (`value`) => `void`

#### Parameters

• **value**: `boolean`

#### Returns

`void`

#### Source

[src/hooks/useLastTxLocalStatus.tsx:30](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L30)

***

### tx

> **tx**: [`TxLocalStatusTxParams`](../type-aliases/TxLocalStatusTxParams.md)\<`T`\>

#### Source

[src/hooks/useLastTxLocalStatus.tsx:38](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/hooks/useLastTxLocalStatus.tsx#L38)
