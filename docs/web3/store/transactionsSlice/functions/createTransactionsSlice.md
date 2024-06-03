[Modules](../../../../README.md) / [web3/store/transactionsSlice](../README.md) / createTransactionsSlice

> **createTransactionsSlice**\<`T`\>(`__namedParameters`): [`StoreSlice`](../../../../GenericTypes/type-aliases/StoreSlice.md)\<[`ITransactionsSlice`](../type-aliases/ITransactionsSlice.md)\<`T`\>, `Pick`\<[`IWalletSlice`](../../walletSlice/type-aliases/IWalletSlice.md), `"checkAndSwitchNetwork"` \| `"activeWallet"`\>\>

## Type parameters

| Type parameter |
| :------ |
| `T` *extends* [`BaseTx`](../../../../TransactionAdapters/types/type-aliases/BaseTx.md) |

## Parameters

| Parameter | Type |
| :------ | :------ |
| `__namedParameters` | `object` |
| `__namedParameters.defaultClients` | [`ClientsRecord`](../../../../GenericTypes/type-aliases/ClientsRecord.md) |
| `__namedParameters.txStatusChangedCallback` | (`tx`) => `Promise`\<`void`\> |

## Returns

[`StoreSlice`](../../../../GenericTypes/type-aliases/StoreSlice.md)\<[`ITransactionsSlice`](../type-aliases/ITransactionsSlice.md)\<`T`\>, `Pick`\<[`IWalletSlice`](../../walletSlice/type-aliases/IWalletSlice.md), `"checkAndSwitchNetwork"` \| `"activeWallet"`\>\>

## Source

[src/web3/store/transactionsSlice.ts:84](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/store/transactionsSlice.ts#L84)
