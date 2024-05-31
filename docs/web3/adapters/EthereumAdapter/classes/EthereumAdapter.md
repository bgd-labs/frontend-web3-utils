[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/adapters/EthereumAdapter](../README.md) / EthereumAdapter

# Class: EthereumAdapter\<T\>

## Type parameters

• **T** *extends* [`BaseTx`](../../types/type-aliases/BaseTx.md)

## Implements

- [`AdapterInterface`](../../types/interfaces/AdapterInterface.md)\<`T`\>

## Constructors

### new EthereumAdapter()

> **new EthereumAdapter**\<`T`\>(`get`, `set`): [`EthereumAdapter`](EthereumAdapter.md)\<`T`\>

#### Parameters

• **get**

• **set**

#### Returns

[`EthereumAdapter`](EthereumAdapter.md)\<`T`\>

#### Source

[src/web3/adapters/EthereumAdapter.ts:32](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L32)

## Properties

### get()

> **get**: () => [`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Returns

[`ITransactionsSliceWithWallet`](../../../store/transactionsSlice/type-aliases/ITransactionsSliceWithWallet.md)\<`T`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`get`](../../types/interfaces/AdapterInterface.md#get)

#### Source

[src/web3/adapters/EthereumAdapter.ts:24](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L24)

***

### set()

> **set**: (`fn`) => `void`

#### Parameters

• **fn**

#### Returns

`void`

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`set`](../../types/interfaces/AdapterInterface.md#set)

#### Source

[src/web3/adapters/EthereumAdapter.ts:25](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L25)

***

### transactionsIntervalsMap

> **transactionsIntervalsMap**: `Record`\<`string`, `number`\> = `{}`

#### Source

[src/web3/adapters/EthereumAdapter.ts:30](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L30)

## Methods

### startTxTracking()

> **startTxTracking**(`tx`): `Promise`\<`void`\>

#### Parameters

• **tx**: [`PoolTx`](../../../store/transactionsSlice/type-aliases/PoolTx.md)\<`T`\>

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`AdapterInterface`](../../types/interfaces/AdapterInterface.md).[`startTxTracking`](../../types/interfaces/AdapterInterface.md#starttxtracking)

#### Source

[src/web3/adapters/EthereumAdapter.ts:44](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L44)

***

### updateTXStatus()

> `private` **updateTXStatus**(`txKey`, `params`): `void`

#### Parameters

• **txKey**: \`0x$\{string\}\`

• **params**

• **params.nonce?**: `number`

• **params.replacedTxHash?**: \`0x$\{string\}\`

• **params.status?**: [`TransactionStatus`](../../types/enumerations/TransactionStatus.md)

• **params.to?**: \`0x$\{string\}\`

#### Returns

`void`

#### Source

[src/web3/adapters/EthereumAdapter.ts:122](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L122)

***

### waitForTxReceipt()

> **waitForTxReceipt**(`txHash`, `txNonce`?): `Promise`\<`void`\>

#### Parameters

• **txHash**: \`0x$\{string\}\`

• **txNonce?**: `number`

#### Returns

`Promise`\<`void`\>

#### Source

[src/web3/adapters/EthereumAdapter.ts:75](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/adapters/EthereumAdapter.ts#L75)
