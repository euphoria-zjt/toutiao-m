import request from '@/utils/request'
export const getSearchSuggestions = q => {
  return request({
    method: 'GET',
    url: '/v1_0/suggestion',
    params: {
      q
    }
  })
}
// // 获取搜索结果的请求
export function getSearchResult (params) {
  return request({
    method: 'GET',
    url: '/v1_0/search',
    params
  })
}
