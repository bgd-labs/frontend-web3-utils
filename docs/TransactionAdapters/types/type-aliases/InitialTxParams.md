[Modules](../../../README.md) / [TransactionAdapters/types](../README.md) / InitialTxParams

> **InitialTxParams**\<`T`\>: `object`

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](BaseTx.md) |

## Type declaration

| Member | Type |
| :------ | :------ |
| `adapter` | [`TxAdapter`](../enumerations/TxAdapter.md) |
| `chainId` | `number` |
| `from` | `Hex` |
| `payload` | `object` \| `undefined` |
| `txKey` | `Hex` \| `string` |
| `type` | `T`\[`"type"`\] |

## Source

[src/web3/adapters/types.ts:49](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/types.ts#L49)
