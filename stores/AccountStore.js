import { observable, action, computed } from 'mobx';

import { AccountService } from '../services';

import { UserStore } from './';

import api from '../utils/eos/API';

class Store {
  @observable
  accounts = [];

  @observable
  info = {};

  @observable
  tokens = [];

  @observable
  actions = [];

  @observable
  fetched = false;

  @computed
  get userAccounts() {
    return (
      this.accounts.filter(
        account => account.userId === UserStore.currentUser.id
      ) || []
    );
  }

  findAccount(accountName) {
    if (!accountName) {
      return this.currentUserAccount;
    }

    const foundAccount = this.userAccounts.find(
      account => account.name === accountName
    );
    if (!foundAccount) {
      throw new Error(
        `not found ${accountName}, import '${accountName}' account`
      );
    }
    return foundAccount;
  }

  @computed
  get currentUserAccount() {
    const { accountId } = UserStore.currentUser;

    return this.userAccounts.find(account => account.id === accountId);
  }

  @action
  async changeUserAccount(accountId) {
    if (accountId !== UserStore.currentUser.accountId) {
      // update user info
      await UserStore.updateUser({ accountId });
      // fetch account info
      await this.getAccountInfo();
    }
  }

  @action
  setAccounts(accounts) {
    this.accounts = accounts;
  }

  @action
  async getAccounts() {
    return AccountService.getAccounts().then(accounts => {
      this.setAccounts(accounts);
    });
  }

  @action
  async addAccount(accountInfo) {
    return AccountService.addAccount({
      ...accountInfo,
      userId: UserStore.currentUser.id
    }).then(account => {
      this.setAccounts([...this.accounts, account]);
      this.changeUserAccount(account.id);
      this.getAccountInfo();
    });
  }

  @action
  async removeAccount(accountId) {
    return AccountService.removeAccount(accountId).then(_ => {
      const filterDeletedAccount = this.accounts.filter(
        account => account.id !== accountId
      );

      this.setAccounts(filterDeletedAccount);
      this.changeUserAccount(
        this.userAccounts.length ? this.userAccounts[0].id : ''
      );
    });
  }

  @action
  async getAccountInfo() {
    this.info = {};
    this.tokens = [];
    this.actions = [];
    this.fetched = false;

    if (!this.currentUserAccount) {
      this.fetched = true;
      return;
    }

    await Promise.all([this.getInfo(), this.getTokens()], this.getActions());

    this.fetched = true;
  }

  async getInfo() {
    const account = this.currentUserAccount;
    const info = await api.accounts.get({ account_name: account.name });

    console.log(info);

    this.info = info;
  }

  async getTokens() {
    const account = this.currentUserAccount;

    const tokens = await api.currency.balance({ account: account.name });

    if (tokens.length) {
      this.tokens = tokens.map(token => {
        const [amount, symbol] = token.split(' ');

        return { amount, symbol };
      });
    } else {
      this.tokens = [{ amount: '0.0000', symbol: 'EOS' }];
    }
  }

  async getActions() {
    const account = this.currentUserAccount;
    const { actions = [] } = await api.actions.gets({
      account_name: account.name
    });

    this.actions = actions.reverse();
  }

  @action
  async transfer(data) {
    return AccountService.transfer({
      ...data
      // from: this.currentUserAccount.name
    }).then(async tx => {
      await this.getTokens();
      return tx;
    });
  }

  @action
  async manageResource(data) {
    return AccountService.manageResource({
      ...data
      // from: this.currentUserAccount.name
    }).then(async res => {
      await this.getInfo();
      await this.getTokens();
    });
  }
}

export const AccountStore = new Store();
