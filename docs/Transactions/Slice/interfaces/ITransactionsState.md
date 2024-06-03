[Modules](../../../README.md) / [Transactions/Slice](../README.md) / ITransactionsState

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type |
| :------ | :------ |
| `adapters` | `object` |
| `adapters.ethereum` | [`EthereumAdapter`](../../../TransactionAdapters/EthereumAdapter/classes/EthereumAdapter.md)\<`T`\> |
| `adapters.gelato?` | [`GelatoAdapter`](../../../TransactionAdapters/GelatoAdapter/classes/GelatoAdapter.md)\<`T`\> |
| `adapters.safe?` | [`SafeAdapter`](../../../TransactionAdapters/SafeAdapter/classes/SafeAdapter.md)\<`T`\> |
| `checkIsGelatoAvailable` | (`chainId`: `number`) => `Promise`\<`void`\> |
| `isGelatoAvailable` | `boolean` |
| `setAdapter` | (`adapter`: [`TxAdapter`](../../../TransactionAdapters/types/enumerations/TxAdapter.md)) => `void` |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> |
| `transactionsPool` | [`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\> |
