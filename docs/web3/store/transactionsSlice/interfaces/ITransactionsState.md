[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/store/transactionsSlice](../README.md) / ITransactionsState

# Interface: ITransactionsState\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../../../adapters/types/type-aliases/BaseTx.md)

## Properties

### adapters

> **adapters**: `object`

#### ethereum

> **ethereum**: [`EthereumAdapter`](../../../adapters/EthereumAdapter/classes/EthereumAdapter.md)\<`T`\>

#### gelato?

> `optional` **gelato**: [`GelatoAdapter`](../../../adapters/GelatoAdapter/classes/GelatoAdapter.md)\<`T`\>

#### safe?

> `optional` **safe**: [`SafeAdapter`](../../../adapters/SafeAdapter/classes/SafeAdapter.md)\<`T`\>

#### Source

[src/web3/store/transactionsSlice.ts:44](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L44)

***

### checkIsGelatoAvailable()

> **checkIsGelatoAvailable**: (`chainId`) => `Promise`\<`void`\>

#### Parameters

• **chainId**: `number`

#### Returns

`Promise`\<`void`\>

#### Source

[src/web3/store/transactionsSlice.ts:55](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L55)

***

### isGelatoAvailable

> **isGelatoAvailable**: `boolean`

#### Source

[src/web3/store/transactionsSlice.ts:54](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L54)

***

### setAdapter()

> **setAdapter**: (`adapter`) => `void`

#### Parameters

• **adapter**: [`TxAdapter`](../../../adapters/types/enumerations/TxAdapter.md)

#### Returns

`void`

#### Source

[src/web3/store/transactionsSlice.ts:49](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L49)

***

### transactionsIntervalsMap

> **transactionsIntervalsMap**: `Record`\<`string`, `number`\>

#### Source

[src/web3/store/transactionsSlice.ts:52](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L52)

***

### transactionsPool

> **transactionsPool**: [`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\>

#### Source

[src/web3/store/transactionsSlice.ts:51](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L51)
