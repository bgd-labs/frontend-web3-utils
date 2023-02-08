import { AddEthereumChainParameter } from '@web3-react/types';

import { WalletType } from '../web3/connectors';

export function generateExplorerLink(
  getChainParameters: (chainId: number) => AddEthereumChainParameter,
  txWalletType: WalletType,
  txChainId: number,
  txHash: string,
  activeWallet?: string
) {
  const gnosisSafeLinksHelper: Record<number, string> = {
    1: 'https://app.safe.global/eth:',
    5: 'https://app.safe.global/gor:',
  };

  if (txWalletType !== 'GnosisSafe') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return `${getChainParameters(txChainId).blockExplorerUrls[0]}/tx/${txHash}`;
  } else {
    return `${gnosisSafeLinksHelper[txChainId]}${activeWallet}/transactions/tx?id=multisig_${activeWallet}_${txHash}`;
  }
}
