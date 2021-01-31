import Vue from 'vue'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './utils/error-log' // error log
import request from '@/utils/request'

import * as filters from './filters' // global filters
import { hasPermission, hasNoPermission, hasAnyPermission } from './utils/permissionDirect'

Vue.directive("input-limit", {
  bind(el, binding) {
    var wins_0 = /[^\d]/g //整数判断
    var wins_1 = /[^\d^\.]/g //小数判断
    var flag = true;
    var points = 0;
    var lengths = 0
    var remainder = 0
    var no_int = 0
    const target = el instanceof HTMLInputElement ? el : el.querySelector("input");
    target.addEventListener("compositionstart", e => {
      flag = false;
    });
    target.addEventListener("compositionend", e => {
      flag = true;
    });
    target.addEventListener("input", e => {
      setTimeout(function() {
        if (flag) {
          if (binding.value == 0) {
            if (wins_0.test(e.target.value)) {
              e.target.value = e.target.value.replace(wins_0, "");
              e.target.dispatchEvent(new Event("input")) //手动更新v-model值
            }
          }
          if (binding.value == 1) {
            if (wins_0.test(e.target.value.toString().replace(/\d+\.(\d*)/, '$1'))) {
              remainder = true
            }
            if ((e.target.value.split('.')).length - 1 > 1) {
              points = true
            }
            if (e.target.value.toString().split(".")[1] != undefined) {
              if (e.target.value.toString().split(".")[1].length > 1) {
                lengths = true
              }
            }
            if (e.target.value.toString().indexOf(".") != -1) {
              no_int = false
            } else {
              no_int = true
            }
            if (wins_1.test(e.target.value) || lengths || points || remainder) {
              if (!no_int) {
                e.target.value = e.target.value.replace(wins_1, "").replace('.', '$#$').replace(/\./g, '').replace(
                  '$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').substring(0, e.target.value.indexOf(
                  ".") + 2)
              } else {
                e.target.value = e.target.value.replace(wins_0, "")
              }
              e.target.dispatchEvent(new Event("input"))
            }
          }


          if (binding.value == 2) {
            if (wins_0.test(e.target.value.toString().replace(/\d+\.(\d*)/, '$1'))) {
              remainder = true
            }
            if ((e.target.value.split('.')).length - 1 > 1) {
              points = true
            }
            if (e.target.value.toString().split(".")[1] != undefined) {
              if (e.target.value.toString().split(".")[1].length > 2) {
                lengths = true
              }
            }
            if (e.target.value.toString().indexOf(".") != -1) {
              no_int = false
            } else {
              no_int = true
            }
            if (wins_1.test(e.target.value) || lengths || points || remainder) {
              if (!no_int) {
                e.target.value = e.target.value.replace(wins_1, "").replace('.', '$#$').replace(/\./g, '').replace(
                  '$#$', '.').replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3').substring(0, e.target.value.indexOf(
                  ".") + 3)
              } else {
                e.target.value = e.target.value.replace(wins_0, "")
              }
              e.target.dispatchEvent(new Event("input"))
            }
          }
        }
      }, 0)
    })
  }
})

const Plugins = [
  hasPermission,
  hasNoPermission,
  hasAnyPermission
]



Plugins.map((plugin) => {
  Vue.use(plugin)
})
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.prototype.$post = request.post
Vue.prototype.$get = request.get
Vue.prototype.$put = request.put
Vue.prototype.$delete = request.delete
Vue.prototype.$download = request.download
Vue.prototype.$upload = request.upload
Vue.prototype.$login = request.login

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
