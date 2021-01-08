import request from '@/utils/request'

// 创建物料
export function insertMaterialDetail(data) {
  return request({
    url: '/tBdMaterial/insertMaterialDetail',
    method: 'post',
    data
  })
}

// 查询一级物料编码列表
export function queryOneMaterialNumber(params) {
  return request({
    url: '/tJxLargeitemtype/queryOneMaterialNumber',
    method: 'get',
    params
  })
}

// 查询二级物料编码列表
export function queryTwoMaterialNumber(data) {
  return request({
    url: '/tJxLargeitemtype/queryTwoMaterialNumber',
    method: 'post',
    data
  })
}

// 查询三级物料编码列表
export function queryThreeMaterialNumber(data) {
  return request({
    url: '/tJxLargeitemtype/queryThreeMaterialNumber',
    method: 'post',
    data
  })
}

// 查询创建、使用组织
export function queryTOrgOrganizationsL(params) {
  return request({
    url: '/tOrgOrganizationsL/queryTOrgOrganizationsL',
    method: 'get',
    params
  })
}

// 查询重量单位
export function queryFweightList(data) {
  return request({
    url: '/tBdUnit/queryFweightList',
    method: 'post',
    data
  })
}

// 查询尺寸单位
export function queryFvolumeList(data) {
  return request({
    url: '/tBdUnit/queryFvolumeList',
    method: 'post',
    data
  })
}

// 查询物料属性菜单
export function queryMaterialAttributes(params) {
  return request({
    url: '/tMetaFormenumitem/queryMaterialAttributes',
    method: 'get',
    params
  })
}

// 查询基本单位列表（不分页）
export function queryUnitList(params) {
  return request({
    url: '/tBdUnit/queryUnitList',
    method: 'get',
    params
  })
}

// 查询编码流水号
export function queryCoodingNumber(data) {
  return request({
    url: '/tJxLargeitemtype/queryCoodingNumber',
    method: 'post',
    data
  })
}

// 查询动态物料属性
export function queryMaterialAttribute(data) {
  return request({
    url: '/tJxLargeitemtype/queryMaterialAttribute',
    method: 'post',
    data
  })
}

// 修改时查询物料明细
export function queryMaterialDetail(params) {
  return request({
    url: '/tBdMaterial/queryMaterialParticulars',
    method: 'get',
    params
  })
}

// 更新物料
export function updateMaterialDetail(data) {
  return request({
    url: '/tBdMaterial/updateMaterialDetail',
    method: 'put',
    data
  })
}
