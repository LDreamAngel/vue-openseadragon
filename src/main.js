import Vue from 'vue'
// import axios from 'axios'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import Vuetify from 'vuetify'
// import('../node_modules/vuetify/dist/vuetify.min.css')
// 鼠标右键事件（全局注入）
// import VueContextMenu from '@xunlei/vue-context-menu'
 

Vue.config.productionTip = false
Vue.use(ElementUI);
// Vue.use(VueContextMenu)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
