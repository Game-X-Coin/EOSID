import { createConnection } from 'typeorm-expo/browser';

import { NetworkModel } from './NetworkModel';
import { AccountModel } from './AccountModel';
import { TransferLogModel } from './TransferLogModel';
import { SettingsModel } from './SettingsModel';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [NetworkModel, AccountModel, TransferLogModel, SettingsModel],
    synchronize: true,
    type: 'expo'
  });
