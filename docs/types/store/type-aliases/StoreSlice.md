[**Library functions**](../../../README.md) • **Docs**

***

[Library functions](../../../modules.md) / [types/store](../README.md) / StoreSlice

# Type alias: StoreSlice()\<T, E\>

> **StoreSlice**\<`T`, `E`\>: (`set`, `get`) => `T`

## Type parameters

• **T** *extends* `object`

• **E** *extends* `object` = `T`

## Parameters

• **set**: `StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"setState"`\]

• **get**: `StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"getState"`\]

## Returns

`T`

## Source

[src/types/store.ts:3](https://github.com/bgd-labs/fe-shared/blob/bcb81f075c57b42adfeb5f3e6c387d13f532f431/src/types/store.ts#L3)
