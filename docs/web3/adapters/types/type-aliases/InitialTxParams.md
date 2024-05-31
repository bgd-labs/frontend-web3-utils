[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/adapters/types](../README.md) / InitialTxParams

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

[src/web3/adapters/types.ts:44](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/types.ts#L44)
