import request from '@/utils/request'

// 显示换单需求
export function MrpInfo(params) {
  return request({
    url: '/tSalOrder/MrpInfo',
    method: 'get',
    params
  })
}
// MRP转单生产和委外
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
// 显示采购转单需求
export function MrpCGInfor(params) {
  return request({
    url: '/tSalOrder/MrpCGInfo',
    method: 'get',
    params
  })
}
// 获取上限单价
export function MrpGetCGprice(params) {
  return request({
    url: '/tSalOrder/MrpGetCGprice',
    method: 'get',
    params
  })
}
// 采购MRP转单
export function InsertPO(data) {
  return request({
    url: '/tSalOrder/InsertPO',
    method: 'post',
    data
  })
}
// 采购价格维护
export function queryPurPricePrice(data) {
  return request({
    url: '/tPurPricelist/queryPurPricePrice',
    method: 'post',
    data
  })
}
