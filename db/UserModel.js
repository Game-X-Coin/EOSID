import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm-expo/browser';

export const USER_KEY = 'user';

export class UserError {
  constructor({ message = '', errors = {} }) {
    this.message = message;
    this.errors = errors;
  }

  static get UserAlreadyExist() {
    return new UserError({
      message: 'User already exist'
    });
  }

  static get PincodeNotMatch() {
    return new UserError({
      message: 'Pincode not match'
    });
  }
}

@Entity(USER_KEY)
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column('varchar')
  username = '';

  @Column('varchar')
  accountId = ''; // using eos account

  constructor(data) {
    if (data) {
      const { id, username = '', accountId = '' } = data;

      this.id = id;
      this.username = username;
      this.accountId = accountId;
    }
  }

  static get placeholder() {
    return new UserModel();
  }
}
