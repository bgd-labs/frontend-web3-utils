# Frontend web3 utilities from [BGD labs](https://github.com/bgd-labs/).

The purpose of this repo is to have shared solutions for typical web3 related problems.

Here we provide solutions for:
1) Connecting the wallet using `wagmi` connectors that are saved in the `zustand` store for ease of interaction.
2) Execution and tracking of transactions from `zustand` store using wagmi core and connected wagmi client.
3) Helper functions for creating `viem` clients.

### Limitations

This is not a 1 size fit all library and more like a set of recipes to be used across multiple BGD projects. 
All solutions heavily rely on BGD tech stack, such as [viem.sh](https://viem.sh/), [zustand](https://github.com/pmndrs/zustand), [wagmi.sh](https://wagmi.sh/).
Outside this stack using BGD solutions will be a problem and repo is provided as is.

### Requirements

Each solution should provide a complete flow with clear boundaries and entry point for custom logic.

### Docs

[Here](./docs/README.md) you can look at the modules that are in the library.

### Installation

#### npm
<code>npm i @bgd-labs/frontend-web3-utils</code>

#### yarn
<code>yarn add @bgd-labs/frontend-web3-utils</code>

#### pnpm
<code>pnpm add @bgd-labs/frontend-web3-utils</code>

-----------------

## How to set up

To set everything up correctly, you must follow this steps:

### 1) Create chains and clients instances (appConfig).

This need for wallet slice and transaction slice.

`-> @/appConfig.ts`
```ts
import {
  type ClientsRecord,
  initChainInformationConfig,
} from "@bgd-labs/frontend-web3-utils";
import { type Chain } from "viem";
import { mainnet } from "viem/chains";

export const CHAINS: Record<number, Chain> = {
  [mainnet.id]: mainnet,
};

export const DESIRED_CHAIN_ID = mainnet.id;
export const chainInfoHelpers = initChainInformationConfig(CHAINS);

export const clients: ClientsRecord = Object.entries(chainInfoHelpers.clientInstances).forEach(
  (value) => (clients[Number(value[0])] = value[1].instance),
);
```
--------
### 2) Create a service for interaction with a smart contract.

There will be logic for interaction with contract transactions, and you can also add “get” requests to contracts here.

Each service should have some sort of `connectSigner` method. If you want to sign data.

`-> @/web3Services/exampleService.ts`
```ts
import { writeContract } from '@wagmi/core';
import { Client, encodeFunctionData, getContract, Address} from 'viem';
import { Config } from 'wagmi';

import { _abi as ExampleAbi } from '@/abis/ExampleAbi';

export type ExampleTxParams = {
  walletAddress: Address;
};

export class ExampleService {
  private exampleContract;
  private wagmiConfig: Config | undefined = undefined;
  
  constructor(client: Client) {
    this.testContract = getContract({
      address: contract_address,
      abi: ExampleAbi,
      client: client,
    });
  }

  public connectSigner(wagmiConfig: Config) {
    this.wagmiConfig = wagmiConfig;
  }

  async exampleTx({ walletAddress }: ExampleTxParams) {
    if (this.wagmiConfig) {
      return writeContract(this.wagmiConfig, {
        address: contract_address,
        abi: ExampleAbi,
        functionName: 'example',
        args: [walletAddress],
      });
    } else {
      throw new Error('Connect wallet before process transaction.');
    }
  }
}
```
-------
### 3) Create your own transaction slice in your app, base on library slice.
`TransactionSlice` will take care of:
- switching networks before tx execution.
- add, wait, save; transactions data to `localStorage`.
- do all the necessary logic to check for a "onchain" status and updates.
- calling `txStatusChangedCallback` properly typed with all the `payload` data.

`-> @/store/transactionsSlice.ts`
```ts
import {
  type BaseTx as BT,
  createTransactionsSlice as createBaseTransactionsSlice,
  type ITransactionsSlice,
  type IWalletSlice,
  type TransactionStatus,
  type WalletType,
  type StoreSlice,
} from "@bgd-labs/frontend-web3-utils";
import { type Hex } from "viem";

import { clients } from "@/appConfig";
import { ExampleTxParams } from "@/web3Services/exampleService";

export enum TxType {
  example = "example",
}

type BaseTx = BT & {
  status?: TransactionStatus;
  pending: boolean;
  walletType: WalletType;
};

type ExampleTX = BaseTx & {
  type: TxType.example;
  payload: ExampleTxParams;
};

export type TransactionUnion = ExampleTX;

export type TransactionsSlice = ITransactionsSlice<TransactionUnion>;

export type TxWithStatus = TransactionUnion & {
  status?: TransactionStatus;
  pending: boolean;
  replacedTxHash?: Hex;
};

export type AllTransactions = TxWithStatus[];

export const createTransactionsSlice: StoreSlice<
  TransactionsSlice, IWalletSlice
> = (set, get) => ({
  ...createBaseTransactionsSlice<TransactionUnion>({
    txStatusChangedCallback: async (data: TransactionUnion) => {
      switch (data.type) {
        case TxType.example:
          console.log('action when example tx executed')
          break;
        default:
          console.log('default action when tx executed')
          break;
      }
    },
    defaultClients: clients,
  })(set, get),
});
```

`TransactionUnion` will be different for each application and is used to associate payload type by transaction type.

And `defaultClients: Record<number, Client>`, clients will be used to watch tx on multiple chains if needed. 

-----------
### 4) Create your own wallet slice in your app, base on library slice.

Library wallet slice is a set of ready solutions to work with [wagmi.sh](https://wagmi.sh/).

It will do appropriate logic to handle different connectors type and save the required states to zustand store.

`-> @/store/web3Slice.ts`
```ts
import {
  createWalletSlice,
  initChainInformationConfig,
  type IWalletSlice,
  type StoreSlice,
} from "@bgd-labs/frontend-web3-utils";
import { produce } from "immer";

import { DESIRED_CHAIN_ID, clients } from "@/appConfig";
import { type TransactionsSlice } from "@/store/transactionsSlice";
import { ExampleService } from "@/web3Services/testService";

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

  // web3 services
  exampleService: ExampleService;
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
      get().exampleService.connectSigner(config);
    }
    setTimeout(() => set({ walletConnectedTimeLock: false }), 1000);
  },

  // web3 services
  exampleService: new TestService(clients[DESIRED_CHAIN_ID]),
});
```

`walletConnected` is a callback which will be executed once wallet is connected, meaning get().activeWallet is set.

All the logic is going **through** store and **NOT** through wagmi.sh hooks.

Initializing `Web3Slice` and `TransactionsSlice` which will do the next is typically should be done once per app.

----------
### 5) Create slice to interact with contract, base on created: `TransactionsSlice`, `Web3Slice`.
`-> @/store/exampleSlice.ts`
```ts
import { type StoreSlice } from "@bgd-labs/frontend-web3-utils";

import { DESIRED_CHAIN_ID } from "@/appConfig";
import { type TransactionsSlice, TxType } from "@/store/transactionsSlice";
import { type IWeb3Slice } from "@/store/web3Slice";
import { ExampleTxParams } from "@/web3Services/exampleService";

export interface IExampleSlice {
  exampleTx: (params: ExampleTxParams) => Promise<void>;
}

export const createExampleSlice: StoreSlice<
  IExampleSlice,
  IWeb3Slice & TransactionsSlice
> = (set, get) => ({
  exampleTx: async (params) => {
    await get().executeTx({
      body: () => get().exampleService.exampleTx(),
      params: {
        type: TxType.example,
        payload: params,
        desiredChainID: DESIRED_CHAIN_ID,
      },
    });
  },
});
```
-----------
### 6) Combine all slices to one root slice.
`-> @/store/index.ts`
```ts
import { type ClientsRecord } from "@bgd-labs/frontend-web3-utils";
import { type StoreApi } from "zustand";

import { createExampleSlice, type IExampleSlice } from "@/store/exampleSlice";
import {
  createTransactionsSlice,
  type TransactionsSlice,
} from "@/store/transactionsSlice";
import { createWeb3Slice, type IWeb3Slice } from "@/store/web3Slice";

export type RootState = IWeb3Slice & TransactionsSlice & IExampleSlice;

// combine zustand slices to one root slice
export const createRootSlice = (
  set: StoreApi<RootState>["setState"],
  get: StoreApi<RootState>["getState"],
) => ({
  ...createWeb3Slice(set, get),
  ...createTransactionsSlice(set, get),
  ...createExampleSlice(set, get),
});
```
------------
### 7) Create provider with zustand store.

`-> @/providers/ZustandStoreProvider.tsx`
```tsx
"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { create, type StoreApi, useStore as useZustandStore } from "zustand";
import { devtools } from "zustand/middleware";

import { CHAINS } from "@/constants/chains";
import { createRootSlice, type RootState } from "@/store";

// provider with zustand store https://docs.pmnd.rs/zustand/guides/nextjs
export const ZustandStoreContext = createContext<StoreApi<RootState> | null>(
  null,
);

export interface ZustandStoreProviderProps {
  children: ReactNode;
}

export const ZustandStoreProvider = ({
  children,
}: ZustandStoreProviderProps) => {
  const storeRef = useRef<StoreApi<RootState>>();

  if (!storeRef.current) {
    storeRef.current = create(
      devtools(
        (setState, getState) => createRootSlice(setState, getState),
        {
          serialize: true,
        },
      ),
    );
  }

  return (
    <ZustandStoreContext.Provider value={storeRef.current}>
      {children}
    </ZustandStoreContext.Provider>
  );
};

export const useStore = <T,>(selector: (store: RootState) => T): T => {
  const zustandStoreContext = useContext(ZustandStoreContext);

  if (!zustandStoreContext) {
    throw new Error(`useStore must be use within ZustandStoreProvider`);
  }

  return useZustandStore(zustandStoreContext, selector);
};
```
------------------
### 8) Create `<WagmiProvider />`.

Since we write data directly to our store, we needed our custom component to sync wagmi config with zustand store. `<WagmiProvider />` is required to make `WalletSlice` work.

`-> @/providers/WagmiProvider.tsx`
```tsx
"use client";

import {
  createWagmiConfig,
  WagmiZustandSync,
} from "@bgd-labs/frontend-web3-utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import { mainnet } from "viem/chains";

import { CHAINS } from "@/appConfig";
import { useStore } from "@/providers/ZustandStoreProvider";

const queryClient = new QueryClient();

export const WagmiProvider = () => {
  const setWagmiConfig = useStore((store) => store.setWagmiConfig);
  const setDefaultChainId = useStore((store) => store.setDefaultChainId);
  const changeActiveWalletAccount = useStore(
    (store) => store.changeActiveWalletAccount,
  );
  
  // need for initialize wagmi client in the zustand store
  const setWagmiProviderInitialize = useStore(
    (store) => store.setWagmiProviderInitialize,
  );
  useEffect(() => {
    setWagmiProviderInitialize(true);
  }, []);

  const config = useMemo(() => {
    return createWagmiConfig({
      chains: CHAINS,
      connectorsInitProps: {
        appName: "Example",
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
      ssr: true,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiZustandSync
        withAutoConnect={process.env.NODE_ENV === "production"}
        wagmiConfig={config}
        defaultChainId={mainnet.id}
        store={{
          setWagmiConfig,
          setDefaultChainId,
          changeActiveWalletAccount,
        }}
      />
    </QueryClientProvider>
  );
};
```
----------------
### 9) Initialize providers in the root layout.
`-> app/layout.tsx` - next js app dir
```tsx
import { WagmiProvider } from "@/providers/WagmiProvider";
import { ZustandStoreProvider } from "@/providers/ZustandStoreProvider";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
        <body>
            <ZustandStoreProvider>
              <WagmiProvider />
              {children}
            </ZustandStoreProvider>
        </body>
    </html>
  );
};
export default RootLayout;
```
-------
### 10) Create transaction hook for more convenient tracking of transaction status, base on library hook.

This hook was created to make it more convenient to track the transaction that you just called, for example, when you display the transaction status inside a modal window. You may not use this in your project.

`-> @/hooks/useLastTxLocalStatus.tsx`
```tsx
"use client";

import { useLastTxLocalStatus as baseUseTxLocalStatus } from "@bgd-labs/frontend-web3-utils";
import { zeroAddress } from "viem";

import { useStore } from "@/providers/ZustandStoreProvider";
import { type TransactionUnion } from "@/store/transactionsSlice";

export const useLastTxLocalStatus = ({
  type,
  payload,
}: Pick<TransactionUnion, "type" | "payload">) => {
  const transactionsPool = useStore((store) => store.transactionsPool);
  const activeWallet = useStore((store) => store.activeWallet);

  return baseUseTxLocalStatus<TransactionUnion>({
    transactionsPool,
    activeAddress: activeWallet?.address ?? zeroAddress,
    type,
    payload,
  });
};
```
---------------

### After all the init steps are done, you can finally use everything you need to interact with web3.

#### Wallet connection example:
`-> @/components/Wallet/WalletItem.tsx`
```tsx
import { WalletType } from '@bgd-labs/frontend-web3-utils';

import { useStore } from "@/providers/ZustandStoreProvider";

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
`-> @/components/Wallet/index.tsx`
```tsx
"use client";

import { WalletType } from "@bgd-labs/frontend-web3-utils";
import React, { useEffect, useState } from "react";

import { type Wallet, WalletItem } from "@/components/Wallet/WalletItem";

export const wallets: Wallet[] = [
  {
    walletType: WalletType.Injected,
  },
  {
    walletType: WalletType.Coinbase,
  },
  {
    walletType: WalletType.WalletConnect,
  },
  {
    walletType: WalletType.Safe,
  },
  {
    walletType: WalletType.Impersonated,
  },
];

export const WalletWidget = () => {
  return (
    <div>
      {wallets.map((wallet) => (
        <WalletItem key={wallet.walletType} walletType={wallet.walletType} />
      ))}
    </div>
  );
};
```
-----------

#### Execute tx example:

`-> @/components/ExampleTxButton.tsx`
```tsx
"use client";

import React, { useEffect, useState } from "react";
import { zeroAddress } from "viem";

import { useLastTxLocalStatus } from "@/hooks/useLastTxLocalStatus";
import { useStore } from "@/providers/ZustandStoreProvider";
import { selectCurrentCounterValue } from "@/store/counterSelectors";
import { TxType } from "@/store/transactionsSlice";

export const ExampleTxButton = () => {
  const exampleTx = useStore((store) => store.exampleTx);
  const activeWallet = useStore((store) => store.activeWallet);

  const walletAddress = activeWallet?.address ?? zeroAddress;

  const {
    executeTxWithLocalStatuses,
    fullTxErrorMessage,
    setFullTxErrorMessage,
    setIsTxStart,
    isTxStart,
    setError,
    tx,
  } = useLastTxLocalStatus({
    type: TxType.example,
    payload: {
      walletAddress,
    },
  });

  const handleClick = async () => {
    await executeTxWithLocalStatuses({
      callbackFunction: async () => await exampleTx({ walletAddress }),
    });
  };

  return (
    <button onClick={handleClick}>Example tx</button>
  );
};

```
-----------

You can find an example of what a React application using this library look like, here: [example repo](https://github.com/bgd-labs/fe-shared-examples/tree/main/front-end).