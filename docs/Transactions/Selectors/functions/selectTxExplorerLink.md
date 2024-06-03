[Modules](../../../README.md) / [Transactions/Selectors](../README.md) / selectTxExplorerLink

> **selectTxExplorerLink**\<`T`\>(`transactionsPool`, `getChainParameters`, `txHash`, `replacedTxHash`?): `string`

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `transactionsPool` | [`TransactionPool`](../../Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>\> |
| `getChainParameters` | (`chainId`) => `Chain` |
| `txHash` | \`0x$\{string\}\` |
| `replacedTxHash`? | \`0x$\{string\}\` |

## Returns

`string`

## Source

[src/web3/store/transactionsSelectors.ts:85](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/store/transactionsSelectors.ts#L85)
