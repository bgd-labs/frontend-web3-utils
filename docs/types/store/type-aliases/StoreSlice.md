[**Default Options Example**](../../../README.md) • **Docs**

***

[Default Options Example](../../../modules.md) / [types/store](../README.md) / StoreSlice

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

[src/types/store.ts:3](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/types/store.ts#L3)
