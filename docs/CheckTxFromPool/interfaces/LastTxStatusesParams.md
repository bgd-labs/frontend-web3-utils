[Modules](../../README.md) / [CheckTxFromPool](../README.md) / LastTxStatusesParams

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type |
| :------ | :------ |
| `activeAddress` | \`0x$\{string\}\` |
| `payload` | `T`\[`"payload"`\] |
| `transactionsPool` | [`TransactionPool`](../../Transactions/Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\>\> |
| `type` | `T`\[`"type"`\] |
