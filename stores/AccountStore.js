import { observable, action, computed } from 'mobx';

import { AccountService } from '../services';

import { UserStore, NetworkStore } from './';

class Store {
  @observable
  accounts = [];

  @observable
  info = {};

  @observable
  tokens = [];

  @observable
  fetched = false;

  @computed
  get userAccounts() {
    return this.accounts.filter(
      account => account.userId === UserStore.currentUser.id
    );
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
    console.log(accounts);
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
    this.fetched = false;

    if (!this.currentUserAccount) {
      this.fetched = true;
      return;
    }

    await Promise.all([this.getInfo(), this.getTokens()]);

    this.fetched = true;
  }

  async getInfo() {
    const account = this.currentUserAccount;

    const info = await NetworkStore.eos.accounts.get(account.name);

    this.info = info;
  }

  async getTokens() {
    const account = this.currentUserAccount;

    const tokens = await NetworkStore.eos.currency.balance({
      account: account.name
    });

    if (tokens.length) {
      this.tokens = tokens.map(token => {
        const [amount, symbol] = token.split(' ');

        return { amount, symbol };
      });
    } else {
      this.tokens = [{ amount: '0.0000', symbol: 'EOS' }];
    }
  }

  @action
  async transfer(formData) {
    return AccountService.transfer({
      ...formData,
      sender: this.currentUserAccount.name,
      privateKey: this.currentUserAccount.privateKey
    }).then(async tx => {
      await this.getTokens();
      return tx;
    });
  }
}

export const AccountStore = new Store();
