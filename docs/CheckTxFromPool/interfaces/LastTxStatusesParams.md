[Modules](../../README.md) / [CheckTxFromPool](../README.md) / LastTxStatusesParams

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `activeAddress` | \`0x$\{string\}\` | [src/hooks/useLastTxLocalStatus.tsx:15](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L15) |
| `payload` | `T`\[`"payload"`\] | [src/hooks/useLastTxLocalStatus.tsx:17](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L17) |
| `transactionsPool` | [`TransactionPool`](../../Transactions/Slice/type-aliases/TransactionPool.md)\<[`PoolTx`](../../Transactions/Slice/type-aliases/PoolTx.md)\<`T`\>\> | [src/hooks/useLastTxLocalStatus.tsx:14](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L14) |
| `type` | `T`\[`"type"`\] | [src/hooks/useLastTxLocalStatus.tsx:16](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L16) |
