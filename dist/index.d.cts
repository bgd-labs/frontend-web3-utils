import * as react from 'react';
import react__default from 'react';
import { Connector, ConnectorData, WalletClient, PublicClient, GetAccountResult } from '@wagmi/core';
import { Account, Hex, Chain as Chain$1, PublicClient as PublicClient$1 } from 'viem';
import { StoreApi, UseBoundStore } from 'zustand';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { SafeConnector } from 'wagmi/connectors/safe';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { MockProvider, MockProviderOptions } from '@wagmi/connectors/mock';
import { Chain } from 'viem/chains';

type StoreSlice<T extends object, E extends object = T> = (set: StoreApi<E extends T ? E : E & T>['setState'], get: StoreApi<E extends T ? E : E & T>['getState']) => T;

type MockConnectorOptions = Omit<MockProviderOptions, 'chainId' | 'walletClient'> & {
    chainId?: number;
};
declare class ImpersonatedConnector extends Connector<MockProvider, MockConnectorOptions> {
    #private;
    readonly id = "impersonated";
    readonly name = "Impersonated";
    readonly ready = true;
    private account;
    private accountAddress;
    constructor({ chains, options, }: {
        chains?: Chain[];
        options: MockConnectorOptions;
    });
    setAccount(account: Account | undefined): void;
    setAccountAddress(address: Hex | undefined): void;
    connect({ chainId }?: {
        chainId?: number;
    }): Promise<Required<ConnectorData>>;
    disconnect(): Promise<void>;
    getAccount(): Promise<`0x${string}`>;
    getChainId(): Promise<number>;
    getProvider({ chainId }?: {
        chainId?: number;
    }): Promise<MockProvider>;
    getWalletClient(): Promise<WalletClient>;
    isAuthorized(): Promise<boolean>;
    watchAsset(asset: {
        address: string;
        decimals?: number;
        image?: string;
        symbol: string;
    }): Promise<boolean>;
    protected onAccountsChanged: (accounts: string[]) => void;
    protected onChainChanged: (chainId: number | string) => void;
    protected onDisconnect: () => void;
    toJSON(): string;
}

type ConnectorType = InjectedConnector | WalletConnectConnector | CoinbaseWalletConnector | SafeConnector | ImpersonatedConnector;
type AllConnectorsInitProps = {
    appName: string;
    chains: Record<number, Chain$1>;
    defaultChainId?: number;
    wcParams?: {
        projectId: string;
        metadata: {
            name: string;
            description: string;
            url: string;
            icons: string[];
        };
    };
};
declare const initAllConnectors: (props: AllConnectorsInitProps) => ConnectorType[];
type WalletType = 'Injected' | 'WalletConnect' | 'Coinbase' | 'GnosisSafe' | 'Impersonated';
declare function getConnectorName(connector: ConnectorType): WalletType | undefined;

interface Wallet {
    walletType: WalletType;
    address: Hex;
    chain?: Chain$1;
    client: PublicClient;
    walletClient: WalletClient;
    isActive: boolean;
    isContractAddress: boolean;
}
type IWalletSlice = {
    isContractWalletRecord: Record<string, boolean>;
    activeWallet?: Wallet;
    setActiveWallet: (wallet: Omit<Wallet, 'walletClient' | 'client'>) => Promise<void>;
    isActiveWalletSetting: boolean;
    connectWallet: (walletType: WalletType, chainId?: number) => Promise<void>;
    disconnectActiveWallet: () => Promise<void>;
    walletActivating: boolean;
    walletConnectionError: string;
    resetWalletConnectionError: () => void;
    initDefaultWallet: () => Promise<void>;
    changeActiveWalletAccount: (account?: GetAccountResult) => Promise<void>;
    isActiveWalletAccountChanging: boolean;
    changeActiveWalletChain: (chain?: Chain$1) => Promise<void>;
    isActiveWalletChainChanging: boolean;
    checkAndSwitchNetwork: (chainId?: number) => Promise<void>;
    connectors: ConnectorType[];
    setConnectors: (connectors: ConnectorType[]) => void;
    impersonated?: {
        account?: Account;
        address?: Hex;
        isViewOnly?: boolean;
    };
    setImpersonated: (privateKeyOrAddress: string) => void;
    checkIsContractWallet: (wallet: Omit<Wallet, 'walletClient'>) => Promise<boolean>;
};
declare function createWalletSlice({ walletConnected, }: {
    walletConnected: (wallet: Wallet) => void;
}): StoreSlice<IWalletSlice, TransactionsSliceBaseType>;

interface AdapterInterface<T extends BaseTx> {
    get: () => ITransactionsSlice<T>;
    set: (fn: (state: ITransactionsSlice<T>) => ITransactionsSlice<T>) => void;
    executeTx: (params: {
        tx: NewTx;
        activeWallet: Wallet;
        payload: object | undefined;
        chainId: number;
        type: T['type'];
    }) => Promise<T & {
        status?: number;
        pending: boolean;
    }>;
    startTxTracking: (txId: string) => Promise<void>;
}

type GelatoTXState = 'WaitingForConfirmation' | 'CheckPending' | 'ExecSuccess' | 'Cancelled' | 'ExecPending' | 'ExecReverted';
type GelatoTx = {
    taskId: string;
};

type BaseTx = EthBaseTx | GelatoBaseTx;
type InitialTx = Hex | GelatoTx;
type NewTx = {
    hash: Hex;
} | GelatoTx;
type BasicTx = {
    chainId: number;
    type: string;
    from: Hex;
    payload?: object;
    localTimestamp: number;
    timestamp?: number;
    errorMessage?: string;
};
type EthBaseTx = BasicTx & {
    hash: Hex;
    to: Hex;
    nonce: number;
};
type GelatoBaseTx = BasicTx & {
    taskId: string;
    hash?: Hex;
    gelatoStatus?: GelatoTXState;
};
type ClientsRecord = Record<number, PublicClient>;
type TransactionsSliceBaseType = {
    clients: ClientsRecord;
    setClient: (chainId: number, client: PublicClient) => void;
    initTxPool: () => void;
    updateEthAdapter: (gnosis: boolean) => void;
};
type TransactionPool<T extends BaseTx> = Record<string, T>;
type PoolTx<T extends BaseTx> = T & {
    status?: number;
    pending: boolean;
    walletType: WalletType;
};
interface ITransactionsState<T extends BaseTx> {
    transactionsPool: TransactionPool<PoolTx<T>>;
    transactionsIntervalsMap: Record<string, number | undefined>;
}
interface ITransactionsActions<T extends BaseTx> {
    gelatoAdapter: AdapterInterface<T>;
    ethereumAdapter: AdapterInterface<T>;
    txStatusChangedCallback: (data: T & {
        status?: number;
        timestamp?: number;
    }) => void;
    executeTx: (params: {
        body: () => Promise<InitialTx>;
        params: {
            type: T['type'];
            payload: T['payload'];
            desiredChainID: number;
        };
    }) => Promise<T & {
        status?: number;
        pending: boolean;
    }>;
    addTXToPool: (tx: Omit<GelatoBaseTx, 'localTimestamp'> | Omit<EthBaseTx, 'localTimestamp'>, activeWallet: WalletType) => TransactionPool<PoolTx<T>>;
    isGelatoAvailable: boolean;
    checkIsGelatoAvailable: (chainId: number) => Promise<void>;
    updateEthAdapter: (gnosis: boolean) => void;
}
type ITransactionsSlice<T extends BaseTx> = ITransactionsActions<T> & ITransactionsState<T> & TransactionsSliceBaseType;
declare function createTransactionsSlice<T extends BaseTx>({ txStatusChangedCallback, defaultClients, }: {
    txStatusChangedCallback: (tx: T) => void;
    defaultClients: ClientsRecord;
}): StoreSlice<ITransactionsSlice<T>, Pick<IWalletSlice, 'checkAndSwitchNetwork' | 'activeWallet'>>;

interface LastTxStatusesParams<T extends BaseTx> {
    state: ITransactionsState<T>;
    activeAddress: string;
    type: T['type'];
    payload: T['payload'];
}
type ExecuteTxWithLocalStatusesParams = {
    errorMessage?: string;
    callbackFunction: () => Promise<void>;
};
declare const useLastTxLocalStatus: <T extends BaseTx>({ state, activeAddress, type, payload, }: LastTxStatusesParams<T>) => {
    error: string | Error;
    setError: react.Dispatch<react.SetStateAction<string | Error>>;
    loading: boolean;
    setLoading: react.Dispatch<react.SetStateAction<boolean>>;
    isTxStart: boolean;
    setIsTxStart: react.Dispatch<react.SetStateAction<boolean>>;
    txHash: `0x${string}` | undefined;
    txPending: boolean | undefined;
    txSuccess: boolean | undefined;
    txChainId: number | undefined;
    txWalletType: WalletType | undefined;
    isError: boolean;
    executeTxWithLocalStatuses: ({ errorMessage, callbackFunction, }: ExecuteTxWithLocalStatusesParams) => Promise<void>;
    fullTxErrorMessage: string | Error;
    setFullTxErrorMessage: react.Dispatch<react.SetStateAction<string | Error>>;
};

declare const initialChains: Record<number, Chain$1>;
declare const initChainInformationConfig: (chains?: Record<number, Chain$1>) => {
    clientInstances: {
        [chainId: number]: {
            instance: PublicClient$1;
        };
    };
    getChainParameters: (chainId: number) => Chain$1;
};

declare const SafeTransactionServiceUrls: {
    [key in number]: string;
};

declare enum LocalStorageKeys {
    LastConnectedWallet = "LastConnectedWallet",
    TransactionPool = "TransactionPool"
}
declare const setLocalStorageTxPool: <T extends BaseTx>(pool: TransactionPool<T>) => void;
declare const getLocalStorageTxPool: () => string | null;
declare const setLocalStorageWallet: (walletType: WalletType) => void;
declare const deleteLocalStorageWallet: () => void;
declare const clearWalletLinkLocalStorage: () => void;
declare const clearWalletConnectV2LocalStorage: () => void;

declare function getBrowserWalletLabelAndIcon(): {
    label: string;
    icon: string;
};

interface WagmiProviderProps {
    useStore: UseBoundStore<StoreApi<{
        changeActiveWalletAccount: (account?: GetAccountResult) => Promise<void>;
        changeActiveWalletChain: (chain?: Chain$1) => Promise<void>;
        setConnectors: (connectors: ConnectorType[]) => void;
    }>>;
    connectorsInitProps: AllConnectorsInitProps;
}
declare function WagmiProvider({ useStore, connectorsInitProps, }: WagmiProviderProps): react__default.JSX.Element;

declare const selectAllTransactions: <T extends BaseTx>(state: ITransactionsState<T>) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
})[];
declare const selectPendingTransactions: <T extends BaseTx>(state: ITransactionsState<T>) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
})[];
declare const selectTXByKey: <T extends BaseTx>(state: ITransactionsState<T>, key: string) => T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
};
declare const selectTXByHash: <T extends BaseTx>(state: ITransactionsState<T>, hash: string) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
}) | undefined;
declare const selectAllTransactionsByWallet: <T extends BaseTx>(state: ITransactionsState<T>, from: string) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
})[];
declare const selectPendingTransactionByWallet: <T extends BaseTx>(state: ITransactionsState<T>, from: string) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
})[];
declare const selectLastTxByTypeAndPayload: <T extends BaseTx>(state: ITransactionsState<T>, from: string, type: T["type"], payload: T["payload"]) => (T & {
    status?: number | undefined;
    pending: boolean;
    walletType: WalletType;
}) | undefined;
declare const selectTxExplorerLink: <T extends BaseTx>(state: ITransactionsState<T>, getChainParameters: (chainId: number) => Chain$1, txHash: string) => string;
declare const selectIsGelatoTXPending: (gelatoStatus?: GelatoBaseTx['gelatoStatus']) => boolean;

export { AllConnectorsInitProps, BaseTx, ClientsRecord, ConnectorType, EthBaseTx, GelatoBaseTx, ITransactionsActions, ITransactionsSlice, ITransactionsState, IWalletSlice, InitialTx, LocalStorageKeys, NewTx, SafeTransactionServiceUrls, StoreSlice, TransactionPool, TransactionsSliceBaseType, WagmiProvider, Wallet, WalletType, clearWalletConnectV2LocalStorage, clearWalletLinkLocalStorage, createTransactionsSlice, createWalletSlice, deleteLocalStorageWallet, getBrowserWalletLabelAndIcon, getConnectorName, getLocalStorageTxPool, initAllConnectors, initChainInformationConfig, initialChains, selectAllTransactions, selectAllTransactionsByWallet, selectIsGelatoTXPending, selectLastTxByTypeAndPayload, selectPendingTransactionByWallet, selectPendingTransactions, selectTXByHash, selectTXByKey, selectTxExplorerLink, setLocalStorageTxPool, setLocalStorageWallet, useLastTxLocalStatus };
