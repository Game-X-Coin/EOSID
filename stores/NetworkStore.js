import { observable, action, computed } from 'mobx';

import NetworkService from '../services/NetworkService';

import { DEFAULT_CHAIN } from '../constants';
import Chains from '../constants/Chains';

import api from '../utils/eos/API';
import SettingsStore from './SettingsStore';

class Store {
  @observable
  chains = Chains.reduce((ac, chain) => {
    ac[chain.id] = chain;
    return ac;
  }, {});

  @observable
  customNetworks = [];

  @observable
  currentNetwork = null;

  @computed
  get allNetworks() {
    const keys = Object.keys(this.chains);
    return keys.reduce((ac, key) => [...ac, this.chains[key].nodes || []], []);
  }

  @action
  getNetwork(chainId) {
    const { currentChainId } = SettingsStore.settings;
    if (chainId && currentChainId && currentChainId !== chainId) {
      const chain = this.chains[chainId];
      this.currentNetwork = chain.nodes ? chain.nodes[0] : null;
    } else {
      this.currentNetwork =
        (this.chains[chainId || currentChainId || DEFAULT_CHAIN].nodes ||
          [])[0] || null;
    }

    return this.currentNetwork;
  }

  @action
  setCurrentNetwork(account, chainId, networkId) {
    let network = null;
    if (chainId && typeof networkId !== 'undefined') {
      network = (this.chains[chainId].nodes || []).find(
        node => node.id === networkId
      );
    } else {
      network = this.getNetwork(account && account.chainId);
    }
    api.currentNetwork = network;
    this.currentNetwork = network;
  }

  @action
  changeNetwork(chainId, networkId) {
    const network = this.chains[chainId].nodes.find(
      node => node.id === networkId
    );
    this.currentNetwork = network;
    api.currentNetwork = network;
  }

  @action
  setChains(chains) {
    this.chains = chains;
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
    return await NetworkService.getNetworks(this.chains).then(chains => {
      this.setChains(chains);
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
