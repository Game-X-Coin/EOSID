import { SecureStore } from 'expo';

const SECURE_STORE_APP_PINCODE = 'app-pincode';
const SECURE_STORE_ACCOUNT_PINCODE = 'account-pincode';

const serviceTypes = {
  app: SECURE_STORE_APP_PINCODE,
  account: SECURE_STORE_ACCOUNT_PINCODE
};

export class PincodeService {
  static async getPincode(type) {
    const service = serviceTypes[type];

    return await SecureStore.getItemAsync(service);
  }

  static async validatePincode(pincode, type) {
    const service = serviceTypes[type];

    const storedPincode = await SecureStore.getItemAsync(service);

    if (pincode === storedPincode) {
      return Promise.resolve();
    } else {
      return Promise.reject();
    }
  }

  static async savePincode(pincode, type) {
    const service = serviceTypes[type];

    await SecureStore.setItemAsync(service, pincode);
  }
}
