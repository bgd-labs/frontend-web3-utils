[Modules](../../../README.md) / [Transactions/Slice](../README.md) / createTransactionsSlice

> **createTransactionsSlice**\<`T`\>(`__namedParameters`): [`StoreSlice`](../../../GenericTypes/type-aliases/StoreSlice.md)\<[`ITransactionsSlice`](../type-aliases/ITransactionsSlice.md)\<`T`\>, `Pick`\<[`IWalletSlice`](../../../Wallets/Slice/type-aliases/IWalletSlice.md), `"checkAndSwitchNetwork"` \| `"activeWallet"`\>\>

Function that creates logic inside the zustand store related to transaction processing.

## Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* [`BaseTx`](../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | `object` |
| `__namedParameters.defaultClients` | [`ClientsRecord`](../../../GenericTypes/type-aliases/ClientsRecord.md) |
| `__namedParameters.txStatusChangedCallback` | (`tx`) => `Promise`\<`void`\> |

## Returns

[`StoreSlice`](../../../GenericTypes/type-aliases/StoreSlice.md)\<[`ITransactionsSlice`](../type-aliases/ITransactionsSlice.md)\<`T`\>, `Pick`\<[`IWalletSlice`](../../../Wallets/Slice/type-aliases/IWalletSlice.md), `"checkAndSwitchNetwork"` \| `"activeWallet"`\>\>

## Defined in

[src/web3/store/transactionsSlice.ts:92](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/transactionsSlice.ts#L92)
