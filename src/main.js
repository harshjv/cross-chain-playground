import Vue from 'vue'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/scss/style.scss'

Vue.config.productionTip = false
Vue.prototype.$win = window
Vue.prototype.$HTTP = axios

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
