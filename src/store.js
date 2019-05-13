import Vue from 'vue'
import Vuex from 'vuex'

import { syncAndNavigate } from '@/utils/sync'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chain: 'btc',
    transport: 'usb',
    network: 'bitcoin',
    wallet: 'ledger',
    btcRpc: 'https://liquality.io/bitcoinrpc/',
    btcRpcUser: 'liquality',
    btcRpcPass: 'liquality123',
    ethRpc: 'https://mainnet.infura.io/v3/da99ebc8c0964bb8bb757b6f8cc40f1f',
    erc20: '',
    erc20Address: '',
    atomicSwap: ''
  },
  mutations: {
    NAVIGATE (state, { key, value }) {
      let init = false

      if (key === 'init') {
        key = undefined
        init = true
      }

      syncAndNavigate(key, value, init, query => {
        Object.entries(query).map(([ k, v ]) => {
          if (k && v === '') {
            delete query[key]
          }

          if (state[k] !== v) {
            state[k] = v
          }
        })
      })
    }
  },
  actions: {
    init ({ commit, state }) {
      commit('NAVIGATE', {
        key: 'init'
      })
    }
  }
})
