[**Default Options Example**](../../../../README.md) • **Docs**

***

[Default Options Example](../../../../modules.md) / [web3/store/walletSlice](../README.md) / IWalletSlice

# Type alias: IWalletSlice

> **IWalletSlice**: `object`

## Type declaration

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](../interfaces/Wallet.md)

### changeActiveWalletAccount()

> **changeActiveWalletAccount**: (`account`?) => `Promise`\<`void`\>

#### Parameters

• **account?**: `GetAccountReturnType`

#### Returns

`Promise`\<`void`\>

### checkAndSwitchNetwork()

> **checkAndSwitchNetwork**: (`chainId`?) => `Promise`\<`void`\>

#### Parameters

• **chainId?**: `number`

#### Returns

`Promise`\<`void`\>

### checkIsContractWallet()

> **checkIsContractWallet**: (`wallet`) => `Promise`\<`boolean`\>

#### Parameters

• **wallet**: `Omit`\<[`Wallet`](../interfaces/Wallet.md), `"walletClient"`\>

#### Returns

`Promise`\<`boolean`\>

### connectWallet()

> **connectWallet**: (`walletType`, `chainId`?) => `Promise`\<`void`\>

#### Parameters

• **walletType**: [`WalletType`](../../../connectors/enumerations/WalletType.md)

• **chainId?**: `number`

#### Returns

`Promise`\<`void`\>

### defaultChainId?

> `optional` **defaultChainId**: `number`

### disconnectActiveWallet()

> **disconnectActiveWallet**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### getImpersonatedAddress()

> **getImpersonatedAddress**: () => `Hex` \| `undefined`

#### Returns

`Hex` \| `undefined`

### impersonated?

> `optional` **impersonated**: `object`

### impersonated.account?

> `optional` **account**: `Account`

### impersonated.address?

> `optional` **address**: `Hex`

### impersonated.isViewOnly?

> `optional` **isViewOnly**: `boolean`

### initDefaultWallet()

> **initDefaultWallet**: () => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>

### isActiveWalletAccountChanging

> **isActiveWalletAccountChanging**: `boolean`

### isActiveWalletSetting

> **isActiveWalletSetting**: `boolean`

### isContractWalletRecord

> **isContractWalletRecord**: `Record`\<`string`, `boolean`\>

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

#### Returns

`void`

### setActiveWallet()

> **setActiveWallet**: (`wallet`) => `Promise`\<`void`\>

#### Parameters

• **wallet**: `Omit`\<[`Wallet`](../interfaces/Wallet.md), `"publicClient"` \| `"walletClient"`\>

#### Returns

`Promise`\<`void`\>

### setDefaultChainId()

> **setDefaultChainId**: (`chainId`) => `void`

#### Parameters

• **chainId**: `number`

#### Returns

`void`

### setImpersonated()

> **setImpersonated**: (`privateKeyOrAddress`) => `void`

#### Parameters

• **privateKeyOrAddress**: `string`

#### Returns

`void`

### setWagmiConfig()

> **setWagmiConfig**: (`config`, `withAutoConnect`?) => `Promise`\<`void`\>

#### Parameters

• **config**: `Config`

• **withAutoConnect?**: `boolean`

#### Returns

`Promise`\<`void`\>

### wagmiConfig?

> `optional` **wagmiConfig**: `Config`

### walletActivating

> **walletActivating**: `boolean`

### walletConnectionError

> **walletConnectionError**: `string`

## Source

[src/web3/store/walletSlice.ts:39](https://github.com/bgd-labs/fe-shared/blob/022d31eeb7e61eeffe2ddf65992458f822122ffc/src/web3/store/walletSlice.ts#L39)
