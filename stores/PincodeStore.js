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
    const [appPincode, accountPincode] = await Promise.all([
      PincodeService.getPincode('app'),
      PincodeService.getPincode('account')
    ]);

    this.appPincode = appPincode;
    this.accountPincode = accountPincode;
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
    return PincodeService.savePincode(pincode, 'app').then(async () => {
      this.appPincode = pincode;
      await SettingsStore.updateSettings({ appPincodeEnabled: true });
    });
  }

  @action
  async saveAccountPincode(pincode) {
    return PincodeService.savePincode(pincode, 'account').then(async () => {
      this.accountPincode = pincode;
      await SettingsStore.updateSettings({ accountPincodeEnabled: true });
    });
  }
}

export const PincodeStore = new Store();
