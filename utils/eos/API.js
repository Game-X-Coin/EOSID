import { Api, JsSignatureProvider, JsonRpc, Serialize } from 'eosjs-rn';
import ecc from 'eosjs-ecc-rn';
import { TextDecoder, TextEncoder } from 'text-encoding';
import Fetch from '../Fetch';

class EosApi {
  static currentNetwork = null;
  static FetchChain = null;
  static FetchHistory = null;
  static isJungleNet = false;

  static API(url, fetchAPI) {
    if (!fetchAPI || fetchAPI.baseURL !== url) {
      fetchAPI = new Fetch({ baseURL: url });
    }
    return fetchAPI;
  }

  static ChainAPI(url) {
    if (url) {
      return new Fetch({ baseURL: url });
    }
    EosApi.FetchChain = EosApi.API(
      EosApi.currentNetwork.chainURL,
      EosApi.FetchChain
    );
    return EosApi.FetchChain;
  }

  static HistoryAPI(url) {
    if (url) {
      return new Fetch({ baseURL: url });
    }
    EosApi.FetchHistory = EosApi.API(
      EosApi.currentNetwork.historyURL,
      EosApi.FetchHistory
    );
    return EosApi.FetchHistory;
  }

  static get Rpc() {
    return new JsonRpc(EosApi.currentNetwork.chainURL, { fetch });
  }

  static getApi({ privateKey, sign = true } = {}) {
    const network = EosApi.currentNetwork;
    const signatureProvider = new JsSignatureProvider(sign ? [privateKey] : []);

    return new Api({
      chainId: network.chainId,
      rpc: EosApi.Rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    });
  }

  static get accounts() {
    return {
      get: ({ account_name, url }) =>
        EosApi.ChainAPI(url).post('/v1/chain/get_account', { account_name }),
      getsByPublicKey: (public_key, url) =>
        EosApi.HistoryAPI(url).post('/v1/history/get_key_accounts', {
          public_key
        }),
      getControlledAccounts: ({ controlling_account }) =>
        EosApi.HistoryAPI().post('/v1/history/get_controlled_accounts', {
          controlling_account
        })
    };
  }

  static get currency() {
    return {
      balance: ({ code = 'eosio.token', account, symbol }) =>
        EosApi.ChainAPI().post('/v1/chain/get_currency_balance', {
          code,
          account,
          symbol
        }),
      stats: ({ code = 'eosio.token', symbol = 'EOS' }) =>
        EosApi.ChainAPI().post('/v1/chain/get_currency_stats', {
          code,
          symbol
        }),
      precision: async ({ account = 'eosio.token', symbol = 'EOS' }) => {
        if (symbol === 'EOS') {
          return 4;
        }
        const stats = await EosApi.currency.stats({ code: account, symbol });
        const maxSupplyBalance = stats[symbol].max_supply.split(' ')[0];
        return maxSupplyBalance.split('.')[1].length;
      }
    };
  }
  static get transactions() {
    return {
      get: ({ id }) =>
        EosApi.HistoryAPI().post('/v1/history/get_transaction', { id }),
      getRequiredKeys: ({ transaction, available_keys }) =>
        EosApi.ChainAPI().post('/v1/chain/get_required_keys', {
          transaction,
          available_keys
        }),
      gets: ({ scope, code, table, json, lower_bound, upper_bound, limit }) =>
        EosApi.ChainAPI().post('/v1/chain/get_table_rows', {
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
        const result = await EosApi.abi.get({ account_name: account });
        if (!result.abi) {
          throw new Error('not found contract code');
        }

        const struct = result.abi.structs.find(struct => struct.name === name);

        if (!struct) {
          throw new Error('not found struct to contract code');
        }

        const data = {};
        struct.fields.forEach(field => {
          if (!params.hasOwnProperty(field.name)) {
            throw new Error(
              `${field.name} is required, ${field.name} parameter missing`
            );
          }
          if (field.type.endsWith('?') || field.type.endsWith('$')) {
            // optional type or extension type
            if (!params.hasOwnProperty(field.name)) {
              return;
            }
          } else if (field.type === 'extended_asset') {
            data[field.name] = {
              quantity: params[field.name],
              contract: account
            };
            return;
          }
          data[field.name] = params[field.name];
        });
        return data;
      },
      validateAuthorization: params => {
        const { actor, permission } = params;

        const authorization = [];
        authorization.push({ actor, permission });
        return authorization;
      },
      transaction: async ({
        broadcast = true,
        sign = true,
        proposal = false,
        blocksBehind = 3,
        expireSeconds = 300,
        ...params
      }) => {
        try {
          const { account, name } = params;
          params.actor = params.actor ? params.actor : params.from;

          const data = await this.transactions.validateData(params);
          const authorization = this.transactions.validateAuthorization(params);

          if (proposal) {
            broadcast = false;
            sign = false;
          }

          const api = EosApi.getApi({ ...params, sign });
          const result = api.transact(
            { actions: [{ account, name, authorization, data }] },
            { broadcast, sign, blocksBehind, expireSeconds }
          );

          if (proposal) {
            const packed_transaction = api.deserializeTransaction(
              (await result).serializedTransaction
            );
            return EosApi.proposal({
              packed_transaction,
              requested: authorization
            });
          }
          return result;
        } catch (e) {
          console.log(`\nCaught exception: ${e}`);
          console.log(e);
          throw e;
        }
      },
      transfer: async params => {
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
          throw new Error("It should needed 'from' data");
        }

        if (!params.actor && params.from) {
          params.actor = params.from;
        }

        symbol = symbol.toUpperCase();
        const precision = await EosApi.currency.precision({
          code: account,
          symbol
        });
        const fixedBalance = parseFloat(amount).toFixed(precision);
        params.quantity = `${fixedBalance} ${symbol}`;

        const transaction = { ...params, account, name };
        return EosApi.transactions.transaction(transaction);
      },
      stake: async params => {
        let {
          account = 'eosio',
          name = 'delegatebw',
          transfer = true,
          net = 0,
          cpu = 0,
          symbol = 'EOS'
        } = params;

        if (typeof net === 'string') {
          net = parseFloat(net);
        }
        if (typeof cpu === 'string') {
          cpu = parseFloat(cpu);
        }

        if (net <= 0 && cpu <= 0) {
          throw new Error('must should stake positive quantity');
        }

        if (!params.from) {
          throw new Error("It should needed 'from' data");
        }

        if (!params.receiver) {
          params.receiver = params.from;
        }

        if (params.from === params.receiver) {
          transfer = false;
        }

        if (!params.actor && params.from) {
          params.actor = params.from;
        }

        const precision = await EosApi.currency.precision({ symbol });

        net = parseFloat(net).toFixed(precision);
        cpu = parseFloat(cpu).toFixed(precision);

        params.stake_net_quantity = `${net} ${symbol}`;
        params.stake_cpu_quantity = `${cpu} ${symbol}`;

        const transaction = { ...params, account, name, transfer };

        return EosApi.transactions.transaction(transaction);
      },
      unStake: async params => {
        let {
          account = 'eosio',
          name = 'undelegatebw',
          transfer = false,
          net = 0,
          cpu = 0,
          symbol = 'EOS'
        } = params;

        if (typeof net === 'string') {
          net = parseFloat(net);
        }
        if (typeof cpu === 'string') {
          cpu = parseFloat(cpu);
        }

        if (net <= 0 && cpu <= 0) {
          throw new Error('must should unstake positive quantity');
        }

        if (!params.from) {
          throw new Error("It should needed 'from' data");
        }

        if (!params.receiver) {
          params.receiver = params.from;
        }

        if (!params.actor && params.from) {
          params.actor = params.from;
        }

        if (params.from === params.receiver) {
          transfer = false;
        }

        const precision = await EosApi.currency.precision({ symbol });

        net = parseFloat(net).toFixed(precision);
        cpu = parseFloat(cpu).toFixed(precision);

        params.unstake_net_quantity = `${net} ${symbol}`;
        params.unstake_cpu_quantity = `${cpu} ${symbol}`;

        const transaction = { ...params, account, name, transfer };

        return EosApi.transactions.transaction(transaction);
      },
      buyRam: params => {
        console.log('buy ram');
      },
      sellRam: params => {
        console.log('sell ram');
      },
      proposal: async params => {
        let {
          account = 'eosio.msig',
          name = 'propose',
          proposal_name,
          packed_transaction
        } = params;

        if (!proposal_name) {
          // input random proposal_name
          const buffer = new Serialize.SerialBuffer({
            textEncoder: new TextEncoder(),
            textDecoder: new TextDecoder()
          });
          const data = await ecc.key_utils.random32ByteBuffer({ safe: false });
          buffer.pushArray(data);
          const name = buffer.getName();
          proposal_name = name;
        }

        if (!params.proposer) {
          throw new Error("It should needed 'proposer' data");
        }

        if (!params.requested) {
          return new Error('It should needed requested parameter');
        }

        if (!packed_transaction) {
          return new Error('It should needed packed_transaction parameter');
        }

        const transactions = {
          ...params,
          account,
          name,
          proposal_name,
          trx: packed_transaction
        };
        return EosApi.transactions.transaction(transactions);
      }
    };
  }
  static get actions() {
    return {
      get: ({ pos, account_name }) =>
        EosApi.HistoryAPI().post('/v1/history/get_actions', {
          pos,
          offset: 0,
          account_name
        }),
      getsLastest: ({ account_name }) =>
        EosApi.actions.gets({ pos: -1, offset: -1, account_name }),
      gets: ({ lastestSeq, pos, page = 1, offset = 10, account_name }) => {
        if (!pos) {
          pos = lastestSeq - page * offset + 1;
          offset = offset - 1;
          if (pos < 0) {
            offset = pos + offset;
            pos = 0;
          }
        }

        return EosApi.HistoryAPI().post('/v1/history/get_actions', {
          pos,
          offset,
          account_name
        });
      }
    };
  }
  static get producers() {
    return {
      get: async ({ json = true, limit = 21 } = {}) =>
        await EosApi.ChainAPI().post('/v1/chain/get_producers', {
          json,
          limit
        })
    };
  }
  static get code() {
    return {
      get: ({ account_name }) =>
        EosApi.ChainAPI().post('/v1/chain/get_code', {
          account_name,
          code_as_wasm: true
        })
    };
  }
  static get abi() {
    return {
      get: ({ account_name }) =>
        EosApi.ChainAPI().post('/v1/chain/get_abi', { account_name })
    };
  }
  static get blocks() {
    return {
      get: ({ block_num_or_id }) =>
        EosApi.ChainAPI().post('/v1/chain/get_block', { block_num_or_id }),
      getHeaderState: ({ block_num_or_id }) =>
        EosApi.ChainAPI().post('/v1/chain/get_block_header_state', {
          block_num_or_id
        })
    };
  }
  static get info() {
    return {
      get: url => EosApi.ChainAPI(url).post('/v1/chain/get_info', {})
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
