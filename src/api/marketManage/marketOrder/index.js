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
    method: 'get',
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
// 查询单据类型
export function queryOrgList(params) {
  return request({
    url: '/tOrgOrganizationsL/queryOrgList',
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
// 查询销售订单本位币和汇率类型
export function querySalOrderFxxchange(data) {
  return request({
    url: '/tSalOrder/queryFxxchange',
    method: 'post',
    data
  })
}
// 查询销售订单税率
export function querySalerRate(data) {
  return request({
    url: '/tBdRate/querySalerRate',
    method: 'post',
    data
  })
}
// 查询物料列表(销售订单)
export function querySalMaterialList(data) {
  return request({
    url: '/tSalPricelistentry/querySalMaterialList',
    method: 'post',
    data
  })
}
// 查询物料列表(销售价目)
export function queryMaterialList(data) {
  return request({
    url: '/tBdMaterial/queryMaterialList',
    method: 'post',
    data
  })
}
// 查询还未处理的销售订单列表-分页
export function queryUntreateSalorderList(data) {
  return request({
    url: '/tSalOrder/queryUntreateSalorderList',
    method: 'post',
    data
  })
}
// 审核中的销售订单列表-分页
export function queryReviewSalorderList(data) {
  return request({
    url: '/tSalOrder/queryReviewSalorderList',
    method: 'post',
    data
  })
}
// 审核未通过的销售订单-分页
export function queryFailSalorderList(data) {
  return request({
    url: '/tSalOrder/queryFailSalorderList',
    method: 'post',
    data
  })
}
// 未处理的销售订单进行审核
export function reviewSalorder(data) {
  return request({
    url: '/tSalOrder/reviewSalorder',
    method: 'put',
    data
  })
}
// 未处理的审核不通过
export function notReviewSalorder(data) {
  return request({
    url: '/tSalOrder/notReviewSalorder',
    method: 'put',
    data
  })
}
// 重新审核
export function againReviewSalorder(data) {
  return request({
    url: '/tSalOrder/againReviewSalorder',
    method: 'put',
    data
  })
}
// 修改销售订单
export function updateSalOrder(data) {
  return request({
    url: '/tSalOrder/updateSalOrder',
    method: 'put',
    data
  })
}
// 根据客户查询销售价目名称
export function querySalPriceCustomer(params) {
  return request({
    url: '/tSalPricelist/querySalPriceCustomer',
    method: 'get',
    params
  })
}
// 查询销售订单日志、操作人
export function querySalOrderLog(data) {
  return request({
    url: '/TJxLog/querySalOrderLog',
    method: 'post',
    data
  })
}
