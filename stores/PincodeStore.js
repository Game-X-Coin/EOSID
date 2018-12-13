import { observable, action } from 'mobx';

import { PincodeService } from '../services';
import SettingsStore from './SettingsStore';
import AccountStore from './AccountStore';

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
      // if account pincode changes
      if (AccountStore.accounts.length) {
        await AccountStore.updateEncryptedKeys(this.accountPincode, pincode);
      }

      this.accountPincode = pincode;
      await SettingsStore.updateSettings({ accountPincodeEnabled: true });
    });
  }
}

export default new Store();
