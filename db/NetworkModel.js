import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm-expo/browser';

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
  chainURL = '';

  @Column('varchar')
  historyURL = '';

  @Column('varchar')
  chainId = '';

  constructor(data) {
    if (data) {
      const { id, name, chainURL, historyURL, chainId } = data;

      this.id = id;
      this.name = name;
      this.chainURL = chainURL;
      this.historyURL = historyURL;
      this.chainId = chainId;
    }
  }

  static get placeholder() {
    return new NetworkModel();
  }
}
