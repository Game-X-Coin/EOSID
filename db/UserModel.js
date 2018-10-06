import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm/browser';

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

@Entity('user')
export class UserModel {
  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column('varchar')
  username = '';

  constructor(data) {
    if (data) {
      const { username } = data;

      this.username = username;
    }
  }

  static get placeholder() {
    return new UserModel();
  }
}
