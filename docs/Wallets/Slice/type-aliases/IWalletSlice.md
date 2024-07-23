[Modules](../../../README.md) / [Wallets/Slice](../README.md) / IWalletSlice

> **IWalletSlice**: `object`

## Type declaration

| Name | Type | Defined in |
| ------ | ------ | ------ |
| `activeWallet` | [`Wallet`](../interfaces/Wallet.md) | [src/web3/store/walletSlice.ts:55](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L55) |
| `changeActiveWalletAccount` | (`account`?) => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:68](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L68) |
| `checkAndSwitchNetwork` | (`chainId`?) => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:65](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L65) |
| `checkIsContractWallet` | (`wallet`) => `Promise`\<`boolean`\> | [src/web3/store/walletSlice.ts:79](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L79) |
| `connectWallet` | (`walletType`, `chainId`?) => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:62](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L62) |
| `defaultChainId` | `number` | [src/web3/store/walletSlice.ts:49](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L49) |
| `disconnectActiveWallet` | () => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:63](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L63) |
| `getImpersonatedAddress` | () => `Hex` \| `undefined` | [src/web3/store/walletSlice.ts:76](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L76) |
| `impersonated` | `object` | [src/web3/store/walletSlice.ts:70](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L70) |
| `impersonated.account` | `Account` | [src/web3/store/walletSlice.ts:71](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L71) |
| `impersonated.address` | `Hex` | [src/web3/store/walletSlice.ts:72](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L72) |
| `impersonated.isViewOnly` | `boolean` | [src/web3/store/walletSlice.ts:73](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L73) |
| `initDefaultWallet` | () => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:52](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L52) |
| `isActiveWalletAccountChanging` | `boolean` | [src/web3/store/walletSlice.ts:67](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L67) |
| `isActiveWalletSetting` | `boolean` | [src/web3/store/walletSlice.ts:54](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L54) |
| `isContractWalletRecord` | `Record`\<`string`, `boolean`\> | [src/web3/store/walletSlice.ts:78](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L78) |
| `resetWalletConnectionError` | () => `void` | [src/web3/store/walletSlice.ts:64](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L64) |
| `setActiveWallet` | (`wallet`) => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:56](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L56) |
| `setDefaultChainId` | (`chainId`) => `void` | [src/web3/store/walletSlice.ts:50](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L50) |
| `setImpersonated` | (`privateKeyOrAddress`) => `void` | [src/web3/store/walletSlice.ts:75](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L75) |
| `setWagmiConfig` | (`config`, `withAutoConnect`?) => `Promise`\<`void`\> | [src/web3/store/walletSlice.ts:47](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L47) |
| `wagmiConfig` | `Config` | [src/web3/store/walletSlice.ts:46](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L46) |
| `walletActivating` | `boolean` | [src/web3/store/walletSlice.ts:60](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L60) |
| `walletConnectionError` | `string` | [src/web3/store/walletSlice.ts:61](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L61) |

## Defined in

[src/web3/store/walletSlice.ts:44](https://github.com/bgd-labs/fe-shared/blob/09fc11c58abae5aa2af4d8b6d7c2f384460843a4/src/web3/store/walletSlice.ts#L44)
