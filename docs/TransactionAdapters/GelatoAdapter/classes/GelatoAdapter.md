[Modules](../../../README.md) / [TransactionAdapters/GelatoAdapter](../README.md) / GelatoAdapter

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md) |

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new GelatoAdapter()

> **new GelatoAdapter**\<`T`\>(`get`, `set`): [`GelatoAdapter`](GelatoAdapter.md)\<`T`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`) => `void` |

#### Returns

[`GelatoAdapter`](GelatoAdapter.md)\<`T`\>

#### Defined in

[src/web3/adapters/GelatoAdapter.ts:59](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/GelatoAdapter.ts#L59)

## Properties

| Property | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | `undefined` | [src/web3/adapters/GelatoAdapter.ts:51](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/GelatoAdapter.ts#L51) |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | `undefined` | [src/web3/adapters/GelatoAdapter.ts:52](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/GelatoAdapter.ts#L52) |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | `{}` | [src/web3/adapters/GelatoAdapter.ts:57](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/GelatoAdapter.ts#L57) |

## Methods

### checkIsGelatoAvailable()

> **checkIsGelatoAvailable**(`chainId`): `Promise`\<`boolean`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `chainId` | `number` |

#### Returns

`Promise`\<`boolean`\>

#### Defined in

[src/web3/adapters/GelatoAdapter.ts:71](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/GelatoAdapter.ts#L71)

***

### startTxTracking()

> **startTxTracking**(`tx`): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `tx` | [`PoolTx`](../../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\> |

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).`startTxTracking`

#### Defined in

[src/web3/adapters/GelatoAdapter.ts:86](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/GelatoAdapter.ts#L86)
