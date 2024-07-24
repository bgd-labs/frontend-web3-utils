[Modules](../../../README.md) / [Transactions/Slice](../README.md) / ITransactionsState

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `adapters` | `object` | [src/web3/store/transactionsSlice.ts:48](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L48) |
| `adapters.ethereum` | [`EthereumAdapter`](../../../TransactionAdapters/EthereumAdapter/classes/EthereumAdapter.md)\<`T`\> | [src/web3/store/transactionsSlice.ts:49](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L49) |
| `adapters.gelato?` | [`GelatoAdapter`](../../../TransactionAdapters/GelatoAdapter/classes/GelatoAdapter.md)\<`T`\> | [src/web3/store/transactionsSlice.ts:51](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L51) |
| `adapters.safe?` | [`SafeAdapter`](../../../TransactionAdapters/SafeAdapter/classes/SafeAdapter.md)\<`T`\> | [src/web3/store/transactionsSlice.ts:50](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L50) |
| `checkIsGelatoAvailable` | (`chainId`: `number`) => `Promise`\<`void`\> | [src/web3/store/transactionsSlice.ts:59](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L59) |
| `isGelatoAvailable` | `boolean` | [src/web3/store/transactionsSlice.ts:58](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L58) |
| `setAdapter` | (`adapter`: [`TxAdapter`](../../../TransactionAdapters/types/enumerations/TxAdapter.md)) => `void` | [src/web3/store/transactionsSlice.ts:53](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L53) |
| `transactionsIntervalsMap` | `Record`\<`string`, `number`\> | [src/web3/store/transactionsSlice.ts:56](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L56) |
| `transactionsPool` | [`TransactionPool`](../type-aliases/TransactionPool.md)\<[`PoolTx`](../type-aliases/PoolTx.md)\<`T`\>\> | [src/web3/store/transactionsSlice.ts:55](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L55) |
