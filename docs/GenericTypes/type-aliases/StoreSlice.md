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

src/types/index.ts:12
