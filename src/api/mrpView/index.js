import request from '@/utils/request'

// 显示换单需求
export function MrpInfo(params) {
  return request({
    url: '/tSalOrder/MrpInfo',
    method: 'get',
    params
  })
}
// 显示换单需求
export function InsertMO(data) {
  return request({
    url: '/tSalOrder/InsertMO',
    method: 'post',
    data
  })
}
// 下拉框获取部门
export function Show_StockInfo(params) {
  return request({
    url: '/tSalOrder/Show_StockInfo',
    method: 'get',
    params
  })
}
// 获取销售订单表头
export function Show_SALOrder(params) {
  return request({
    url: '/tSalOrder/show_SALOrder',
    method: 'get',
    params
  })
}
