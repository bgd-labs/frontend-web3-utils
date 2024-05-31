[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/adapters/SafeAdapter](../README.md) / SafeAdapter

# Class: SafeAdapter\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md)

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new SafeAdapter()

> **new SafeAdapter**\<`T`\>(`get`, `set`): [`SafeAdapter`](SafeAdapter.md)\<`T`\>

#### Parameters

• **get**

• **set**

#### Returns

[`SafeAdapter`](SafeAdapter.md)\<`T`\>

#### Source

[src/web3/adapters/SafeAdapter.ts:44](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L44)

## Properties

### get()

> **get**: () => [`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Returns

[`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`get`](../../types/interfaces/AdapterInterface.md#get)

#### Source

[src/web3/adapters/SafeAdapter.ts:36](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L36)

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

[src/web3/adapters/SafeAdapter.ts:37](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L37)

***

### transactionsIntervalsMap

> **transactionsIntervalsMap**: `Record`\<`string`, `number`\> = `{}`

#### Source

[src/web3/adapters/SafeAdapter.ts:42](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L42)

## Methods

### fetchSafeTxStatus()

> `private` **fetchSafeTxStatus**(`txKey`): `Promise`\<`Response`\>

#### Parameters

• **txKey**: `string`

#### Returns

`Promise`\<`Response`\>

#### Source

[src/web3/adapters/SafeAdapter.ts:83](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L83)

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

[src/web3/adapters/SafeAdapter.ts:56](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L56)

***

### stopPollingSafeTXStatus()

> `private` **stopPollingSafeTXStatus**(`txKey`): `void`

#### Parameters

• **txKey**: `string`

#### Returns

`void`

#### Source

[src/web3/adapters/SafeAdapter.ts:143](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L143)

***

### updateSafeTxStatus()

> `private` **updateSafeTxStatus**(`txKey`, `statusResponse`, `replacedHash`?): `void`

#### Parameters

• **txKey**: `string`

• **statusResponse**: [`SafeTxStatusResponse`](../type-aliases/SafeTxStatusResponse.md)

• **replacedHash?**: \`0x$\{string\}\`

#### Returns

`void`

#### Source

[src/web3/adapters/SafeAdapter.ts:149](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/SafeAdapter.ts#L149)
