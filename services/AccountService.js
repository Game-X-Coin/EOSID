import { getRepository } from 'typeorm-expo/browser';

import { AccountModel, AccountError } from '../db';
import api from '../utils/eos/API';

export class AccountService {
  static async getAccounts() {
    const AccountRepo = getRepository(AccountModel);
    const accounts = await AccountRepo.find();

    return accounts;
  }

  static privateToPublic(privateKey) {
    try {
      return api.Key.privateToPublic({ wif: privateKey });
    } catch (error) {
      return Promise.reject(AccountError.InvalidPrivateKey);
    }
  }

  static async findKeyAccount(publicKey, userEos) {
    // find account
    const { account_names } = await userEos.accounts.getsByPublicKey(publicKey);

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

  static async transfer(transferInfo) {
    const { receiver } = transferInfo;
    return await api.transactions.transfer({ ...transferInfo, to: receiver });
  }

  static async manageResource({ isStaking, ...data }) {
    const promise = isStaking
      ? api.transactions.stake(data)
      : api.transactions.unstake(data);

    return await promise;
  }
}
