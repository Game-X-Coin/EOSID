import { NetworkModel } from '../db';

const JUNGLE = new NetworkModel({
  id: 'jungle',
  name: 'EOS Jungle Testnet',
  chainURL: 'http://jungle.cryptolions.io:18888',
  historyURL: 'http://junglehistory.cryptolions.io:18888',
  chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca'
});

export const DEFAULT_NETWORKS = [JUNGLE];
