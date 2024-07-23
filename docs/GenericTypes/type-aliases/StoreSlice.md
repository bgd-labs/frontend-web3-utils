[Modules](../../README.md) / [GenericTypes](../README.md) / StoreSlice

> **StoreSlice**\<`T`, `E`\>: (`set`, `get`) => `T`

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `object` | - |
| `E` *extends* `object` | `T` |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `set` | `StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"setState"`\] |
| `get` | `StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"getState"`\] |

## Returns

`T`

## Defined in

[src/types/index.ts:12](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/types/index.ts#L12)
