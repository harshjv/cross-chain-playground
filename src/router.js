import Vue from 'vue'
import Router from 'vue-router'

import Library from './layouts/Library.vue'
import WalletLayout from './layouts/Wallet.vue'

import LibraryHome from './views/library/Home.vue'

import Selection from './views/wallet/Selection.vue'
import Wallet from './views/wallet/Wallet.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Library,
      children: [
        {
          path: '',
          name: 'home',
          component: LibraryHome
        }
      ]
    },
    {
      path: '/wallet',
      component: WalletLayout,
      children: [
        {
          path: '',
          name: 'wallet',
          component: Selection
        },
        {
          path: ':id/:network',
          name: 'currency_network_wallet',
          component: Wallet
        }
      ]
    }
  ]
})
