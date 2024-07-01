[Modules](../../README.md) / [GenericTypes](../README.md) / StoreSlice

> **StoreSlice**\<`T`, `E`\>: (`set`, `get`) => `T`

## Type parameters

| Type parameter | Value |
| :------ | :------ |
| `T` *extends* `object` | - |
| `E` *extends* `object` | `T` |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `set` | `StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"setState"`\] |
| `get` | `StoreApi`\<`E` *extends* `T` ? `E` : `E` & `T`\>\[`"getState"`\] |

## Returns

`T`

## Source

[src/types/index.ts:12](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/types/index.ts#L12)
