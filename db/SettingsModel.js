import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm-expo/browser';

export const SETTINGS_KEY = 'settings';

@Entity(SETTINGS_KEY)
export class SettingsModel {
  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column('varchar')
  accountId = '';

  @Column('boolean')
  accountPincodeEnabled = false;

  @Column('boolean')
  appPincodeEnabled = false;

  constructor(data) {
    if (data) {
      const {
        id,
        accountId = '',
        accountPincodeEnabled = false,
        appPincodeEnabled = false
      } = data;

      this.id = id;
      this.accountId = accountId;
      this.accountPincodeEnabled = accountPincodeEnabled;
      this.appPincodeEnabled = appPincodeEnabled;
    }
  }

  static get placeholder() {
    return new SettingsModel();
  }
}
