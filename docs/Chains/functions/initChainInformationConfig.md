[Modules](../../README.md) / [Chains](../README.md) / initChainInformationConfig

> **initChainInformationConfig**(`chains`?): `object`

Function for creating a single clients instance with chain parameters.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `chains`? | `Record`\<`number`, `Chain`\> |

## Returns

`object`

| Member | Type |
| :------ | :------ |
| `clientInstances` | `object` |
| `getChainParameters` | (`chainId`) => `Chain` |

## Source

[src/utils/chainInfoHelpers.ts:44](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/utils/chainInfoHelpers.ts#L44)
