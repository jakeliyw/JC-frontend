import request from '@/utils/request'

// 销售订单
export function queryTSalOrderList(data) {
  return request({
    url: '/tSalOrder/queryTSalOrderList',
    method: 'post',
    data
  })
}
// 销售订单详情
export function queryTSalOrderNtry(params) {
  return request({
    url: '/tSalOrder/queryTSalOrderNtry',
    method: 'post',
    params
  })
}
// 新增销售订单
export function insertSalOrder(data) {
  return request({
    url: '/tSalOrder/insertSalOrder',
    method: 'put',
    data
  })
}
// 查询单据类型
export function queryTBasBilltype(params) {
  return request({
    url: '/tBasBilltype/queryTBasBilltype',
    method: 'get',
    params
  })
}
// 查询结算币别- 分页
export function queryTBdCurrency(data) {
  return request({
    url: '/tBdCurrency/queryTBdCurrency',
    method: 'post',
    data
  })
}
// 查询交货方式 - 分页
export function queryFheadDelivery(data) {
  return request({
    url: '/tBasAssistantdataentry/queryFheadDelivery',
    method: 'post',
    data
  })
}
// 查询客户列表-分页
export function queryTBdCustomerList(data) {
  return request({
    url: '/tBdCustomer/queryTBdCustomerList',
    method: 'post',
    data
  })
}
// 查询销售订单收款条件-分页
export function querytReccondition(data) {
  return request({
    url: '/tBdReccondition/querytReccondition',
    method: 'post',
    data
  })
}
// 查询销售订单销售员 - 分页
export function querySalesperson(data) {
  return request({
    url: '/tBdDepartment/querySalesperson',
    method: 'post',
    data
  })
}
// 查询品质标准
export function queryFpaezCombo(params) {
  return request({
    url: '/tMetaFormenumitem/queryFpaezCombo',
    method: 'get',
    params
  })
}
