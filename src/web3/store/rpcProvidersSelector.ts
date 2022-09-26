import { IRpcProvidersSlice } from './rpcProvidersSlice';

export const getProviderByChainId = (
  state: IRpcProvidersSlice,
  chainId: number
) => {
  if (state.providers[chainId]) {
    return state.providers[chainId];
  } else {
    state.setProvider(chainId);
    return state.providers[chainId];
  }
};
