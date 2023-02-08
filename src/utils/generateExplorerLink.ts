import { WalletType } from '../web3/connectors';

export function generateExplorerLink(
  blockExplorerUrls: Record<number, string[]>,
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
    return `${blockExplorerUrls[txChainId][0]}/tx/${txHash}`;
  } else {
    return `${gnosisSafeLinksHelper[txChainId]}${activeWallet}/transactions/tx?id=multisig_${activeWallet}_${txHash}`;
  }
}
