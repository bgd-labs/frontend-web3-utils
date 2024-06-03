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
| `transactionsPool` | [`TransactionPool`](../../web3/store/transactionsSlice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../web3/store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\>\> |
| `type` | `T`\[`"type"`\] |
