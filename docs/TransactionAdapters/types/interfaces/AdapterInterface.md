[Modules](../../../README.md) / [TransactionAdapters/types](../README.md) / AdapterInterface

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../type-aliases/BaseTx.md) |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> | [src/web3/adapters/types.ts:60](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/types.ts#L60) |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` | [src/web3/adapters/types.ts:61](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/types.ts#L61) |
| `startTxTracking` | (`tx`: [`PoolTx`](../../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\>) => `Promise`\<`void`\> | [src/web3/adapters/types.ts:66](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/adapters/types.ts#L66) |
