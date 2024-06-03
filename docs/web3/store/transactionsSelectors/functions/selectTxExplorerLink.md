[Modules](../../../../README.md) / [web3/store/transactionsSelectors](../README.md) / selectTxExplorerLink

> **selectTxExplorerLink**\<`T`\>(`transactionsPool`, `getChainParameters`, `txHash`, `replacedTxHash`?): `string`

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `transactionsPool` | [`TransactionPool`](../../transactionsSlice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>\> |
| `getChainParameters` | (`chainId`) => `Chain` |
| `txHash` | \`0x$\{string\}\` |
| `replacedTxHash`? | \`0x$\{string\}\` |

## Returns

`string`

## Source

[src/web3/store/transactionsSelectors.ts:80](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/store/transactionsSelectors.ts#L80)
