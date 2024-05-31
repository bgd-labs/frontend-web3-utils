[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/store/transactionsSelectors](../README.md) / selectTxExplorerLink

# Function: selectTxExplorerLink()

> **selectTxExplorerLink**\<`T`\>(`transactionsPool`, `getChainParameters`, `txHash`, `replacedTxHash`?): `string`

## Type parameters

• **T** *extends* [`BaseTx`](../../../adapters/types/type-aliases/BaseTx.md)

## Parameters

• **transactionsPool**: [`TransactionPool`](../../transactionsSlice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>\>

• **getChainParameters**

• **txHash**: \`0x$\{string\}\`

• **replacedTxHash?**: \`0x$\{string\}\`

## Returns

`string`

## Source

[src/web3/store/transactionsSelectors.ts:80](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/store/transactionsSelectors.ts#L80)
