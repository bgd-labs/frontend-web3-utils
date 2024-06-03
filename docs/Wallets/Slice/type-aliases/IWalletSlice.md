[Modules](../../../README.md) / [Wallets/Slice](../README.md) / IWalletSlice

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

[src/web3/store/walletSlice.ts:44](https://github.com/bgd-labs/fe-shared/blob/9fba57060d0d09d18d0564e6f8921c7206d93e88/src/web3/store/walletSlice.ts#L44)
