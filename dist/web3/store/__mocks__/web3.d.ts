/// <reference types="jest" />
export declare const getTransactionReceiptMock: jest.Mock<{
    wait: () => Promise<unknown>;
}, [string]>;
export declare class MockedProvider {
    getTransaction(hash: string): {
        wait: () => Promise<unknown>;
    };
}
export declare const checkAndSwitchNetwork: jest.Mock<void, []>;
export declare const createWeb3Slice: () => {
    checkAndSwitchNetwork: jest.Mock<void, []>;
    l2Provider: MockedProvider;
    l1Provider: MockedProvider;
};
