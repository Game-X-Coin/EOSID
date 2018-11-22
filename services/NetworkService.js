import { getRepository } from 'typeorm-expo/browser';

import { NetworkModel, NetworkError } from '../db';

import api from '../utils/eos/API';
import Fetch from '../utils/Fetch';

export default class NetworkService {
  static async getNetworks() {
    const NetworkRepo = getRepository(NetworkModel);
    const networks = await NetworkRepo.find();

    return networks;
  }

  static async addNetwork(networkInfo) {
    const NetworkRepo = getRepository(NetworkModel);
    let info;

    try {
      info = await api.info.get(networkInfo.ChainURL);
    } catch (error) {
      return Promise.reject(NetworkError.NoResponseUrl);
    }

    // create new network instance
    const newNetwork = new NetworkModel({
      ...networkInfo,
      chainId: info.chain_id
    });

    // save
    await NetworkRepo.save(newNetwork);

    return newNetwork;
  }

  static async removeNetwork(networkId) {
    const NetworkRepo = getRepository(NetworkModel);

    // find by id
    const findNetwork = await NetworkRepo.findOne(networkId);

    // remove
    await NetworkRepo.remove(findNetwork);
  }

  static async fetchNodes() {
    try {
      console.log('asdasd');
      const producers = await api.producers.get();
      console.log(producers);
      producers.map(producer => {
        const url = producer.url;
        const fetch = new Fetch({ baseURL: url });
        const result = fetch.get('/bp.json');
        console.log(result);
      });
    } catch (e) {
      console.log(e);
    }
  }
}
