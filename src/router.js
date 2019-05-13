import Vue from 'vue'
import Router from 'vue-router'

import Default from './layouts/Default.vue'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Default,
      children: [
        {
          path: '/',
          name: 'home',
          component: Home
        }
      ]
    }
  ]
})
