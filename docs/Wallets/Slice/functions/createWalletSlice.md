[Modules](../../../README.md) / [Wallets/Slice](../README.md) / createWalletSlice

> **createWalletSlice**(`__namedParameters`): [`StoreSlice`](../../../GenericTypes/type-aliases/StoreSlice.md)\<[`IWalletSlice`](../type-aliases/IWalletSlice.md), [`TransactionsSliceBaseType`](../../../Transactions/Slice/type-aliases/TransactionsSliceBaseType.md)\>

Function that creates logic inside the zustand store related to interaction with the wallet.

## Parameters

| Parameter | Type |
| :------ | :------ |
| `__namedParameters` | `object` |
| `__namedParameters.walletConnected` | (`wallet`) => `void` |

## Returns

[`StoreSlice`](../../../GenericTypes/type-aliases/StoreSlice.md)\<[`IWalletSlice`](../type-aliases/IWalletSlice.md), [`TransactionsSliceBaseType`](../../../Transactions/Slice/type-aliases/TransactionsSliceBaseType.md)\>

## Source

[src/web3/store/walletSlice.ts:87](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/store/walletSlice.ts#L87)
