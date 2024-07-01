[Modules](../../../README.md) / [TransactionAdapters/types](../README.md) / AdapterInterface

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../type-aliases/BaseTx.md) |

## Properties

| Property | Type |
| :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../Transactions/Slice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` |
| `startTxTracking` | (`tx`: [`PoolTx`](../../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\>) => `Promise`\<`void`\> |
