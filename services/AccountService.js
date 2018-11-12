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

  static async updateEncryptedKeys(prevPincode, newPincode) {
    const AccountRepo = getRepository(AccountModel);
    const accounts = await AccountRepo.find();

    const updatedAccounts = accounts.map(account => {
      const updatedKeys = account.keys.map(key => {
        const {
          encryptedPrivateKey,
          ...parsedKeys
        } = AccountService.getParsingKey(key);

        const decryptedPrivateKey = AccountService.decryptKey(
          encryptedPrivateKey,
          prevPincode
        );

        // update private key
        const updatedEncryptedPrivateKey = AccountService.encryptKey(
          decryptedPrivateKey,
          newPincode
        );

        const stringifiedKey = AccountService.stringifyKey({
          ...parsedKeys,
          encryptedPrivateKey: updatedEncryptedPrivateKey
        });

        return stringifiedKey;
      });

      return {
        ...account,
        keys: updatedKeys
      };
    });

    // update keys in account repo
    await Promise.all(
      updatedAccounts.map(account =>
        AccountRepo.update(account.id, { keys: account.keys })
      )
    );

    return updatedAccounts;
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
    let foundKey;
    account.keys.some(key => {
      const parsedKey = AccountService.getParsingKey(key);
      return (foundKey =
        parsedKey.permission === permission ? parsedKey : false);
    });

    return foundKey;
  }

  static stringifyKey(key) {
    const stringified = JSON.stringify(key);
    const replaced = stringified.replace(/,/g, '|');

    return replaced;
  }

  static setKey(keys, key) {
    if (!keys) {
      keys = [];
    }
    const stringifiedKey = AccountService.stringifyKey(key);
    keys.push(stringifiedKey);
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
