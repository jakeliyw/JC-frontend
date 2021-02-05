import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')

// 获取列表数据
export function queryBomFaterList(data) {
  return request({
    url: '/tEngBom/queryBomFaterList',
    method: 'post',
    data
  })
}
// 建BOM查询子类数据
export function queryBomSonList(data) {
  return request({
    url: '/tEngBom/queryBomSonList',
    method: 'post',
    data
  })
}
// 建BOM查询父类数据
export function queryMaterialfather(params) {
  return request({
    url: '/tBdMaterial/queryMaterialfather/',
    method: 'post',
    params
  })
}
// 查询子项类型列表
export function queryFmaterialtype(params) {
  return request({
    url: '/tMetaFormenumitem/queryFmaterialtype',
    method: 'get',
    params
  })
}
// 查询发料方式列表
export function queryFissuetype(params) {
  return request({
    url: '/tMetaFormenumitem/queryFissuetype',
    method: 'get',
    params
  })
}

// 弹窗选择子bom数据
export function queryMaterialSon(params) {
  return request({
    url: `/tBdMaterial/queryMaterialSon/`,
    method: 'get',
    params
  })
}

// 获取组织数据
export function queryTOrgOrganizationsL(params) {
  return request({
    url: '/tOrgOrganizationsL/queryTOrgOrganizationsL',
    method: 'get',
    params
  })
}

// 新建bom数据
export function insertBom(data) {
  data.fuserId = fuserId
  return request({
    url: '/tEngBom/insertBom',
    method: 'post',
    data
  })
}

