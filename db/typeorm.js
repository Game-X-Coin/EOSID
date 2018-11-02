import { createConnection } from 'typeorm-expo/browser';

import {
  NetworkModel,
  AccountModel,
  TransferLogModel,
  SettingsModel
} from './';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [NetworkModel, AccountModel, TransferLogModel, SettingsModel],
    synchronize: true,
    type: 'expo'
  });
