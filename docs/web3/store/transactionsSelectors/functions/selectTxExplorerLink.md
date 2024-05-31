[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/store/transactionsSelectors](../README.md) / selectTxExplorerLink

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

[src/web3/store/transactionsSelectors.ts:80](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSelectors.ts#L80)
