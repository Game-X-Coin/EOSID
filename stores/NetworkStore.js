import { observable, action, computed } from 'mobx';

import NetworkService from '../services/NetworkService';

import { DEFAULT_NETWORKS } from '../constants';

import api from '../utils/eos/API';

class Store {
  @observable
  defaultNetworks = DEFAULT_NETWORKS;

  @observable
  customNetworks = [];

  @computed
  get allNetworks() {
    return [...this.defaultNetworks, ...this.customNetworks];
  }

  @action
  getNetwork(account) {
    let currentNetwork = this.defaultNetworks[0];

    if (account) {
      currentNetwork = this.allNetworks.find(
        network => network.id === account.networkId
      );
    }

    return currentNetwork;
  }

  @action
  setCurrentNetwork(account) {
    api.currentNetwork = this.getNetwork(account);
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

export default new Store();
