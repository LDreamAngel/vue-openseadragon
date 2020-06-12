import Vue from 'vue'
// import axios from 'axios'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vuetify from 'vuetify'
import('../node_modules/vuetify/dist/vuetify.min.css')

Vue.config.productionTip = false
Vue.use(ElementUI,Vuetify);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
