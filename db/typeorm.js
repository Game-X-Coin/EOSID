import { createConnection } from 'typeorm/browser';

import { UserModel, NetworkModel, AccountModel } from './';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [UserModel, NetworkModel, AccountModel],
    synchronize: true,
    type: 'expo'
  });
