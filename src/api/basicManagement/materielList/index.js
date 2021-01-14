import request from '@/utils/request'

// 查询物料列表-分页
export function queryTBdMaterialList(data) {
  return request({
    url: '/tBdMaterial/queryTBdMaterialList',
    method: 'post',
    data
  })
}
// 查询第一级物料组数据表
export function queryTJxLargeitemtypeGroup(params) {
  return request({
    url: '/tJxLargeitemtype/queryTJxLargeitemtypeGroup',
    method: 'get',
    params
  })
}

// 查询物料明细
export function queryMaterialDetail(params) {
  return request({
    url: '/tBdMaterial/queryMaterialDetail',
    method: 'get',
    params
  })
}

// 删除物料接口
export function deleteMaterial(params) {
  return request({
    url: '/tBdMaterial/deleteMaterial',
    method: 'delete',
    params
  })
}

// 查询物料日志、操作人
export function queryMaterialLog(data) {
  return request({
    url: '/TJxLog/queryMaterialLog',
    method: 'post',
    data
  })
}
