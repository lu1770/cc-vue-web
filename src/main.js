// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import BootstrapVue from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/style.css'
import './assets/global.less'

import Vue2TouchEvents from 'vue2-touch-events'

Vue.use(Vue2TouchEvents)
import {Datepicker, Timepicker, DatetimePicker} from '@livelybone/vue-datepicker';
import Extensions from './extensions'
import {NavbarPlugin} from 'bootstrap-vue'

Vue.use(NavbarPlugin)
Vue.use(BootstrapVue);

Vue.use(VueResource);

Vue.use(Extensions)
Vue.config.productionTip = false

// Global register
Vue.component('datepicker', Datepicker);
Vue.component('timepicker', Timepicker);
Vue.component('datetime-picker', DatetimePicker);

String.prototype.PadLeft = function (len, charStr) {
  var s = this + '';
  return new Array(len - s.length + 1).join(charStr, '') + s;
}
String.prototype.PadRight = function (len, charStr) {
  var s = this + '';
  return s + new Array(len - s.length + 1).join(charStr, '');
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})

