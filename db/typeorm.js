import { createConnection } from 'typeorm/browser';

import { UserModel } from './';

export const initializeDB = () =>
  createConnection({
    database: 'eosid',
    entities: [UserModel],
    synchronize: true,
    type: 'expo'
  });
