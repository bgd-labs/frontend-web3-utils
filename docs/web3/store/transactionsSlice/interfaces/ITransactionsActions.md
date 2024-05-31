[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/store/transactionsSlice](../README.md) / ITransactionsActions

# Interface: ITransactionsActions\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../../../adapters/types/type-aliases/BaseTx.md)

## Properties

### addTXToPool()

> **addTXToPool**: (`tx`) => [`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\>

#### Parameters

• **tx**: [`InitialTxParams`](../../../adapters/types/type-aliases/InitialTxParams.md)\<`T`\>

#### Returns

[`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\>

#### Source

[src/web3/store/transactionsSlice.ts:73](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/store/transactionsSlice.ts#L73)

***

### executeTx()

> **executeTx**: (`params`) => `Promise`\<`T` & [`PoolTxParams`](../type-aliases/PoolTxParams.md)\>

#### Parameters

• **params**

• **params.body**

• **params.params**

• **params.params.desiredChainID**: `number`

• **params.params.payload**: `T`\[`"payload"`\]

• **params.params.type**: `T`\[`"type"`\]

#### Returns

`Promise`\<`T` & [`PoolTxParams`](../type-aliases/PoolTxParams.md)\>

#### Source

[src/web3/store/transactionsSlice.ts:65](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/store/transactionsSlice.ts#L65)

***

### removeTXFromPool()

> **removeTXFromPool**: (`txKey`) => `void`

#### Parameters

• **txKey**: `string`

#### Returns

`void`

#### Source

[src/web3/store/transactionsSlice.ts:74](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/store/transactionsSlice.ts#L74)

***

### txStatusChangedCallback()

> **txStatusChangedCallback**: (`data`) => `void`

#### Parameters

• **data**: `T` & `object`

#### Returns

`void`

#### Source

[src/web3/store/transactionsSlice.ts:59](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/store/transactionsSlice.ts#L59)
