import request from '@/utils/request'

// 查询默认税率列表
export function queryTBdTaxrate(params) {
  return request({
    url: '/tBdTaxrate/queryTBdTaxrate',
    method: 'get',
    params
  })
}

// 查询存货类型列表
export function queryTBdMaterialcategory(params) {
  return request({
    url: '/tBdMaterialcategory/queryTBdMaterialcategory',
    method: 'get',
    params
  })
}

// 查询物料的税分类
export function queryTBasAssistantdataentry(params) {
  return request({
    url: '/tBasAssistantdataentry/queryTBasAssistantdataentry',
    method: 'get',
    params
  })
}
