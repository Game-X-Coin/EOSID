import { getRepository } from 'typeorm-expo/browser';

import { NetworkModel, NetworkError } from '../db';

import api from '../utils/eos/API';
import Fetch from '../utils/Fetch';
import Producers from './../constants/Producers';

export default class NetworkService {
  static async getNetworks(chains = {}) {
    const networks = await this.getNodes();
    networks.forEach(network => {
      if (!network.success) {
        return;
      }
      if (!chains[network.chainId]) {
        chains[network.chainId] = { id: network.chainId, name: 'test' };
      }
      if (!chains[network.chainId].nodes) {
        chains[network.chainId].nodes = [];
      }
      chains[network.chainId].nodes.push(network);
    });

    return chains;
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
    const producers = await api.producers.get();
    producers.rows.map(async producer => {
      const url = producer.url;
      const fetch = new Fetch({ baseURL: url });
      const result = await fetch.get('/bp.json');
    });
  }

  static async getNodes() {
    const nodes = Producers.reduce((ac, producer) => {
      const nodes =
        producer.nodes.map(node => {
          node.producer = producer.name;
          return node;
        }) || [];
      return [...ac, ...nodes];
    }, []);
    const fetchedNodes = await Promise.all(
      nodes.map(async (node, index) => {
        // start[node.url] = new Date().getTime();
        node.id = index;
        node.name = `[${node.location.country}] ${node.location.name} - ${
          node.producer
        }`;
        node.chainURL = node.url;
        node.historyURL = node.historyURL ? node.historyURL : node.url;
        node.success = false;
        node.responseTime = 9999;
        const start = new Date().getTime();
        const fetchedNode = await new Promise((resolve, reject) => {
          setTimeout(() => resolve(node), 2000);
          fetch(`${node.url}/v1/chain/get_info`)
            .then(async response => {
              if (response.ok) {
                const result = await response.json();
                node.chainId = result.chain_id;
                node.responseTime = new Date().getTime() - start;
                node.success = response.ok;
              }
              return node;
            })
            .catch(e => {
              node.responseTime = new Date().getTime() - start;
              return node;
            });
        });
        return fetchedNode;
      })
    );
    fetchedNodes.sort((a, b) => a.responseTime >= b.responseTime);
    return fetchedNodes;
  }
}
