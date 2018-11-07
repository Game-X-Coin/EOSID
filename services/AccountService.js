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

  static async addAccount({
    pincode,
    privateKey,
    permissions,
    publicKey,
    name,
    ...accountInfo
  }) {
    const AccountRepo = getRepository(AccountModel);

    // encrypt private key
    const encryptedPrivateKey = AccountService.encryptKey(privateKey, pincode);

    let account = await AccountRepo.findOne({ name });

    if (!account) {
      // create new account instance
      account = new AccountModel({
        ...accountInfo,
        name,
        publicKey,
        encryptedPrivateKey,
        permission: permissions[0]
      });

      // check duplicated permission in account
    } else if (
      permissions.find(permission => AccountService.getKey(account, permission))
    ) {
      return Promise.reject(AccountError.DuplicatedKey);
    }

    // update account permissions
    account.keys = permissions.reduce((pv, permission) => {
      const key = {
        publicKey,
        encryptedPrivateKey,
        permission
      };

      return AccountService.setKey(pv, key);
    }, []);

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

  static encryptKey(privateKey, pinCode) {
    return AES.encrypt(privateKey, pinCode).toString();
  }

  static decryptKey(encryptedPrivateKey, pinCode) {
    return AES.decrypt(encryptedPrivateKey, pinCode).toString(enc.Utf8);
  }

  static getParsingKey(key) {
    key = key.replace(/[|]/g, ',');
    return JSON.parse(key);
  }

  static getKey(account, permission = 'active') {
    const foundKey = account.keys.find(
      key => AccountService.getParsingKey(key).permission === permission
    );

    return AccountService.getParsingKey(foundKey);
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
