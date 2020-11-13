import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // 权限控制

import request from '@/utils/request'

Vue.prototype.$request = request;

/**
 * 如果您不想使用 mock-server
 * 您希望将 MockJs 用于 mock api
 * 您可以执行: mockXHR()
 */
if (process.env.NODE_ENV === 'development') { // 用于开发环境
    const { mockXHR } = require('../mock')
    mockXHR()
}

// if (process.env.NODE_ENV === 'production') {// 用于生产环境
//     const { mockXHR } = require('../mock')
//     mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})