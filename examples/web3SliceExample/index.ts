import { ethers, providers } from "ethers";
import { GetState, SetState } from "zustand";
import {
  createTransactionsSlice,
  ITransactionsSlice,
} from "../../web3/store/transactionsSlice";

type SomeTransaction = {
  type: "somethingImportantHappened";
  chainId: 0,
  hash: "0x000000";
  from: "0x0000002323",
  to: "0x0000002323",
  nonce: 1,
  payload: {
    fuzz: "fuzz";
  };
};

type SomeOtherTransaction = {
  type: "somethingNotVeryImportantHappened";
  chainId: 0,
  hash: "0x0000002323";
  from: "0x0000002323",
  to: "0x0000002323",
  nonce: 0,
  payload: {
    buzz: "buzz";
  };
};

type TransactionsUnion = SomeOtherTransaction | SomeTransaction;

type RootState = ITransactionsSlice<TransactionsUnion> & {
  l1Provider: providers.JsonRpcProvider;
  l2Provider: providers.JsonRpcProvider;
};

const createRootSlice = (
  set: SetState<RootState>,
  get: GetState<RootState>
) => ({
  // l1Provider: new providers.JsonRpcProvider("l1RpcURL"),
  // l2Provider: new providers.JsonRpcProvider("l2RpcURL"),
  // ...createTransactionsSlice<TransactionsUnion>({
  //   callbackObserver: (tx) => {
  //     switch (tx.type) {
  //       case "somethingNotVeryImportantHappened":
  //         console.log(tx.payload.buzz);
  //         return;
  //       case "somethingImportantHappened":
  //         console.log(tx.payload.fuzz);
  //         return;
  //     }
  //   },
  // })(set, get),
});

export const Web3SliceExample = () => {};
