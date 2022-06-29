// 封装axios请求模块
import axios from 'axios'
import store from '@/store'

const request = axios.create({
  // baseURL: 'http://toutiao.itheima.net'
  baseURL: 'http://geek.itheima.net' // 接口的基准路径
})
// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  // 请求发起会经过这里
  // config本次请求的配置对象
  const { user } = store.state
  if (user && user.token) {
    // config.headers.Authorization = `Bearer ${user.token}`
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // console.log(config)
  return config
  // 这里务必要返回 config配置对象否则会出不去
}, function (error) {
  // 如果请求出错了 还没有发出去会经过这里
  return Promise.reject(error)
})
// 相应拦截器
export default request
