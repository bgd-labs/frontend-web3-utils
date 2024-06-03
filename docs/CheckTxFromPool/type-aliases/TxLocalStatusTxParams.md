[Modules](../../README.md) / [CheckTxFromPool](../README.md) / TxLocalStatusTxParams

> **TxLocalStatusTxParams**\<`T`\>: [`PoolTx`](../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\> & `object`

## Type declaration

| Member | Type |
| :------ | :------ |
| `isError` | `boolean` |
| `isReplaced` | `boolean` |
| `isSuccess` | `boolean` |

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Source

[src/hooks/useLastTxLocalStatus.tsx:25](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/hooks/useLastTxLocalStatus.tsx#L25)
