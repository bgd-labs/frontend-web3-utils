# Frontend Web3 Shared repo

The purpose of this repo is to have shared solutions for typical web3 related problems.

Transactions, signing, clients etc

### Limitations

This is not a 1 size fit all library and more like a set of recipes to be used across multiple BGD projects. 
All solutions heavily rely on BGD tech stack, such as [viem.sh](https://viem.sh/), [zustand](https://github.com/pmndrs/zustand), [wagmi.sh](https://wagmi.sh/).
Outside this stack using BGD solutions will be a problem and repo is provided as is. Feel free to use it as example

Although it is possible to use `TransactionsSlice` separately from `WalletSlice`, but it is unrealistic scenario.

### Requirements

Each solution should provide a complete flow with clear boundaries and entry point for custom logic

### Installation

#### npm
<code>npm i @bgd-labs/frontend-web3-utils</code>

#### yarn
<code>yarn add @bgd-labs/frontend-web3-utils</code>

----

## TransactionsSlice

Is used as a “black box” to work with transactions life cycle in a DAPP. 
It will add, wait, save them to `localstorage` and do all the necessary logic to check for a network status and updates

*Transaction observer flow*

First we need to define callbackObserver - the component which will be called after tx got broadcast into a blockchain, like so:

```tsx
 ...createTransactionsSlice<TransactionsUnion>({
    txStatusChangedCallback: (tx) => {
      switch (tx.type) {
        case "somethingNotVeryImportantHappened":
          console.log(tx.payload.buzz);
          return;
        case "somethingImportantHappened":
          console.log(tx.payload.fuzz);
          return;
      }
    },
  })(set, get)
```

`TransactionUnion`  will be different for each application and is used to associate payload type by transaction type

and `clients: Record<number, PublicClient>;`

Clients will be used to watch tx on multiple chains if needed.

To make it all work, each tx should go through `.executeTx`  callback. It’s fire and forget flow at the end `callbackObserver` 
will fire tx with type ‘wear’, custom payload and all the data from transaction.

```tsx
const tx = await get().executeTx({
      body: () => {
        return get().boredNFTService.wear(tokenID, {
          location: collectionAddress,
          id: svgId,
        });
      },
      params: {
        type: 'wear',
        payload: { tokenID, collectionAddress },
      },
    });
```

## WalletSlice

WalletSlice is a set of ready solutions to work with [wagmi.sh](https://wagmi.sh/)

It will do appropriate logic to handle different connectors type and save the required states to zustand store

Since we write data directly to our store, we needed our custom component to sync wagmi config with zustand store. `<WagmiZustandSync />` is required to make `WalletSlice` work.

Example of how to use `<WagmiZustandSync />` in your own app

`yourapp/WagmiProvider.tsx` →
```tsx
import {
  createWagmiConfig,
  WagmiZustandSync,
} from '@bgd-labs/frontend-web3-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { WagmiProvider } from 'wagmi';

import { CHAINS } from '../../utils/chains';
import { DESIRED_CHAIN_ID } from '../../utils/constants';

const queryClient = new QueryClient();

export default function WagmiConfigProviderWrapper() {
  const config = useMemo(() => {
    return createWagmiConfig({
      chains: CHAINS,
      connectorsInitProps: {
        appName: 'YourAppName',
        defaultChainId: DESIRED_CHAIN_ID,
        wcParams: {
          projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || '',
          metadata: {
            name: 'wagmi',
            description: 'my wagmi app',
            url: 'https://wagmi.sh',
            icons: ['https://wagmi.sh/icon.png'],
          },
        },
      },
    });
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiZustandSync
          wagmiConfig={config}
          defaultChainId={DESIRED_CHAIN_ID}
          useStore={useStore}
        />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

`yourapp/App.tsx`  →

```tsx
import WagmiProvider from '../src/web3/components/WagmiProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <WagmiProvider />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

```

Once the setup is done you can finally initialize web3Slice

```tsx
export const createWeb3Slice: StoreSlice<IWeb3Slice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
  })(set, get),
});
```

`walletConnected` is a callback which will be executed once wallet is connected, meaning get().activeWallet is set.

All the logic is going **through** store and **NOT** through wagmi.sh hooks

-------

After preparing the slices, you need to initialize the app zustand store
```tsx
import { create, StoreApi } from 'zustand';
import { devtools } from 'zustand/middleware';

import {
  createTransactionsSlice,
  TransactionsSlice,
} from '../transactions/store/transactionsSlice';
import { createWeb3Slice, IWeb3Slice } from '../web3/store/web3Slice';

type RootState = IWeb3Slice & TransactionsSlice;

const createRootSlice = (
  set: StoreApi<RootState>['setState'],
  get: StoreApi<RootState>['getState'],
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
});

export const useStore = create(devtools(createRootSlice, { serialize: true }));
```

----

After all the init steps are done, you can finally use everything you need to interact with web3

Wallet connection example:
```tsx
import { WalletType } from '@bgd-labs/frontend-web3-utils';

import { useStore } from '../../store';

export function WalletItem({ walletType }: { walletType: WalletType }) {
  const { activeWallet, connectWallet, disconnectActiveWallet } = useStore();

  const isActive = useMemo(() => {
    return activeWallet?.walletType === walletType;
  }, [walletType, activeWallet]);

  const handleWalletClick = async () => {
    if (isActive) {
      await disconnectActiveWallet();
    } else {
      await connectWallet(walletType);
    }
  };

  return (
    <button onClick={handleWalletClick}>
      {isActive ? 'Disconnect' : 'Connect'} wallet {walletType}
    </button>
  );
}
```

You can find an example of what a React application using this library should look like, here: [example repo](https://github.com/bgd-labs/fe-shared-examples/tree/main/front-end)