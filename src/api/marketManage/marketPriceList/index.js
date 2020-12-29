import request from '@/utils/request'

// 新增销售价目表
export function insertSalPrice(data) {
  return request({
    url: '/tSalOrder/insertSalPrice',
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
export function querySalPriceNtry(data) {
  return request({
    url: '/tSalPricelist/querySalPriceNtry',
    method: 'post',
    data
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
