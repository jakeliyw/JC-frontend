import request from '@/utils/request'

// BOM列表价格维护 - 分页
export function queryBomPriceList(data) {
  return request({
    url: '/tEngBom/queryBomPriceList',
    method: 'post',
    data
  })
}
// BOM明细价格维护列表
export function queryBomChildPriceList(params) {
  return request({
    url: '/tEngBom/queryBomChildPriceList',
    method: 'get',
    params
  })
}
