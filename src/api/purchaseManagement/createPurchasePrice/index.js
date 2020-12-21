import request from '@/utils/request'

// 查询价目表对象
export function queryFpriceobject(params) {
  return request({
    url: '/tMetaFormenumitem/queryFpriceobject',
    method: 'get',
    params
  })
}

// 查询价格类型
export function queryFpricetype(params) {
  return request({
    url: '/tMetaFormenumitem/queryFpricetype',
    method: 'get',
    params
  })
}

// 查询币别列表
export function queryTBdCurrency(data) {
  return request({
    url: '/tBdCurrency/queryTBdCurrency',
    method: 'post',
    data
  })
}

// 查询供应商列表
export function queryTBdSupplier(data) {
  return request({
    url: '/tBdSupplier/queryTBdSupplier',
    method: 'post',
    data
  })
}

// 查询供应商税率
export function queryTBdTaxrate(data) {
  return request({
    url: '/tBdTaxrate/queryTBdTaxrate',
    method: 'post',
    data
  })
}

// 新增采购价目表
export function insertPurPrice(data) {
  return request({
    url: '/tPurPricelist/insertPurPrice',
    method: 'post',
    data
  })
}

// 修改采购价目表
export function updatePurPrice(data) {
  return request({
    url: '/tPurPricelist/updatePurPrice',
    method: 'put',
    data
  })
}
