[Modules](../../../README.md) / [Providers/WagmiZustandSync](../README.md) / WagmiZustandSyncProps

## Properties

| Property | Type |
| :------ | :------ |
| `defaultChainId?` | `number` |
| `store` | `object` |
| `store.changeActiveWalletAccount` | (`account`?: `GetAccountReturnType`) => `Promise`\<`void`\> |
| `store.setDefaultChainId` | (`chainId`: `number`) => `void` |
| `store.setWagmiConfig` | (`config`: `Config`, `withAutoConnect`?: `boolean`) => `Promise`\<`void`\> |
| `wagmiConfig` | `Config` |
| `withAutoConnect?` | `boolean` |
