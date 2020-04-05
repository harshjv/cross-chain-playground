import Vue from 'vue'
import Vuex from 'vuex'

import { syncAndNavigate } from '@/utils/sync'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    chain: 'btc',
    network: 'bitcoin',
    wallet: 'ledger',
    transport: 'usb',
    addressType: 'bech32',
    erc20: false,
    atomicSwap: false
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
            delete query[k]
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
