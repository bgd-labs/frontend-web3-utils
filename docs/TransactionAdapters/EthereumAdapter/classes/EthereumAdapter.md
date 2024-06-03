[Modules](../../../README.md) / [TransactionAdapters/EthereumAdapter](../README.md) / EthereumAdapter

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md) |

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new EthereumAdapter()

> **new EthereumAdapter**\<`T`\>(`get`, `set`): [`EthereumAdapter`](EthereumAdapter.md)\<`T`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`) => `void` |

#### Returns

[`EthereumAdapter`](EthereumAdapter.md)\<`T`\>

#### Source

[src/web3/adapters/EthereumAdapter.ts:37](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/EthereumAdapter.ts#L37)

## Properties

| Property | Type | Default value |
| :------ | :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | `undefined` |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | `undefined` |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | `{}` |

## Methods

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

[src/web3/adapters/EthereumAdapter.ts:49](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/EthereumAdapter.ts#L49)

***

### updateTXStatus()

> `private` **updateTXStatus**(`txKey`, `params`): `void`

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txKey` | \`0x$\{string\}\` |
| `params` | `object` |
| `params.nonce`? | `number` |
| `params.replacedTxHash`? | \`0x$\{string\}\` |
| `params.status`? | [`TransactionStatus`](../../types/enumerations/TransactionStatus.md) |
| `params.to`? | \`0x$\{string\}\` |

#### Returns

`void`

#### Source

[src/web3/adapters/EthereumAdapter.ts:127](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/EthereumAdapter.ts#L127)

***

### waitForTxReceipt()

> **waitForTxReceipt**(`txHash`, `txNonce`?): `Promise`\<`void`\>

#### Parameters

| Parameter | Type |
| :------ | :------ |
| `txHash` | \`0x$\{string\}\` |
| `txNonce`? | `number` |

#### Returns

`Promise`\<`void`\>

#### Source

[src/web3/adapters/EthereumAdapter.ts:80](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/adapters/EthereumAdapter.ts#L80)
