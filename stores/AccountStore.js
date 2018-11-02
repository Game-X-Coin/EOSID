import { observable, action, computed } from 'mobx';

import { AccountService, TransferLogService } from '../services';

import { SettingsStore, PincodeStore } from './';

import api from '../utils/eos/API';

class Store {
  @observable
  accounts = [];

  @observable
  info = {};
  /**
   * { EOS: 100.3213, JUNGLE: 0.1231 }
   */
  @observable
  tokens = {};

  @observable
  actions = [];

  @observable
  fetched = false;

  findAccount(accountName) {
    if (!accountName) {
      return this.currentAccount;
    }

    const foundAccount = this.accounts.find(
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
  get currentAccount() {
    const { accountId } = SettingsStore.settings;

    return this.accounts.find(account => account.id === accountId);
  }

  @action
  async changeCurrentAccount(accountId) {
    if (accountId !== (this.currentAccount && this.currentAccount.accountId)) {
      // update settings
      await SettingsStore.updateSettings({ accountId });
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
      pincode: PincodeStore.accountPincode
    }).then(async account => {
      await this.setAccounts([...this.accounts, account]);
      await this.changeCurrentAccount(account.id);
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
      this.changeCurrentAccount(
        this.accounts.length ? this.accounts[0].id : ''
      );
    });
  }

  @action
  async getAccountInfo() {
    this.info = {};
    this.tokens = {};
    this.actions = [];
    this.fetched = false;

    if (!this.currentAccount) {
      this.fetched = true;
      return;
    }

    await Promise.all([this.getInfo(), this.getTokens()], this.getActions());

    this.fetched = true;
  }

  async getInfo() {
    const account = this.currentAccount;
    const info = await api.accounts.get({ account_name: account.name });

    this.info = info;
  }

  async getTokens() {
    const account = this.currentAccount;

    const tokens = await api.currency.balance({ account: account.name });

    this.tokens = {
      EOS: '0.0000',
      ...tokens.reduce((ac, v) => {
        const [amount, symbol] = v.split(' ');
        return { ...ac, [symbol]: amount };
      }, {})
    };
  }

  async getActions() {
    const account = this.currentAccount;

    const latestActions =
      (
        (await api.actions.latestActions({
          account_name: account.name,
          offset: 1
        })) || {}
      ).actions || [];
    let seq = 0;
    if (latestActions.length) {
      seq = latestActions[0].account_action_seq;
    }

    const { actions = [] } = await api.actions.gets({
      account_name: account.name,
      latestSeq: seq
    });

    this.actions = actions.reverse();
  }

  @action
  async transfer(formData) {
    const { id, name, encryptedPrivateKey } = this.currentAccount;

    return AccountService.transfer({
      ...formData,
      sender: name,
      encryptedPrivateKey,
      pincode: PincodeStore.accountPincode
    }).then(async tx => {
      // fetch lastets tokens
      await this.getTokens();
      // log transfer
      TransferLogService.addTransferLog({ ...formData, accountId: id });

      return tx;
    });
  }

  @action
  async manageResource(data) {
    const { name, encryptedPrivateKey } = this.currentAccount;

    return AccountService.manageResource({
      ...data,
      sender: name,
      encryptedPrivateKey,
      pincode: PincodeStore.accountPincode
    }).then(async tx => {
      await this.getInfo();
      await this.getTokens();

      return tx;
    });
  }
}

export const AccountStore = new Store();
