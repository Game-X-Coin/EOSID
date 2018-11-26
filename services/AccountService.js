import { getRepository } from 'typeorm-expo/browser';
import { AES, enc } from 'crypto-js';

import { AccountModel, AccountError } from '../db';
import api from '../utils/eos/API';

export default class AccountService {
  static async getAccounts(chainId) {
    const AccountRepo = getRepository(AccountModel);
    const where = {};
    if (chainId) {
      where.chainId = chainId;
    }
    const accounts = await AccountRepo.find(where);

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
    chainId,
    ...accountInfo
  }) {
    const AccountRepo = getRepository(AccountModel);

    // encrypt private key
    const encryptedPrivateKey = AccountService.encryptKey(privateKey, pincode);

    let account = await AccountRepo.findOne({ name, chainId });

    if (!account) {
      // create new account instance
      const keys = AccountService.setKey({
        publicKey,
        encryptedPrivateKey,
        permission: permissions[0]
      });
      account = new AccountModel({ ...accountInfo, name, keys, chainId });
      permissions = permissions.slice(1);
      // check duplicated permission in account
    } else if (
      permissions.find(permission => AccountService.getKey(account, permission))
    ) {
      return Promise.reject(AccountError.DuplicatedKey);
    }

    // update account permissions
    const keys = permissions.reduce((pv, permission) => {
      const key = {
        publicKey,
        encryptedPrivateKey,
        permission
      };

      return AccountService.setKey(key, pv);
    }, []);

    if (keys.length) {
      account.keys = [...(account.keys ? account.keys : []), ...keys];
    }

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

  static getKey(account, permission) {
    let foundKey = false;

    account.keys.some(key => {
      const parsedKey = AccountService.getParsingKey(key);
      return (foundKey =
        !permission || parsedKey.permission === permission ? parsedKey : false);
    });

    return foundKey;
  }

  static stringifyKey(key) {
    const stringified = JSON.stringify(key);
    const replaced = stringified.replace(/,/g, '|');

    return replaced;
  }

  static setKey(key, keys = []) {
    const stringifiedKey = AccountService.stringifyKey(key);
    keys.push(stringifiedKey);
    return keys;
  }

  static async transfer({
    pincode,
    from,
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
      from
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
