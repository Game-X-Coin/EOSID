import { NetworkModel } from '../db';

const JUNGLE = new NetworkModel({
  id: 'jungle',
  name: 'EOS Jungle Testnet',
  url: 'http://jungle.cryptolions.io:18888'
});

export const DEFAULT_NETWORKS = [JUNGLE];
