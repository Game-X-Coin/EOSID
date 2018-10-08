import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm/browser';

export const NETWORK_KEY = 'network';

export class NetworkError {
  constructor({ message = '', errors = {} }) {
    this.message = message;
    this.errors = errors;
  }

  static get RequiredFields() {
    return new NetworkError({
      errors: {
        name: 'Please enter your network name',
        url: 'Please enter your url'
      }
    });
  }

  static get InvalidUrl() {
    return new NetworkError({
      errors: {
        url: 'Invalid url'
      }
    });
  }

  static get NoResponseUrl() {
    return new NetworkError({
      errors: {
        url: 'No response from url you entered'
      }
    });
  }
}

@Entity(NETWORK_KEY)
export class NetworkModel {
  @PrimaryGeneratedColumn('uuid')
  id = undefined;

  @Column('varchar')
  name = '';

  @Column('varchar')
  url = '';

  @Column('varchar')
  chainId = '';

  @Column('varchar')
  userId = '';

  constructor(data) {
    if (data) {
      const { id, name, url, chainId, userId } = data;

      this.id = id;
      this.name = name;
      this.url = url;
      this.chainId = chainId;
      this.userId = userId;
    }
  }

  static get placeholder() {
    return new NetworkModel();
  }
}
