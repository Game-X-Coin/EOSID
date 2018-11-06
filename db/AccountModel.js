import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm-expo/browser';
import { AccountService } from '../services';

export const ACCOUNT_KEY = 'Account';

// define error
export class AccountError {
  constructor({ message = '', errors = {} }) {
    this.message = message;
    this.errors = errors;
  }

  static get placeholder() {
    return new AccountError({});
  }

  static get RequiredFields() {
    return new AccountError({
      errors: {
        privateKey: 'Please enter your private key',
        networkId: 'Please select account network'
      }
    });
  }

  static get InvalidPrivateKey() {
    return new AccountError({
      errors: {
        privateKey: 'Invalid private key'
      }
    });
  }

  static get AccountNotAvailable() {
    return new AccountError({
      errors: {
        privateKey: 'Account is not available'
      }
    });
  }

  static get DuplicateKey() {
    return new AccountError({
      errors: {
        privateKey: 'Already Imported Key'
      }
    });
  }
}

// define model
@Entity(ACCOUNT_KEY)
export class AccountModel {
  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column('varchar')
  name = '';

  @Column('varchar')
  networkId = '';

  @Column('simple-array')
  keys = [];

  constructor(data) {
    if (data) {
      const {
        id,
        name,
        publicKey,
        encryptedPrivateKey,
        networkId,
        permission
      } = data;

      this.id = id;
      this.name = name;
      this.networkId = networkId;

      const key = { publicKey, encryptedPrivateKey, permission };
      this.keys = AccountService.setKey(this.keys, key);
    }
  }

  static get placeholder() {
    return new AccountModel();
  }
}
