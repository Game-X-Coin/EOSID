import { observable, action, computed } from 'mobx';

import { NetworkService } from '../services';

import { AccountStore } from './AccountStore';

import { DEFAULT_NETWORKS } from '../constants';

import api from '../utils/eos/API';

class Store {
  @observable
  defaultNetworks = DEFAULT_NETWORKS;

  @observable
  customNetworks = [];

  @computed
  get eos() {
    return api;
  }

  @computed
  get allNetworks() {
    return [...this.defaultNetworks, ...this.customNetworks];
  }

  @computed
  get currentNetwork() {
    const { currentAccount } = AccountStore;

    if (currentAccount) {
      return this.allNetworks.find(
        network => network.id === currentAccount.networkId
      );
    }
    // return default network
    return this.defaultNetworks[0];
  }

  @action
  setCustomNetworks(networks) {
    console.log('networks', networks);
    this.customNetworks = networks;
  }

  @action
  async getNetworks() {
    return NetworkService.getNetworks().then(networks => {
      this.setCustomNetworks(networks);
    });
  }

  @action
  async addNetwork(networkInfo) {
    return NetworkService.addNetwork({
      ...networkInfo
    }).then(network => {
      this.setCustomNetworks([...this.customNetworks, network]);
    });
  }

  @action
  async removeNetwork(networkId) {
    return NetworkService.removeNetwork(networkId).then(_ => {
      const filterDeletedNetwork = this.customNetworks.filter(
        network => network.id !== networkId
      );
      this.setCustomNetworks(filterDeletedNetwork);
    });
  }
}

export const NetworkStore = new Store();
