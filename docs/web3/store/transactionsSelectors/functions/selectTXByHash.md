[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/store/transactionsSelectors](../README.md) / selectTXByHash

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

[src/web3/store/transactionsSelectors.ts:29](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSelectors.ts#L29)
