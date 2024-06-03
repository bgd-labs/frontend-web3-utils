[Modules](../../../README.md) / [TransactionAdapters/GelatoAdapter](../README.md) / GelatoTaskStatusResponse

> **GelatoTaskStatusResponse**: `object`

## Type declaration

| Member | Type |
| :------ | :------ |
| `task` | `object` |
| `task.blockNumber` | `number` |
| `task.chainId` | `number` |
| `task.creationDate` | `string` |
| `task.executionDate` | `string` |
| `task.lastCheckMessage` | `string` |
| `task.taskId` | `string` |
| `task.taskState` | [`GelatoTaskState`](../enumerations/GelatoTaskState.md) |
| `task.transactionHash` | `Hex` |

## Source

[src/web3/adapters/GelatoAdapter.ts:27](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/adapters/GelatoAdapter.ts#L27)
