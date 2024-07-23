[Modules](../../../README.md) / [Transactions/Slice](../README.md) / ITransactionsActions

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `addTXToPool` | (`tx`: [`InitialTxParams`](../../../TransactionAdapters/types/type-aliases/InitialTxParams.md)\<`T`\>) => [`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\> | [src/web3/store/transactionsSlice.ts:77](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L77) |
| `executeTx` | (`params`: `object`) => `Promise`\<`T` & [`PoolTxParams`](../type-aliases/PoolTxParams.md)\> | [src/web3/store/transactionsSlice.ts:69](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L69) |
| `removeTXFromPool` | (`txKey`: `string`) => `void` | [src/web3/store/transactionsSlice.ts:78](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L78) |
| `txStatusChangedCallback` | (`data`: `T` & `object`) => `void` | [src/web3/store/transactionsSlice.ts:63](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L63) |
