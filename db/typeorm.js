import { createConnection } from 'typeorm-expo/browser';

import { UserModel, NetworkModel, AccountModel } from './';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [UserModel, NetworkModel, AccountModel],
    synchronize: true,
    type: 'expo'
  });
