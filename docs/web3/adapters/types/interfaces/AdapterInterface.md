[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/adapters/types](../README.md) / AdapterInterface

# Interface: AdapterInterface\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../type-aliases/BaseTx.md)

## Properties

### get()

> **get**: () => [`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Returns

[`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Source

[src/web3/adapters/types.ts:55](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/types.ts#L55)

***

### set()

> **set**: (`fn`) => `void`

#### Parameters

• **fn**

#### Returns

`void`

#### Source

[src/web3/adapters/types.ts:56](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/types.ts#L56)

***

### startTxTracking()

> **startTxTracking**: (`tx`) => `Promise`\<`void`\>

#### Parameters

• **tx**: [`PoolTx`](../../../store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

#### Returns

`Promise`\<`void`\>

#### Source

[src/web3/adapters/types.ts:61](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/types.ts#L61)
