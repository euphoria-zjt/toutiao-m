import dayjs from 'dayjs'
import Vue from 'vue'
// 加载中文语言包
import 'dayjs/locale/zh-cn'
// console.log(dayjs().format('YYYY-MM-DD'))

import relativeTime from 'dayjs/plugin/relativeTime'
// 全局使用
dayjs.locale('zh-cn')
// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)
