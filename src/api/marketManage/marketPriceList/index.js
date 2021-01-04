import request from '@/utils/request'

// 新增销售价目表
export function insertSalPrice(data) {
  return request({
    url: '/tSalPricelist/insertSalPrice',
    method: 'put',
    data
  })
}
// 查询销售价目列表-分页
export function querySalPriceList(data) {
  return request({
    url: '/tSalPricelist/querySalPriceList',
    method: 'post',
    data
  })
}
// 查询销售价目明细
export function querySalPriceNtry(params) {
  return request({
    url: '/tSalPricelist/querySalPriceNtry',
    method: 'get',
    params
  })
}
// 查询币别 - 分页
export function queryTBdCurrency(data) {
  return request({
    url: '/tBdCurrency/queryTBdCurrency',
    method: 'post',
    data
  })
}
// 还未处理的销售价目列表-分页
export function queryUntreatePriceList(data) {
  return request({
    url: '/tSalPricelist/queryUntreatePriceList',
    method: 'post',
    data
  })
}
// 审核中的销售价目列表-分页
export function queryReviewPriceList(data) {
  return request({
    url: '/tSalPricelist/queryReviewPriceList',
    method: 'post',
    data
  })
}
// 审核不通过的销售价目列表-分页
export function queryFailPriceList(data) {
  return request({
    url: '/tSalPricelist/queryFailPriceList',
    method: 'post',
    data
  })
}
// 销售价目重新审核(销售主管,财务)
export function againReviewPrice(data) {
  return request({
    url: '/tSalPricelist/againReviewPrice',
    method: 'put',
    data
  })
}
// 未处理销售价目审核(销售主管,财务)
export function reviewPrice(data) {
  return request({
    url: '/tSalPricelist/reviewPrice',
    method: 'put',
    data
  })
}
// 审核不通过销售价目审核(销售主管,财务)
export function notReviewPrice(data) {
  return request({
    url: '/tSalPricelist/notReviewPrice',
    method: 'put',
    data
  })
}
// 修改销售价目表
export function updateSalPrice(data) {
  return request({
    url: '/tSalPricelist/updateSalPrice',
    method: 'put',
    data
  })
}
