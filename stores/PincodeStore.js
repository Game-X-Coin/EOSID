import { observable, action } from 'mobx';

import { SettingsStore } from '../stores/SettingsStore';
import { PincodeService } from '../services';

class Store {
  @observable
  accountPincode = '';

  @observable
  appPincode = '';

  @action
  async validateAppPincode(pincode) {
    return PincodeService.validatePincode(pincode, 'app').then(() => {
      this.appPincode = pincode;
    });
  }

  @action
  async validateAccountPincode(pincode) {
    return PincodeService.validatePincode(pincode, 'account').then(() => {
      this.accountPincode = pincode;
    });
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
