import request from '@/utils/request'

// 获取大类列表数据
export function queryLargeTypeList(data) {
  return request({
    url: '/tJxLargeitemtype/queryLargeTypeList',
    method: 'post',
    data
  })
}
// 获取中类列表数据
export function queryTwoMaterialNumbert(params) {
  return request({
    url: '/tJxMediumitemtype/queryMaterialList',
    method: 'get',
    params
  })
}
// 获取小类组合列表数据
export function querySerialTypeList(params) {
  return request({
    url: '/tJxSerialtype/querySerialTypeList',
    method: 'get',
    params
  })
}
// 获取物料属性列表数据
export function queryAttributeTypeList(params) {
  return request({
    url: '/tJxAttributetype/queryAttributeTypeList',
    method: 'get',
    params
  })
}
