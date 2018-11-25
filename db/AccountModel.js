import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm-expo/browser';

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
        networkId: 'Please select account network',
        chainId: 'Please select account chain'
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
        privateKey: 'No account found on the network you selected.'
      }
    });
  }

  static get DuplicatedKey() {
    return new AccountError({
      errors: {
        privateKey: 'Same key already imported'
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
  chainId = '';

  @Column('simple-array')
  keys = [];

  constructor(data) {
    if (data) {
      const { id, name, chainId, keys = [] } = data;

      this.id = id;
      this.name = name;
      this.chainId = chainId;
      this.keys = keys;
    }
  }

  static get placeholder() {
    return new AccountModel();
  }
}
