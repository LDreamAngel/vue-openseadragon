import Vue from 'vue'
// import axios from 'axios'
import App from './App.vue'
import router from './router'
// import aaa from 'openseadragon'
// console.log(111,aaa);
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
