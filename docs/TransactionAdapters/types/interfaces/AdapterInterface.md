[Modules](../../../README.md) / [TransactionAdapters/types](../README.md) / AdapterInterface

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../type-aliases/BaseTx.md) |

## Properties

| Property | Type |
| :------ | :------ |
| `get` | () => [`ITransactionsSliceWithWallet`](../../../web3/store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\> |
| `set` | (`fn`: (`state`) => [`ITransactionsSliceWithWallet`](../../../web3/store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>) => `void` |
| `startTxTracking` | (`tx`: [`PoolTx`](../../../web3/store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\>) => `Promise`\<`void`\> |
