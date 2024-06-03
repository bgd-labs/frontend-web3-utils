[Modules](../../../README.md) / [Transactions/Selectors](../README.md) / selectPendingTransactions

> **selectPendingTransactions**\<`T`\>(`transactionsPool`): [`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>[]

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `transactionsPool` | [`TransactionPool`](../../Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>\> |

## Returns

[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>[]

## Source

[src/web3/store/transactionsSelectors.ts:21](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/store/transactionsSelectors.ts#L21)
