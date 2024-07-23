[Modules](../../README.md) / [Chains](../README.md) / initChainInformationConfig

> **initChainInformationConfig**(`chains`?): `object`

Function for creating a single clients instance with chain parameters.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `chains`? | `Record`\<`number`, `Chain`\> |

## Returns

`object`

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `clientInstances` | `object` | [src/utils/chainInfoHelpers.ts:92](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/utils/chainInfoHelpers.ts#L92) |
| `getChainParameters` | (`chainId`) => `Chain` | [src/utils/chainInfoHelpers.ts:93](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/utils/chainInfoHelpers.ts#L93) |

## Defined in

[src/utils/chainInfoHelpers.ts:44](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/utils/chainInfoHelpers.ts#L44)
