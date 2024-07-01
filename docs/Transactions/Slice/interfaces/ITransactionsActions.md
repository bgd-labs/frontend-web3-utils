[Modules](../../../README.md) / [Transactions/Slice](../README.md) / ITransactionsActions

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type |
| :------ | :------ |
| `addTXToPool` | (`tx`: [`InitialTxParams`](../../../TransactionAdapters/types/type-aliases/InitialTxParams.md)\<`T`\>) => [`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\> |
| `executeTx` | (`params`: `object`) => `Promise`\<`T` & [`PoolTxParams`](../type-aliases/PoolTxParams.md)\> |
| `removeTXFromPool` | (`txKey`: `string`) => `void` |
| `txStatusChangedCallback` | (`data`: `T` & `object`) => `void` |
