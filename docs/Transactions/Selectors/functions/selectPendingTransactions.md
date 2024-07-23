[Modules](../../../README.md) / [Transactions/Selectors](../README.md) / selectPendingTransactions

> **selectPendingTransactions**\<`T`\>(`transactionsPool`): [`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>[]

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `transactionsPool` | [`TransactionPool`](../../Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>\> |

## Returns

[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>[]

## Defined in

[src/web3/store/transactionsSelectors.ts:21](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSelectors.ts#L21)
