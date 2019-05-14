import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import '@/assets/scss/style.scss'

Vue.config.productionTip = false
Vue.prototype.$win = window

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
