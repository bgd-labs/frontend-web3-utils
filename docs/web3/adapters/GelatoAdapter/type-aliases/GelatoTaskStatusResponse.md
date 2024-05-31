[**Library functions**](../../../../README.md) • **Docs**

***

[Library functions](../../../../modules.md) / [web3/adapters/GelatoAdapter](../README.md) / GelatoTaskStatusResponse

# Type alias: GelatoTaskStatusResponse

> **GelatoTaskStatusResponse**: `object`

## Type declaration

### task

> **task**: `object`

### task.blockNumber?

> `optional` **blockNumber**: `number`

### task.chainId

> **chainId**: `number`

### task.creationDate?

> `optional` **creationDate**: `string`

### task.executionDate?

> `optional` **executionDate**: `string`

### task.lastCheckMessage?

> `optional` **lastCheckMessage**: `string`

### task.taskId

> **taskId**: `string`

### task.taskState

> **taskState**: [`GelatoTaskState`](../enumerations/GelatoTaskState.md)

### task.transactionHash?

> `optional` **transactionHash**: `Hex`

## Source

[src/web3/adapters/GelatoAdapter.ts:22](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/web3/adapters/GelatoAdapter.ts#L22)
