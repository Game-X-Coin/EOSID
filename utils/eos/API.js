import { Api, JsSignatureProvider, JsonRpc, RpcError } from 'eosjs-rn';
import ecc from 'eosjs-ecc-rn';
import { TextDecoder, TextEncoder } from 'text-encoding';
import { AccountStore, NetworkStore } from '../../stores';
import { AccountService } from '../../services';
import Fetch from '../Fetch';

const JUNGLE_NET = 'http://jungle.cryptolions.io:18888';
const JUNGLE_HISTORY_NET = 'http://junglehistory.cryptolions.io:18888';

class EosApi {
  static FetchAPI = null;
  static isJungleNet = false;

  static get Api() {
    const network = NetworkStore.currentUserNetwork;
    const endpoint = EosApi.isJungleNet ? JUNGLE_NET : network.url;
    if (!EosApi.FetchAPI || EosApi.FetchAPI.baseURL !== endpoint) {
      EosApi.FetchAPI = new Fetch({ baseURL: network.url });
    }
    EosApi.isJungleNet = network.url === JUNGLE_NET ? true : false;
    return EosApi.FetchAPI;
  }

  static get Rpc() {
    const network = NetworkStore.currentUserNetwork;
    EosApi.isJungleNet = network.url === JUNGLE_NET ? true : false;
    return new JsonRpc(network.url, { fetch });
  }

  static getApi({ accountName, privateKey, pincode } = {}) {
    const network = NetworkStore.currentUserNetwork;
    if (!privateKey && pincode) {
      const account = AccountStore.findAccount(accountName);
      privateKey = AccountService(account.encryptedPrivateKey, pincode);
    }

    const signatureProvider = new JsSignatureProvider([privateKey]);

    return new Api({
      chainId: network.chainId,
      rpc: this.Rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
  }

  static get accounts() {
    return {
      get: ({ account_name }) =>
        EosApi.Api.post('/v1/chain/get_account', { account_name }),
      getsByPublicKey: public_key =>
        EosApi.Api.post('/v1/history/get_key_accounts', { public_key }),
      getControlledAccounts: ({ controlling_account }) =>
        EosApi.Api.post('/v1/history/get_controlled_accounts', {
          controlling_account
        })
    };
  }

  static get currency() {
    return {
      balance: ({ code = 'eosio.token', account, symbol }) =>
        EosApi.Api.post('/v1/chain/get_currency_balance', {
          code,
          account,
          symbol
        }),
      stats: ({ code = 'eosio.token', symbol = 'EOS' }) =>
        EosApi.Api.post('/v1/chain/get_currency_stats', { code, symbol }),
      precision: ({ account = 'eosio.token', symbol = 'EOS' }) => {
        if (symbol === 'EOS') {
          return 4;
        }
        const stats = this.currency.stats({ code: account, symbol });
        const supplyBalance = stats[symbol].max_supply.split(' ')[0];
        return supplyBalance.split('.')[1].length;
      }
    };
  }
  static get transactions() {
    return {
      get: ({ id }) =>
        (EosApi.isJungleNet
          ? new Fetch().post(
              `${JUNGLE_HISTORY_NET}/v1/history/get_transaction`,
              { id }
            )
          : EosApi.Api.post('/v1/history/get_transaction', { id })
        ).then(res => res.data),
      getRequiredKeys: ({ transaction, available_keys }) =>
        EosApi.Api.post('/v1/chain/get_required_keys', {
          transaction,
          available_keys
        }),
      gets: ({ scope, code, table, json, lower_bound, upper_bound, limit }) =>
        EosApi.Api.post('/v1/chain/get_table_rows', {
          scope,
          code,
          table,
          json,
          lower_bound,
          upper_bound,
          limit
        }),
      validateData: async params => {
        const { account, name } = params;
        const code = await EosApi.code.get({ account_name: account });
        const struct = code.abi.structs.find(struct => struct.name === name);
        if (!struct) {
          throw new Error('not found code');
        }
        const data = {};
        struct.fields.forEach(field => {
          if (!params.hasOwnProperty(field.name)) {
            throw new Error(
              `${field.name} is required, ${field.name} parameter missing`
            );
          }
          data[field.name] = params[field.name];
        });
        return data;
      },
      validateAuthorization: params => {
        let { actor } = params;

        if (!actor) {
          const foundAccount = AccountStore.findAccount();
          actor = foundAccount.name;
        }

        const authorization = [];
        authorization.push({ actor, permission: 'active' });
        return authorization;
      },
      transaction: async ({
        broadcast = true,
        blocksBehind = 3,
        expireSeconds = 30,
        ...params
      }) => {
        try {
          const { account, name } = params;
          const data = await this.transactions.validateData(params);
          const authorization = this.transactions.validateAuthorization(params);

          const accountName = params.actor ? params.actor : params.from;

          return await this.getApi({ ...params, accountName }).transact(
            { actions: [{ account, name, authorization, data }] },
            { broadcast, blocksBehind, expireSeconds }
          );
        } catch (e) {
          console.log(`\nCaught exception: ${e}`);
          console.log(e);
          throw e;
        }
      },
      transfer: params => {
        let {
          account = 'eosio.token',
          name = 'transfer',
          symbol = 'EOS',
          amount = 0
        } = params;

        if (amount <= 0) {
          throw new Error('must transfer positive quantity');
        }

        if (!params.from) {
          const foundAccount = AccountStore.findAccount();
          params.from = foundAccount.name;
        }

        if (!params.actor && params.from) {
          params.actor = params.from;
        }

        symbol = symbol.toUpperCase();
        const precision = this.currency.precision({ code: account, symbol });
        const fixedBalance = parseFloat(amount).toFixed(precision);
        params.quantity = `${fixedBalance} ${symbol}`;

        const transaction = { ...params, account, name };

        return this.transactions.transaction(transaction);
      },
      stake: params => {
        let {
          account = 'eosio',
          name = 'delegatebw',
          transfer = false,
          netQuantity = 0,
          cpuQuantity = 0,
          symbol = 'EOS'
        } = this.params;

        if (netQuantity <= 0 && cpuQuantity <= 0) {
          throw new Error('must should stake positive quantity');
        }

        if (!params.from) {
          const foundAccount = AccountStore.findAccount();
          params.from = foundAccount.name;
        }

        if (!params.receiver) {
          params.receiver = params.from;
        }

        if (!params.actor && params.from) {
          params.actor = params.from;
        }

        const precision = this.currency.precision({ symbol });

        netQuantity = parseFloat(netQuantity).toFixed(precision);
        cpuQuantity = parseFloat(cpuQuantity).toFixed(precision);

        params.stake_net_quantity = `${netQuantity} ${symbol}`;
        params.stake_cpu_quantity = `${cpuQuantity} ${symbol}`;

        const transaction = { ...params, account, name, transfer };

        return this.transactions.transaction(transaction);
      },
      unstake: params => {
        let {
          account = 'eosio',
          name = 'undelegatebw',
          transfer = false,
          netQuantity = 0,
          cpuQuantity = 0,
          symbol = 'EOS'
        } = this.params;

        if (netQuantity <= 0 && cpuQuantity <= 0) {
          throw new Error('must should unstake positive quantity');
        }

        if (!params.from) {
          const foundAccount = AccountStore.findAccount();
          params.from = foundAccount.name;
        }

        if (!params.receiver) {
          params.receiver = params.from;
        }

        if (!params.actor && params.from) {
          params.actor = params.from;
        }

        const precision = this.currency.precision({ symbol });

        netQuantity = parseFloat(netQuantity).toFixed(precision);
        cpuQuantity = parseFloat(cpuQuantity).toFixed(precision);

        params.stake_net_quantity = `${netQuantity} ${symbol}`;
        params.stake_cpu_quantity = `${cpuQuantity} ${symbol}`;

        const transaction = { ...params, account, name, transfer };

        return this.transactions.transaction(transaction);
      },
      buyRam: params => {
        console.log('buy ram');
      },
      sellRam: params => {
        console.log('sell ram');
      }
    };
  }
  static get actions() {
    return {
      get: ({ pos, offset, account_name }) =>
        EosApi.Api.post('/v1/history/get_actions', {
          pos,
          offset,
          account_name
        }),
      gets: ({ pos = 0, offset = 10, account_name }) =>
        EosApi.isJungleNet
          ? new Fetch().post(`${JUNGLE_HISTORY_NET}/v1/history/get_actions`, {
              pos,
              offset,
              account_name
            })
          : EosApi.Api.post('/v1/history/get_actions', {
              pos,
              offset,
              account_name
            })
    };
  }
  get producers() {
    return {
      get: ({ id }) => EosApi.Api.post('/v1/history/get_transaction', { id })
    };
  }
  static get code() {
    return {
      get: ({ account_name }) =>
        EosApi.Api.post('/v1/chain/get_code', {
          account_name,
          code_as_wasm: true
        })
    };
  }
  static get abi() {
    return {
      get: ({ account_name }) =>
        EosApi.Api.post('/v1/chain/get_abi', { account_name })
    };
  }
  static get blocks() {
    return {
      get: ({ block_num_or_id }) =>
        EosApi.Api.post('/v1/chain/block', { block_num_or_id }).then(
          res => res.data
        ),
      getHeaderState: ({ block_num_or_id }) =>
        EosApi.Api.post('/v1/chain/get_block_header_state', {
          block_num_or_id
        }).then(res => res.data)
    };
  }
  get info() {
    return {
      get: () => EosApi.Api.post('/v1/chain/get_info', {}),
      getBy: url => new Fetch({ baseURL: url })
    };
  }
  static get Key() {
    return {
      unsafeRandomKey: () => ecc.unsafeRandomKey(),
      /*
      @example
      ecc.randomKey().then(privateKey => {
        console.log('Private Key:\t', privateKey) // wif
        console.log('Public Key:\t', ecc.privateToPublic(privateKey)) // EOSkey...
      })
     */
      randomKey: ({ cpuEntropyBits = 0 }) => ecc.randomKey(cpuEntropyBits),
      /* @example ecc.seedPrivate('secret') === wif */
      seedPrivate: ({ seed }) => ecc.seedPrivate(seed),
      /* @example ecc.privateToPublic(wif) === pubkey */
      privateToPublic: ({ wif, pubkey_prefix = 'EOS' }) =>
        ecc.privateToPublic(wif, pubkey_prefix),
      /* @example ecc.isValidPublic(pubkey) === true */
      isValidPublic: ({ pubkey, pubkey_prefix = 'EOS' }) =>
        ecc.isValidPublic(pubkey, pubkey_prefix),
      /* @example ecc.isValidPrivate(wif) === true */
      isValidPrivate: ({ wif }) => ecc.isValidPrivate(wif)
    };
  }
  static get Sign() {
    return {
      /* @example ecc.sign('I am alive', wif) */
      get: ({ data, privateKey, encoding = 'utf8' }) =>
        ecc.sign(data, privateKey, encoding),
      hash: ({ data, privateKey, encoding = 'utf8' }) =>
        ecc.signHash(data, privateKey, encoding),
      /* @example ecc.verify(signature, 'I am alive', pubkey) === true */
      verify: ({
        signature,
        data,
        pubkey,
        encoding = 'utf8',
        hashData = true
      }) => ecc.verify(signature, data, pubkey, encoding, hashData),
      /* @example ecc.recover(signature, 'I am alive') === pubkey */
      recover: ({ signature, data, encoding = 'utf8' }) =>
        ecc.recover(signature, data, encoding),
      recoverHash: ({ signature, dataSha256, encoding = 'utf8' }) =>
        ecc.recoverHash(signature, dataSha256, encoding)
    };
  }
}

export default EosApi;
