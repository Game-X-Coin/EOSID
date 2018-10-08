import { observable, action, computed } from 'mobx';

import { AccountService } from '../services';

import { UserStore } from './';

class Store {
  @observable
  accounts = [];

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
    // update user info
    await UserStore.updateUser({ accountId });
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
}

export const AccountStore = new Store();
