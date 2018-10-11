import axios from 'axios';

const JUNGLE_NET = 'http://jungle.cryptolions.io:18888';
const JUNGLE_HISTORY_NET = 'http://junglehistory.cryptolions.io:18888';

export class eosApi {
  constructor(url) {
    this.api = axios.create({ baseURL: url });
    this.isJungleNet = url === JUNGLE_NET ? true : false;
  }

  get accounts() {
    return {
      get: account_name =>
        this.api
          .post('/v1/chain/get_account', { account_name })
          .then(res => res.data),
      getsByPublicKey: public_key =>
        this.api
          .post('/v1/history/get_key_accounts', { public_key })
          .then(res => res.data),
      getControlledAccounts: controlling_account =>
        this.api
          .post('/v1/history/get_controlled_accounts', { controlling_account })
          .then(res => res.data)
    };
  }

  get currency() {
    return {
      balance: ({ code = 'eosio.token', account, symbol }) =>
        this.api
          .post('/v1/chain/get_currency_balance', { code, account, symbol })
          .then(res => res.data),
      stats: ({ code = 'eosio.token', symbol = 'EOS' }) =>
        this.api
          .post('/v1/chain/get_currency_stats', { code, symbol })
          .then(res => res.data)
    };
  }

  get transactions() {
    return {
      get: id =>
        (this.isJungleNet
          ? axios.post(`${JUNGLE_HISTORY_NET}/v1/history/get_transaction`, {
              id
            })
          : this.api.post('/v1/history/get_transaction', { id })
        ).then(res => res.data),
      getRequiredKeys: ({ transaction, available_keys }) =>
        this.api
          .post('/v1/chain/get_required_keys', { transaction, available_keys })
          .then(res => res.data),
      gets: ({ scope, code, table, json, lower_bound, upper_bound, limit }) =>
        this.api
          .post('/v1/chain/get_table_rows', {
            scope,
            code,
            table,
            json,
            lower_bound,
            upper_bound,
            limit
          })
          .then(res => res.data)
    };
  }

  get actions() {
    return {
      get: ({ pos, offset, account_name }) =>
        this.api
          .post('/v1/history/get_actions', { pos, offset, account_name })
          .then(res => res.data),
      gets: ({ pos = 0, offset = 10, account_name }) =>
        (this.isJungleNet
          ? axios.post(`${JUNGLE_HISTORY_NET}/v1/history/get_actions`, {
              pos,
              offset,
              account_name
            })
          : this.api.post('/v1/history/get_actions', {
              pos,
              offset,
              account_name
            })
        ).then(res => res.data)
    };
  }

  get producers() {
    return {
      get: id =>
        this.api
          .post('/v1/history/get_transaction', { id })
          .then(res => res.data)
    };
  }

  get code() {
    return {
      get: account_name =>
        this.api
          .post('/v1/chain/get_code', { account_name })
          .then(res => res.data)
    };
  }

  get abi() {
    return {
      get: account_name =>
        this.api
          .post('/v1/chain/get_abi', { account_name })
          .then(res => res.data)
    };
  }

  get block() {
    return {
      get: block_num_or_id =>
        this.api
          .post('/v1/chain/block', { block_num_or_id })
          .then(res => res.data),
      getHeaderState: ({ block_num_or_id }) =>
        this.api
          .post('/v1/chain/get_block_header_state', { block_num_or_id })
          .then(res => res.data)
    };
  }

  get info() {
    return {
      get: _ => this.api.post('/v1/chain/get_info', {}).then(res => res.data)
    };
  }
}
