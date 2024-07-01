[Modules](../../README.md) / [CheckTxFromPool](../README.md) / TxLocalStatus

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type |
| :------ | :------ |
| `error` | `string` |
| `executeTxWithLocalStatuses` | (`params`: [`ExecuteTxWithLocalStatusesParams`](../type-aliases/ExecuteTxWithLocalStatusesParams.md)) => `Promise`\<`void`\> |
| `fullTxErrorMessage` | `string` |
| `isTxStart` | `boolean` |
| `loading` | `boolean` |
| `setError` | (`value`: `string`) => `void` |
| `setFullTxErrorMessage` | (`value`: `string`) => `void` |
| `setIsTxStart` | (`value`: `boolean`) => `void` |
| `setLoading` | (`value`: `boolean`) => `void` |
| `tx` | [`TxLocalStatusTxParams`](../type-aliases/TxLocalStatusTxParams.md)\<`T`\> |
