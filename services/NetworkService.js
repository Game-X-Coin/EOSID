import { getRepository } from 'typeorm-expo/browser';

import { NetworkModel, NetworkError } from '../db';

import api from '../utils/eos/API';

export class NetworkService {
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
}
