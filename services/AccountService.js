import { getRepository } from 'typeorm-expo/browser';
import { AES, enc } from 'crypto-js';

import { AccountModel, AccountError } from '../db';
import api from '../utils/eos/API';

export class AccountService {
  static async getAccounts() {
    const AccountRepo = getRepository(AccountModel);
    const accounts = await AccountRepo.find();

    return accounts;
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

  static async addAccount({ pincode, privateKey, ...accountInfo }) {
    const AccountRepo = getRepository(AccountModel);

    // encrypt private key
    const encryptedPrivateKey = AES.encrypt(privateKey, pincode).toString();

    // create new account instance
    const newAccount = new AccountModel({
      ...accountInfo,
      encryptedPrivateKey
    });

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

  static async transfer({
    pincode,
    sender,
    receiver,
    encryptedPrivateKey,
    ...transferInfo
  }) {
    // decrypt privatekey
    const privateKey = AES.decrypt(encryptedPrivateKey, pincode).toString(
      enc.Utf8
    );

    console.log(receiver);

    return await api.transactions.transfer({
      ...transferInfo,
      privateKey,
      to: receiver,
      from: sender
    });
  }

  static async manageResource({
    pincode,
    encryptedPrivateKey,
    isStaking,
    ...data
  }) {
    // decrypt privatekey
    const privateKey = AES.decrypt(encryptedPrivateKey, pincode).toString(
      enc.Utf8
    );

    const promise = isStaking
      ? api.transactions.stake({
          ...data,
          privateKey
        })
      : api.transactions.unstake({ ...data, privateKey });

    return await promise;
  }
}
