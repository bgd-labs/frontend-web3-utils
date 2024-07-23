[Modules](../../README.md) / [CheckTxFromPool](../README.md) / TxLocalStatus

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Properties

| Property | Type | Defined in |
| ------ | ------ | ------ |
| `error` | `string` | [src/hooks/useLastTxLocalStatus.tsx:38](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L38) |
| `executeTxWithLocalStatuses` | (`params`: [`ExecuteTxWithLocalStatusesParams`](../type-aliases/ExecuteTxWithLocalStatusesParams.md)) => `Promise`\<`void`\> | [src/hooks/useLastTxLocalStatus.tsx:40](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L40) |
| `fullTxErrorMessage` | `string` | [src/hooks/useLastTxLocalStatus.tsx:36](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L36) |
| `isTxStart` | `boolean` | [src/hooks/useLastTxLocalStatus.tsx:32](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L32) |
| `loading` | `boolean` | [src/hooks/useLastTxLocalStatus.tsx:34](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L34) |
| `setError` | (`value`: `string`) => `void` | [src/hooks/useLastTxLocalStatus.tsx:39](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L39) |
| `setFullTxErrorMessage` | (`value`: `string`) => `void` | [src/hooks/useLastTxLocalStatus.tsx:37](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L37) |
| `setIsTxStart` | (`value`: `boolean`) => `void` | [src/hooks/useLastTxLocalStatus.tsx:33](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L33) |
| `setLoading` | (`value`: `boolean`) => `void` | [src/hooks/useLastTxLocalStatus.tsx:35](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L35) |
| `tx` | [`TxLocalStatusTxParams`](../type-aliases/TxLocalStatusTxParams.md)\<`T`\> | [src/hooks/useLastTxLocalStatus.tsx:43](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/hooks/useLastTxLocalStatus.tsx#L43) |
