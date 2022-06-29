import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// Vant 核心组件库
import Vant from 'vant'
// 加载Vant全局样式
import 'vant/lib/index.css'
// 加载全局样式
import './styles/index.less'
// 加载动态设置 REM基准值
import 'amfe-flexible'
// 加载dayjs初始化设置
import '@/utils/dayjs'
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
