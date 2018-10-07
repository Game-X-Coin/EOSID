import { createConnection } from 'typeorm/browser';

import { UserModel, NetworkModel } from './';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [UserModel, NetworkModel],
    synchronize: true,
    type: 'expo'
  });
