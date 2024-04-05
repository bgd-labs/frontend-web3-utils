# Frontend web3 utilities from [BGD labs](https://github.com/bgd-labs/).

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
import {
  type BaseTx as BT,
  createTransactionsSlice as createBaseTransactionsSlice,
  type ITransactionsSlice,
  type IWalletSlice,
  type StoreSlice,
  type TransactionStatus,
  type WalletType,
} from "@bgd-labs/frontend-web3-utils";
import { type Hex } from "viem";

export enum TxType {
  test = "test",
}

type BaseTx = BT & {
  status?: TransactionStatus;
  pending: boolean;
  walletType: WalletType;
};

type TestTX = BaseTx & {
  type: TxType.test;
  payload: NonNullable<unknown>;
};

export type TransactionUnion = TxType.test;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion>;

export type TxWithStatus = TransactionUnion & {
  status?: TransactionStatus;
  pending: boolean;
  replacedTxHash?: Hex;
};

export type AllTransactions = TxWithStatus[];

export const createTransactionsSlice: StoreSlice<
  TransactionsSlice,
  IWeb3Slice & IWalletSlice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async (data: TransactionUnion) => {
      switch (data.type) {
        case TxType.test:
          console.log('action after tx executed')
          break;
      }
    },
    defaultClients: {},
  })(set, get),
});

```

`TransactionUnion`  will be different for each application and is used to associate payload type by transaction type

and `defaultClients: Record<number, Client>;`

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
"use client";

import {
  createWagmiConfig,
  WagmiZustandSync,
} from "@bgd-labs/frontend-web3-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { mainnet } from "viem/chains";
import { WagmiProvider as BaseWagmiProvider } from "wagmi";

import { useStore } from "zustand";

const queryClient = new QueryClient();

export function WagmiProvider() {
  const setWagmiConfig = useStore((store) => store.setWagmiConfig);
  const setDefaultChainId = useStore((store) => store.setDefaultChainId);
  const changeActiveWalletAccount = useStore(
    (store) => store.changeActiveWalletAccount,
  );

  const setWagmiProviderInitialize = useStore(
    (store) => store.setWagmiProviderInitialize,
  );
  useEffect(() => {
    setWagmiProviderInitialize(true);
  }, []);

  const config = useMemo(() => {
    return createWagmiConfig({
      chains: { [mainnet.id]: mainnet },
      connectorsInitProps: {
        appName: "AppBoilerplate",
        defaultChainId: mainnet.id,
        wcParams: {
          projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? "",
          metadata: {
            name: "wagmi",
            description: "my wagmi app",
            url: "https://wagmi.sh",
            icons: ["https://wagmi.sh/icon.png"],
          },
        },
      },
    });
  }, []);

  return (
    <BaseWagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WagmiZustandSync
          withAutoConnect={true}
          wagmiConfig={config}
          defaultChainId={mainnet.id}
          store={{
            setWagmiConfig,
            setDefaultChainId,
            changeActiveWalletAccount,
          }}
        />
      </QueryClientProvider>
    </BaseWagmiProvider>
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
import {
  createWalletSlice,
  initChainInformationConfig,
  type IWalletSlice,
  type StoreSlice,
} from "@bgd-labs/frontend-web3-utils";
import { produce } from "immer";
import { sepolia } from "viem/chains";

import { type TransactionsSlice } from "@/store/transactionsSlice";

/**
 * web3Slice is required only to have a better control over providers state i.e
 * change provider, trigger data refetch if provider changed and have globally available instances of rpcs and data providers
 */

export type IWeb3Slice = IWalletSlice & {
  wagmiProviderInitialize: boolean;
  setWagmiProviderInitialize: (value: boolean) => void;

  // need for connect wallet button to not show last tx status always after connected wallet (if we want to do tx loader on wallet connect button)
  walletConnectedTimeLock: boolean;
  connectSigner: () => void;

  // tx's services
};

export const createWeb3Slice: StoreSlice<IWeb3Slice, TransactionsSlice> = (
  set,
  get,
) => ({
  ...createWalletSlice({
    walletConnected: () => {
      get().connectSigner();
    },
  })(set, get),

  wagmiProviderInitialize: false,
  setWagmiProviderInitialize: (value) => {
    set((state) =>
      // !!! important, should be produce from immer, and we need to set value to zustand store when app initialize to work properly with wagmi
      produce(state, (draft) => {
        draft.wagmiProviderInitialize = value;
      }),
    );
  },

  walletConnectedTimeLock: false,
  connectSigner() {
    const config = get().wagmiConfig;
    set({ walletConnectedTimeLock: true });
    if (config) {
      get().counterDataService.connectSigner(config);
    }
    setTimeout(() => set({ walletConnectedTimeLock: false }), 1000);
  },

  // tx's services
  ...
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