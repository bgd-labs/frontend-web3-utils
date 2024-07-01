[Modules](../../../README.md) / [TransactionAdapters/GelatoAdapter](../README.md) / GelatoAdapter

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md) |

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new GelatoAdapter()

> **new GelatoAdapter**\<`T`\>(`get`, `set`): [`GelatoAdapter`](GelatoAdapter.md)\<`T`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`) => `void` |

#### Returns

[`GelatoAdapter`](GelatoAdapter.md)\<`T`\>

#### Source

[src/web3/adapters/GelatoAdapter.ts:59](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/GelatoAdapter.ts#L59)

## Properties

| Property | Type | Default value |
| :------ | :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | `undefined` |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | `undefined` |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | `{}` |

## Methods

### checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`): `Promise`\<`boolean`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `chainId` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Source

[src/web3/adapters/GelatoAdapter.ts:71](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/GelatoAdapter.ts#L71)

***

### fetchGelatoTXStatus()

> `private` **fetchGelatoTXStatus**(`taskId`): `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `taskId` | `string` |

#### Returns

`Promise`\<`Response`\>

#### Source

[src/web3/adapters/GelatoAdapter.ts:113](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/GelatoAdapter.ts#L113)

***

### startTxTracking()

> **startTxTracking**(`tx`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tx` | [`PoolTx`](../../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\> |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).`startTxTracking`

#### Source

[src/web3/adapters/GelatoAdapter.ts:86](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/GelatoAdapter.ts#L86)

***

### stopPollingGelatoTXStatus()

> `private` **stopPollingGelatoTXStatus**(`taskId`): `void`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `taskId` | `string` |

#### Returns

`void`

#### Source

[src/web3/adapters/GelatoAdapter.ts:146](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/GelatoAdapter.ts#L146)

***

### updateGelatoTX()

> `private` **updateGelatoTX**(`taskId`, `statusResponse`): `void`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `taskId` | `string` |
| `statusResponse` | [`GelatoTaskStatusResponse`](../type-aliases/GelatoTaskStatusResponse.md) |

#### Returns

`void`

#### Source

[src/web3/adapters/GelatoAdapter.ts:152](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/GelatoAdapter.ts#L152)
