import { getRepository } from 'typeorm-expo/browser';
import { Eos } from 'react-native-eosjs';
import ecc from 'eosjs-ecc-rn';
import { AES } from 'crypto-js';

import { AccountModel, AccountError } from '../db';

const eosjs = {
  transfer({
    contract = 'eosio.token',
    sender,
    reciever,
    amount,
    symbol = 'EOS',
    memo,
    privateKey,
    broadcast = true
  }) {
    return new Promise(resolve => {
      Eos.transfer(
        contract,
        sender,
        reciever,
        `${amount} ${symbol}`,
        memo,
        privateKey,
        broadcast,
        e => {
          resolve(e.data);
        }
      );
    });
  },
  stake({ sender, reciever, cpu, net, symbol = 'EOS', privateKey }) {
    return new Promise(resolve => {
      Eos.delegate(
        privateKey,
        sender,
        reciever ? reciever : sender,
        `${cpu.toFixed(4)} ${symbol}`,
        `${net.toFixed(4)} ${symbol}`,
        e => {
          resolve(e.data);
        }
      );
    });
  },
  unstake({ sender, reciever, cpu, net, symbol = 'EOS', privateKey }) {
    return new Promise(resolve => {
      Eos.undelegate(
        privateKey,
        sender,
        reciever ? reciever : sender,
        `${cpu.toFixed(4)} ${symbol}`,
        `${net.toFixed(4)} ${symbol}`,
        e => {
          resolve(e.data);
        }
      );
    });
  }
};

export class AccountService {
  static async getAccounts() {
    const AccountRepo = getRepository(AccountModel);
    const accounts = await AccountRepo.find();

    return accounts;
  }

  static async privateToPublic(privateKey) {
    // check privateKey
    if (!ecc.isValidPrivate(privateKey)) {
      return Promise.reject(AccountError.InvalidPrivateKey);
    }

    // generate private key
    return ecc.privateToPublic(privateKey);
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

  static async transfer({ pincode, encryptedPrivateKey, ...transferInfo }) {
    // decrypt privatekey
    const privateKey = AES.decrypt(encryptedPrivateKey, pincode).toString();

    const promise = eosjs.transfer({ ...transferInfo, privateKey });

    return await promise;
  }

  static async manageResource({
    pincode,
    encryptedPrivateKey,
    isStaking,
    ...data
  }) {
    // decrypt privatekey
    const privateKey = AES.decrypt(encryptedPrivateKey, pincode).toString();

    const promise = isStaking
      ? eosjs.stake({
          ...data,
          privateKey
        })
      : eosjs.unstake({ ...data, privateKey });

    return await promise;
  }
}
