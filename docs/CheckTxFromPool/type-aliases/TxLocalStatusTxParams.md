[Modules](../../README.md) / [CheckTxFromPool](../README.md) / TxLocalStatusTxParams

> **TxLocalStatusTxParams**\<`T`\>: [`PoolTx`](../../web3/store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\> & `object`

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

[src/hooks/useLastTxLocalStatus.tsx:25](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/hooks/useLastTxLocalStatus.tsx#L25)
