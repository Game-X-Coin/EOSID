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

  static async findKeyAccount(publicKey, url) {
    // find account
    const { account_names } = await api.accounts.getsByPublicKey(
      publicKey,
      url
    );

    // invalid account
    if (!account_names.length) {
      return Promise.reject(AccountError.AccountNotAvailable);
    }

    return account_names;
  }

  static async addAccount({ pincode, privateKey, ...accountInfo }) {
    const AccountRepo = getRepository(AccountModel);

    // encrypt private key
    const encryptedPrivateKey = AccountService.encryptKey(privateKey, pincode);

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

  static encryptKey(encryptedPrivateKey, pincode) {
    return AES.encrypt(encryptedPrivateKey, pincode).toString();
  }

  static decryptKey(encryptedPrivateKey, pincode) {
    return AES.decrypt(encryptedPrivateKey, pincode).toString(enc.Utf8);
  }

  static async transfer({
    pincode,
    sender,
    receiver,
    encryptedPrivateKey,
    ...transferInfo
  }) {
    // decrypt private key
    const privateKey = AccountService.decryptKey(encryptedPrivateKey, pincode);

    return await api.transactions.transfer({
      ...transferInfo,
      privateKey,
      pincode,
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
    const privateKey = AccountService.decryptKey(encryptedPrivateKey, pincode);

    const transactionFunction = isStaking
      ? api.transactions.stake
      : api.transactions.unstake;

    const params = { ...data, privateKey, pincode };

    return await transactionFunction(params);
  }

  static sign({ pincode, encryptedPrivateKey, data }) {
    // decrypt privatekey
    const privateKey = AccountService.decryptKey(encryptedPrivateKey, pincode);

    return api.Sign.get({ privateKey, data });
  }
}
