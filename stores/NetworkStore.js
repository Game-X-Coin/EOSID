import { observable, action, computed } from 'mobx';

import { NetworkService } from '../services';

import { UserStore } from './UserStore';
import { AccountStore } from './AccountStore';

import { DEFAULT_NETWORKS } from '../constants';

import api from '../utils/eos/API';

class Store {
  @observable
  defaultNetworks = DEFAULT_NETWORKS;

  @observable
  networks = [];

  @computed
  get eos() {
    return api;
  }

  @computed
  get userNetworks() {
    return this.networks.filter(
      network => network.userId === UserStore.currentUser.id
    );
  }

  @computed
  get allNetworks() {
    return [...this.defaultNetworks, ...this.userNetworks];
  }

  @computed
  get currentUserNetwork() {
    if (AccountStore.currentUserAccount) {
      return this.allNetworks.find(
        network => network.id === AccountStore.currentUserAccount.networkId
      );
    }
    // return default network
    return this.defaultNetworks[0];
  }

  @action
  setNetworks(networks) {
    console.log('networks', networks);
    this.networks = networks;
  }

  @action
  async getNetworks() {
    return NetworkService.getNetworks().then(networks => {
      this.setNetworks(networks);
    });
  }

  @action
  async addNetwork(networkInfo) {
    return NetworkService.addNetwork({
      ...networkInfo,
      userId: UserStore.currentUser.id
    }).then(network => {
      this.setNetworks([...this.networks, network]);
    });
  }

  @action
  async removeNetwork(networkId) {
    return NetworkService.removeNetwork(networkId).then(_ => {
      const filterDeletedNetwork = this.networks.filter(
        network => network.id !== networkId
      );
      this.setNetworks(filterDeletedNetwork);
    });
  }
}

export const NetworkStore = new Store();
