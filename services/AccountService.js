import { getRepository } from 'typeorm-expo/browser';
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
  transfer({
    contract = 'eosio.token',
    sender,
    receiver,
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
        receiver,
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
    // generate publickey
    const { isSuccess, data } = await eosjs.privateToPublic(privateKey);

    // invalid privateKey
    if (!isSuccess) {
      return Promise.reject(AccountError.InvalidPrivateKey);
    }

    return data.publicKey;
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
    return await eosjs.transfer(transferInfo);
  }

  static async manageResource({ isStaking, ...data }) {
    const promise = isStaking ? eosjs.stake(data) : eosjs.unstake(data);

    return await promise;
  }
}
