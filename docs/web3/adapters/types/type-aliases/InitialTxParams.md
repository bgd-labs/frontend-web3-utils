[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/adapters/types](../README.md) / InitialTxParams

# Type alias: InitialTxParams\<T\>

> **InitialTxParams**\<`T`\>: `object`

## Type parameters

• **T** *extends* [`BaseTx`](BaseTx.md)

## Type declaration

### adapter

> **adapter**: [`TxAdapter`](../enumerations/TxAdapter.md)

### chainId

> **chainId**: `number`

### from

> **from**: `Hex`

### payload

> **payload**: `object` \| `undefined`

### txKey?

> `optional` **txKey**: `Hex` \| `string`

### type

> **type**: `T`\[`"type"`\]

## Source

[src/web3/adapters/types.ts:44](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/types.ts#L44)
