import Vue from 'vue'
import Router from 'vue-router'

import LibraryLayout from '@/layouts/LibraryLayout.vue'
import WalletLayout from '@/layouts/WalletLayout.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: LibraryLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/Library.vue')
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
          component: () => import('@/views/wallet/CurrencySelector.vue')
        },
        {
          path: ':id/:network/:addressType',
          name: 'currency_network_wallet',
          component: () => import('@/views/wallet/WalletSelector.vue')
        }
      ]
    }
  ]
})
