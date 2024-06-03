[Modules](../../../../README.md) / [web3/store/transactionsSelectors](../README.md) / selectAllTransactionsByWallet

> **selectAllTransactionsByWallet**\<`T`\>(`transactionsPool`, `from`): [`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>[]

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `transactionsPool` | [`TransactionPool`](../../transactionsSlice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>\> |
| `from` | \`0x$\{string\}\` |

## Returns

[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>[]

## Source

[src/web3/store/transactionsSelectors.ts:40](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/store/transactionsSelectors.ts#L40)
