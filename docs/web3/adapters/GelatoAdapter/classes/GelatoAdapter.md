[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/adapters/GelatoAdapter](../README.md) / GelatoAdapter

# Class: GelatoAdapter\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md)

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new GelatoAdapter()

> **new GelatoAdapter**\<`T`\>(`get`, `set`): [`GelatoAdapter`](GelatoAdapter.md)\<`T`\>

#### Parameters

• **get**

• **set**

#### Returns

[`GelatoAdapter`](GelatoAdapter.md)\<`T`\>

#### Source

[src/web3/adapters/GelatoAdapter.ts:54](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L54)

## Properties

### get()

> **get**: () => [`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Returns

[`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`get`](../../types/interfaces/AdapterInterface.md#get)

#### Source

[src/web3/adapters/GelatoAdapter.ts:46](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L46)

***

### set()

> **set**: (`fn`) => `void`

#### Parameters

• **fn**

#### Returns

`void`

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`set`](../../types/interfaces/AdapterInterface.md#set)

#### Source

[src/web3/adapters/GelatoAdapter.ts:47](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L47)

***

### transactionsIntervalsMap

> **transactionsIntervalsMap**: `Record`\<`string`, `number`\> = `{}`

#### Source

[src/web3/adapters/GelatoAdapter.ts:52](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L52)

## Methods

### checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`): `Promise`\<`boolean`\>

#### Parameters

• **chainId**: `number`

#### Returns

`Promise`\<`boolean`\>

#### Source

[src/web3/adapters/GelatoAdapter.ts:66](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L66)

***

### fetchGelatoTXStatus()

> `private` **fetchGelatoTXStatus**(`taskId`): `Promise`\<`Response`\>

#### Parameters

• **taskId**: `string`

#### Returns

`Promise`\<`Response`\>

#### Source

[src/web3/adapters/GelatoAdapter.ts:108](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L108)

***

### startTxTracking()

> **startTxTracking**(`tx`): `Promise`\<`void`\>

#### Parameters

• **tx**: [`PoolTx`](../../../store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`startTxTracking`](../../types/interfaces/AdapterInterface.md#starttxtracking)

#### Source

[src/web3/adapters/GelatoAdapter.ts:81](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L81)

***

### stopPollingGelatoTXStatus()

> `private` **stopPollingGelatoTXStatus**(`taskId`): `void`

#### Parameters

• **taskId**: `string`

#### Returns

`void`

#### Source

[src/web3/adapters/GelatoAdapter.ts:141](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L141)

***

### updateGelatoTX()

> `private` **updateGelatoTX**(`taskId`, `statusResponse`): `void`

#### Parameters

• **taskId**: `string`

• **statusResponse**: [`GelatoTaskStatusResponse`](../type-aliases/GelatoTaskStatusResponse.md)

#### Returns

`void`

#### Source

[src/web3/adapters/GelatoAdapter.ts:147](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L147)
