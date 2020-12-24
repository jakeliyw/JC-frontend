import request from '@/utils/request'

// 查询大类列表
export function queryLargeList() {
  return request({
    url: '/tJxLargeitemtype/queryLargeList',
    method: 'get'
  })
}
// 查询编码对照表数据
export function queryLargeContrast(params) {
  return request({
    url: '/tJxLargeitemtype/queryLargeContrast',
    method: 'get',
    params
  })
}
