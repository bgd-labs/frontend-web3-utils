[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/store/transactionsSelectors](../README.md) / selectTXByHash

# Function: selectTXByHash()

> **selectTXByHash**\<`T`\>(`transactionsPool`, `hash`): [`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

## Type parameters

• **T** *extends* [`BaseTx`](../../../adapters/types/type-aliases/BaseTx.md)

## Parameters

• **transactionsPool**: [`TransactionPool`](../../transactionsSlice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>\>

• **hash**: \`0x$\{string\}\`

## Returns

[`PoolTx`](../../transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

## Source

[src/web3/store/transactionsSelectors.ts:29](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/store/transactionsSelectors.ts#L29)
