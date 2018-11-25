import { observable, action, computed } from 'mobx';

import NetworkService from '../services/NetworkService';

import { DEFAULT_NETWORKS } from '../constants';

import api from '../utils/eos/API';

class Store {
  @observable
  defaultNetworks = DEFAULT_NETWORKS;

  @observable
  customNetworks = [];

  @observable
  currentNetwork = this.defaultNetworks[0];

  @computed
  get allNetworks() {
    return [...this.defaultNetworks, ...this.customNetworks];
  }

  @action
  getNetwork(account) {
    if (account && this.currentNetwork.chainId !== account.chainId) {
      this.currentNetwork = this.allNetworks.find(
        network => network.chainId === account.chainId
      );
    }

    return this.currentNetwork;
  }

  @action
  setCurrentNetwork(account) {
    api.currentNetwork = this.getNetwork(account);
  }

  @action
  setDefaultNetworks(networks) {
    this.defaultNetworks = networks;
  }

  @action
  setCustomNetworks(networks) {
    this.customNetworks = networks;
  }

  @action
  async getNetworks() {
    return await NetworkService.getDefaultNetworks().then(networks => {
      this.setDefaultNetworks(networks);
    });
    // return await Promise.all([
    //   NetworkService.getDefaultNetworks().then(networks => {
    //     this.setDefaultNetworks(networks);
    //   })
    // NetworkService.getCustomNetworks().then(networks => {
    //   this.setCustomNetworks(networks);
    // }),
    // this.setCurrentNetwork()
    // ]);
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
