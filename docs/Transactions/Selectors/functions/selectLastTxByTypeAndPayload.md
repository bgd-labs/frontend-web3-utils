[Modules](../../../README.md) / [Transactions/Selectors](../README.md) / selectLastTxByTypeAndPayload

> **selectLastTxByTypeAndPayload**\<`T`\>(`transactionsPool`, `from`, `type`, `payload`): [`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `transactionsPool` | [`TransactionPool`](../../Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>\> |
| `from` | \`0x$\{string\}\` |
| `type` | `T`\[`"type"`\] |
| `payload` | `T`\[`"payload"`\] |

## Returns

[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>

## Source

[src/web3/store/transactionsSelectors.ts:63](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/store/transactionsSelectors.ts#L63)
