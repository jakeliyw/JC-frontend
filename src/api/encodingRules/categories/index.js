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
export function querySerialTypeList(data) {
  return request({
    url: '/tJxSerialtype/querySerialTypeList',
    method: 'post',
    data
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
// 新增大类
export function insertLarge(data) {
  return request({
    url: '/tJxLargeitemtype/insertLarge',
    method: 'post',
    data
  })
}
// 新增中类
export function insertMediumType(data) {
  return request({
    url: '/tJxMediumitemtype/insertMediumType',
    method: 'post',
    data
  })
}
// 新增小类
export function insertSerialType(data) {
  return request({
    url: '/tJxSerialtype/insertSerialType',
    method: 'post',
    data
  })
}
// 新增属性
export function insertAttributeType(data) {
  return request({
    url: '/tJxAttributetype/insertAttributeType',
    method: 'post',
    data
  })
}
