[Modules](../../../README.md) / [TransactionAdapters/EthereumAdapter](../README.md) / EthereumAdapter

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md) |

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new EthereumAdapter()

> **new EthereumAdapter**\<`T`\>(`get`, `set`): [`EthereumAdapter`](EthereumAdapter.md)\<`T`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`) => `void` |

#### Returns

[`EthereumAdapter`](EthereumAdapter.md)\<`T`\>

#### Defined in

[src/web3/adapters/EthereumAdapter.ts:37](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/EthereumAdapter.ts#L37)

## Properties

| Property | Type | Default value | Defined in |
| ------ | ------ | ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | `undefined` | [src/web3/adapters/EthereumAdapter.ts:29](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/EthereumAdapter.ts#L29) |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | `undefined` | [src/web3/adapters/EthereumAdapter.ts:30](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/EthereumAdapter.ts#L30) |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | `{}` | [src/web3/adapters/EthereumAdapter.ts:35](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/EthereumAdapter.ts#L35) |

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

[src/web3/adapters/EthereumAdapter.ts:49](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/EthereumAdapter.ts#L49)

***

### waitForTxReceipt()

> **waitForTxReceipt**(`txHash`, `txNonce`?): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `txHash` | \`0x$\{string\}\` |
| `txNonce`? | `number` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[src/web3/adapters/EthereumAdapter.ts:80](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/EthereumAdapter.ts#L80)
