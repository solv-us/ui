import Vue from 'vue'
import App from './App.vue'
import store from './store'

import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

Vue.config.productionTip = false

Vue.prototype.$socket;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

const socket = io('localhost:8080');
Vue.use(VueSocketIOExt, socket);