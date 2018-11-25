import { NetworkModel } from '../db';

const JUNGLE = new NetworkModel({
  id: 'jungle',
  name: 'EOS Jungle Testnet',
  chainURL: 'http://jungle2.cryptolions.io:80',
  historyURL: 'http://junglehistory.cryptolions.io:18888',
  chainId: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473'
});

export const DEFAULT_NETWORKS = [JUNGLE];
