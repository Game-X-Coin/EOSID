import { observable, action } from 'mobx';

import { SettingsStore } from '../stores/SettingsStore';
import { PincodeService } from '../services';

class Store {
  @observable
  accountPincode = '';

  @observable
  appPincode = '';

  @action
  async getPincodes() {
    await Promise.all([this.getAccountPincode(), this.getAppPincode()]);
  }

  @action
  async getAccountPincode() {
    this.accountPincode = await PincodeService.getPincode('account');
  }

  @action
  async getAppPincode() {
    this.appPincode = await PincodeService.getPincode('app');
  }

  @action
  async validateAppPincode(pincode) {
    return PincodeService.validatePincode(pincode, 'app');
  }

  @action
  async validateAccountPincode(pincode) {
    return PincodeService.validatePincode(pincode, 'account');
  }

  @action
  async saveAppPincode(pincode) {
    return PincodeService.savePincode(pincode, 'app').then(async pincode => {
      await SettingsStore.updateSettings({ appPincodeEnabled: true });
    });
  }

  @action
  async saveAccountPincode(pincode) {
    return PincodeService.savePincode(pincode, 'account').then(async () => {
      await SettingsStore.updateSettings({ accountPincodeEnabled: true });
    });
  }
}

export const PincodeStore = new Store();
