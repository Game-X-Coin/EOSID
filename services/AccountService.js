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

    let account = await AccountRepo.findOne({ name: accountInfo.name });

    accountInfo.permissions.forEach(permission => {
      if (!account) {
        // create new account instance
        account = new AccountModel({
          ...accountInfo,
          permission,
          encryptedPrivateKey
        });
      } else {
        const foundKey = AccountService.getKey(account, permission);
        if (foundKey) {
          return Promise.reject(AccountError.DuplicateKey);
        }
        const { publicKey } = accountInfo;
        const key = { publicKey, encryptedPrivateKey, permission };
        account.keys = AccountService.setKey(account.keys, key);
      }
    });
    // save
    return await AccountRepo.save(account);
  }

  static async removeAccount(accountId) {
    const AccountRepo = getRepository(AccountModel);

    // find by id
    const findAccount = await AccountRepo.findOne(accountId);

    // remove
    await AccountRepo.remove(findAccount);
  }

  static encryptKey(encryptedPrivateKey, pinCode) {
    return AES.encrypt(encryptedPrivateKey, pinCode).toString();
  }

  static decryptKey(encryptedPrivateKey, pinCode) {
    return AES.decrypt(encryptedPrivateKey, pinCode).toString(enc.Utf8);
  }

  static getParsingKey(key) {
    key = key.replace(/\|/g, ',');
    return JSON.parse(key);
  }
  static getKey(account, permission = 'active') {
    let foundKey = null;
    account.keys.every(key => {
      key = AccountService.getParsingKey(key);
      if (key.permission === permission) {
        foundKey = key;
        return false;
      }
    });

    return foundKey;
  }

  static setKey(keys, key) {
    if (!keys) {
      keys = [];
    }
    key = JSON.stringify(key);
    key = key.replace(/,/g, '|');
    keys.push(key);
    return keys;
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
    // decrypt private key
    const privateKey = AccountService.decryptKey(encryptedPrivateKey, pincode);

    const transactionFunction = isStaking
      ? api.transactions.stake
      : api.transactions.unStake;

    const params = { ...data, privateKey, pincode };

    return await transactionFunction(params);
  }

  static sign({ pincode, encryptedPrivateKey, data }) {
    // decrypt private key
    const privateKey = AccountService.decryptKey(encryptedPrivateKey, pincode);

    return api.Sign.get({ privateKey, data });
  }
}
