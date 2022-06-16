export const getTransactionReceiptMock = jest.fn((hash: string) => {
  return {
    wait: () => {
      return new Promise((res) => {
        res({
          status: 1,
          hash,
        });
      });
    }
  }
});

export class MockedProvider {
  public getTransaction(hash: string) {
    return getTransactionReceiptMock(hash);
  }
}