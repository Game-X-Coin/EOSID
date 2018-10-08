import axios from 'axios';

const baseURL = 'http://jungle.cryptolions.io:18888';
const historyURL = 'http://junglehistory.cryptolions.io:18888';
const isJungleNet = true;
const api = axios.create({ baseURL });

const eosApi = {
  accounts: {
    get: ({ account_name }) =>
      api.post('/v1/chain/get_account', { account_name }).then(res => res.data),
    getsByPublicKey: public_key =>
      api
        .post('/v1/history/get_key_accounts', { public_key })
        .then(res => res.data),
    getControlledAccounts: ({ controlling_account }) =>
      api
        .post('/v1/history/get_controlled_accounts', { controlling_account })
        .then(res => res.data)
  },
  currency: {
    balance: ({ code = 'eosio.token', account, symbol }) =>
      api
        .post('/v1/chain/get_currency_balance', { code, account, symbol })
        .then(res => res.data),
    stats: ({ code = 'eosio.token', symbol = 'EOS' }) =>
      api
        .post('/v1/chain/get_currency_stats', { code, symbol })
        .then(res => res.data)
  },
  transactions: {
    get: ({ id }) =>
      (isJungleNet
        ? axios.post(`${historyURL}/v1/history/get_transaction`, { id })
        : api.post('/v1/history/get_transaction', { id })
      ).then(res => res.data),
    getRequiredKeys: ({ transaction, available_keys }) =>
      api
        .post('/v1/chain/get_required_keys', { transaction, available_keys })
        .then(res => res.data),
    gets: ({ scope, code, table, json, lower_bound, upper_bound, limit }) =>
      api
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
  },
  actions: {
    get: ({ pos, offset, account_name }) =>
      api
        .post('/v1/history/get_actions', { pos, offset, account_name })
        .then(res => res.data),
    gets: ({ pos = 0, offset = 10, account_name }) =>
      (isJungleNet
        ? axios.post(`${historyURL}/v1/history/get_actions`, {
            pos,
            offset,
            account_name
          })
        : api.post('/v1/history/get_actions', { pos, offset, account_name })
      ).then(res => res.data)
  },
  producers: {
    get: ({ id }) =>
      api.post('/v1/history/get_transaction', { id }).then(res => res.data)
  },
  code: {
    get: ({ account_name }) =>
      api.post('/v1/chain/get_code', { account_name }).then(res => res.data)
  },
  api: {
    get: ({ account_name }) =>
      api.post('/v1/chain/get_abi', { account_name }).then(res => res.data)
  },
  block: {
    get: ({ block_num_or_id }) =>
      api.post('/v1/chain/block', { block_num_or_id }).then(res => res.data),
    getHeaderState: ({ block_num_or_id }) =>
      api
        .post('/v1/chain/get_block_header_state', { block_num_or_id })
        .then(res => res.data)
  },
  info: {
    get: () => api.post('/v1/chain/get_info', {}).then(res => res.data)
  }
};

export default eosApi;
