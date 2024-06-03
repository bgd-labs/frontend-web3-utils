[Modules](../../../../README.md) / [web3/store/walletSlice](../README.md) / IWalletSlice

> **IWalletSlice**: `object`

## Type declaration

| Member | Type |
| :------ | :------ |
| `activeWallet` | [`Wallet`](../interfaces/Wallet.md) |
| `changeActiveWalletAccount` | (`account`?) => `Promise`\<`void`\> |
| `checkAndSwitchNetwork` | (`chainId`?) => `Promise`\<`void`\> |
| `checkIsContractWallet` | (`wallet`) => `Promise`\<`boolean`\> |
| `connectWallet` | (`walletType`, `chainId`?) => `Promise`\<`void`\> |
| `defaultChainId` | `number` |
| `disconnectActiveWallet` | () => `Promise`\<`void`\> |
| `getImpersonatedAddress` | () => `Hex` \| `undefined` |
| `impersonated` | `object` |
| `impersonated.account` | `Account` |
| `impersonated.address` | `Hex` |
| `impersonated.isViewOnly` | `boolean` |
| `initDefaultWallet` | () => `Promise`\<`void`\> |
| `isActiveWalletAccountChanging` | `boolean` |
| `isActiveWalletSetting` | `boolean` |
| `isContractWalletRecord` | `Record`\<`string`, `boolean`\> |
| `resetWalletConnectionError` | () => `void` |
| `setActiveWallet` | (`wallet`) => `Promise`\<`void`\> |
| `setDefaultChainId` | (`chainId`) => `void` |
| `setImpersonated` | (`privateKeyOrAddress`) => `void` |
| `setWagmiConfig` | (`config`, `withAutoConnect`?) => `Promise`\<`void`\> |
| `wagmiConfig` | `Config` |
| `walletActivating` | `boolean` |
| `walletConnectionError` | `string` |

## Source

[src/web3/store/walletSlice.ts:39](https://github.com/bgd-labs/fe-shared/blob/a524aad33ec5fce600306d3c3d02439e9803dea0/src/web3/store/walletSlice.ts#L39)
