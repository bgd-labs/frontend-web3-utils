[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/store/transactionsSlice](../README.md) / createTransactionsSlice

# Function: createTransactionsSlice()

> **createTransactionsSlice**\<`T`\>(`__namedParameters`): [`StoreSlice`](../../../../types/store/type-aliases/StoreSlice.md)\<[`ITransactionsSlice`](../type-aliases/ITransactionsSlice.md)\<`T`\>, `Pick`\<[`IWalletSlice`](../../walletSlice/type-aliases/IWalletSlice.md), `"checkAndSwitchNetwork"` \| `"activeWallet"`\>\>

## Type parameters

• **T** *extends* [`BaseTx`](../../../adapters/types/type-aliases/BaseTx.md)

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.defaultClients**: [`ClientsRecord`](../../../../types/base/type-aliases/ClientsRecord.md)

• **\_\_namedParameters.txStatusChangedCallback**

## Returns

[`StoreSlice`](../../../../types/store/type-aliases/StoreSlice.md)\<[`ITransactionsSlice`](../type-aliases/ITransactionsSlice.md)\<`T`\>, `Pick`\<[`IWalletSlice`](../../walletSlice/type-aliases/IWalletSlice.md), `"checkAndSwitchNetwork"` \| `"activeWallet"`\>\>

## Source

[src/web3/store/transactionsSlice.ts:85](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/transactionsSlice.ts#L85)
