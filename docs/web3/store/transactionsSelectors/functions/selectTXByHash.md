[Modules](../../../../README.md) / [web3/store/transactionsSelectors](../README.md) / selectTXByHash

> **selectTXByHash**\<`T`\>(`transactionsPool`, `hash`): [`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `transactionsPool` | [`TransactionPool`](../../transactionsSlice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>\> |
| `hash` | \`0x$\{string\}\` |

## Returns

[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

## Source

[src/web3/store/transactionsSelectors.ts:29](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/store/transactionsSelectors.ts#L29)
