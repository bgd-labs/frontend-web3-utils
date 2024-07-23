[Modules](../../../README.md) / [TransactionAdapters/SafeAdapter](../README.md) / SafeAdapter

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md) |

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new SafeAdapter()

> **new SafeAdapter**\<`T`\>(`get`, `set`): [`SafeAdapter`](SafeAdapter.md)\<`T`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`) => `void` |

#### Returns

[`SafeAdapter`](SafeAdapter.md)\<`T`\>

#### Defined in

[src/web3/adapters/SafeAdapter.ts:49](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/SafeAdapter.ts#L49)

## Properties

| Property | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | `undefined` | [src/web3/adapters/SafeAdapter.ts:41](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/SafeAdapter.ts#L41) |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | `undefined` | [src/web3/adapters/SafeAdapter.ts:42](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/SafeAdapter.ts#L42) |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | `{}` | [src/web3/adapters/SafeAdapter.ts:47](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/SafeAdapter.ts#L47) |

## Methods

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

[src/web3/adapters/SafeAdapter.ts:61](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/SafeAdapter.ts#L61)
