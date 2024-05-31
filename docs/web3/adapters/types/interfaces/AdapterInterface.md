[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/adapters/types](../README.md) / AdapterInterface

# Interface: AdapterInterface\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../type-aliases/BaseTx.md)

## Properties

### get()

> **get**: () => [`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Returns

[`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Source

[src/web3/adapters/types.ts:55](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/types.ts#L55)

***

### set()

> **set**: (`fn`) => `void`

#### Parameters

• **fn**

#### Returns

`void`

#### Source

[src/web3/adapters/types.ts:56](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/types.ts#L56)

***

### startTxTracking()

> **startTxTracking**: (`tx`) => `Promise`\<`void`\>

#### Parameters

• **tx**: [`PoolTx`](../../../store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

#### Returns

`Promise`\<`void`\>

#### Source

[src/web3/adapters/types.ts:61](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/types.ts#L61)
