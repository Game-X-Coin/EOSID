import { createConnection } from 'typeorm-expo/browser';

import { UserModel, NetworkModel, AccountModel, TransferLogModel } from './';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [UserModel, NetworkModel, AccountModel, TransferLogModel],
    synchronize: true,
    type: 'expo'
  });
