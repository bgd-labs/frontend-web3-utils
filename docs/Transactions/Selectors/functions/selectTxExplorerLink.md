[Modules](../../../README.md) / [Transactions/Selectors](../README.md) / selectTxExplorerLink

> **selectTxExplorerLink**\<`T`\>(`transactionsPool`, `getChainParameters`, `txHash`, `replacedTxHash`?): `string`

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `transactionsPool` | [`TransactionPool`](../../Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Slice/type-aliases/PoolTx.md)\<`T`\>\> |
| `getChainParameters` | (`chainId`) => `Chain` |
| `txHash` | \`0x$\{string\}\` |
| `replacedTxHash`? | \`0x$\{string\}\` |

## Returns

`string`

## Defined in

[src/web3/store/transactionsSelectors.ts:85](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSelectors.ts#L85)
