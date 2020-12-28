import request from '@/utils/request'

// 销售订单
export function queryTSalOrderList(data) {
  return request({
    url: '/tSalOrder/queryTSalOrderList',
    method: 'post',
    data
  })
}
// 销售订单
export function queryTSalOrderNtry(params) {
  return request({
    url: '/tSalOrder/queryTSalOrderNtry',
    method: 'post',
    params
  })
}
