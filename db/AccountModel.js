import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm/browser';

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
}

// define model
@Entity(ACCOUNT_KEY)
export class AccountModel {
  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column('varchar')
  name = '';

  @Column('varchar')
  publicKey = '';

  @Column('varchar')
  privateKey = '';

  @Column('varchar')
  networkId = '';

  @Column('varchar')
  userId = '';

  constructor(data) {
    if (data) {
      const { id, name, publicKey, privateKey, networkId, userId } = data;

      this.id = id;
      this.name = name;
      this.publicKey = publicKey;
      this.privateKey = privateKey;
      this.networkId = networkId;
      this.userId = userId;
    }
  }

  static get placeholder() {
    return new AccountModel();
  }
}
