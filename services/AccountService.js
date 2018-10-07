import { getRepository } from 'typeorm/browser';
import { Eos } from 'react-native-eosjs';

import { AccountModel, AccountError } from '../db';

const eosjs = {
  privateToPublic(privateKey) {
    return new Promise(resolve => {
      Eos.privateToPublic(privateKey, e => {
        resolve(e);
      });
    });
  },

  async getKeyAccounts(publicKey) {
    return { account_names: ['iamqwdwqd'] };
  }
};

export class AccountService {
  static async getAccounts() {
    const AccountRepo = getRepository(AccountModel);
    const accounts = await AccountRepo.find();

    return accounts;
  }

  static async privateToPublic(privateKey) {
    // generate publickey
    const { isSuccess, data } = await eosjs.privateToPublic(privateKey);

    // invalid privateKey
    if (!isSuccess) {
      return Promise.reject(AccountError.InvalidPrivateKey);
    }

    return data.publicKey;
  }

  static async findKeyAccount(publicKey) {
    // find account
    const { account_names } = await eosjs.getKeyAccounts(publicKey);

    // invalid account
    if (!account_names.length) {
      return Promise.reject(AccountError.AccountNotAvailable);
    }

    return account_names;
  }

  static async addAccount(accountInfo) {
    const AccountRepo = getRepository(AccountModel);

    // create new account instance
    const newAccount = new AccountModel(accountInfo);

    // save
    await AccountRepo.save(newAccount);

    return newAccount;
  }

  static async removeAccount(accountId) {
    const AccountRepo = getRepository(AccountModel);

    // find by id
    const findAccount = await AccountRepo.findOne(accountId);

    // remove
    await AccountRepo.remove(findAccount);
  }
}
