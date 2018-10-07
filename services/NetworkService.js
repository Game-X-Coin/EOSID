import { getRepository } from 'typeorm/browser';

import { NetworkModel } from '../db';

export class NetworkService {
  static async getNetworks() {
    const NetworkRepo = getRepository(NetworkModel);
    const networks = await NetworkRepo.find();

    return networks;
  }

  static async addNetwork(networkInfo) {
    const NetworkRepo = getRepository(NetworkModel);

    // create new network instance
    const newNetwork = new NetworkModel(networkInfo);

    // save
    await NetworkRepo.save(newNetwork);

    return newNetwork;
  }

  static async removeNetwork(networkId) {
    const NetworkRepo = getRepository(NetworkModel);

    // find by id
    const findNetwork = await NetworkRepo.findOne(networkId);

    // remove
    NetworkRepo.remove(findNetwork);
  }
}
