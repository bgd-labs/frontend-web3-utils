[Modules](../../../README.md) / [TransactionAdapters/SafeAdapter](../README.md) / SafeAdapter

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md) |

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new SafeAdapter()

> **new SafeAdapter**\<`T`\>(`get`, `set`): [`SafeAdapter`](SafeAdapter.md)\<`T`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../web3/store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`) => `void` |

#### Returns

[`SafeAdapter`](SafeAdapter.md)\<`T`\>

#### Source

[src/web3/adapters/SafeAdapter.ts:49](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/adapters/SafeAdapter.ts#L49)

## Properties

| Property | Type | Default value |
| :------ | :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../web3/store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | `undefined` |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../web3/store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | `undefined` |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | `{}` |

## Methods

### fetchSafeTxStatus()

> `private` **fetchSafeTxStatus**(`txKey`): `Promise`\<`Response`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txKey` | `string` |

#### Returns

`Promise`\<`Response`\>

#### Source

[src/web3/adapters/SafeAdapter.ts:88](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/adapters/SafeAdapter.ts#L88)

***

### startTxTracking()

> **startTxTracking**(`tx`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `tx` | [`PoolTx`](../../../web3/store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\> |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).`startTxTracking`

#### Source

[src/web3/adapters/SafeAdapter.ts:61](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/adapters/SafeAdapter.ts#L61)

***

### stopPollingSafeTXStatus()

> `private` **stopPollingSafeTXStatus**(`txKey`): `void`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txKey` | `string` |

#### Returns

`void`

#### Source

[src/web3/adapters/SafeAdapter.ts:148](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/adapters/SafeAdapter.ts#L148)

***

### updateSafeTxStatus()

> `private` **updateSafeTxStatus**(`txKey`, `statusResponse`, `replacedHash`?): `void`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txKey` | `string` |
| `statusResponse` | [`SafeTxStatusResponse`](../type-aliases/SafeTxStatusResponse.md) |
| `replacedHash`? | \`0x$\{string\}\` |

#### Returns

`void`

#### Source

[src/web3/adapters/SafeAdapter.ts:154](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/adapters/SafeAdapter.ts#L154)
