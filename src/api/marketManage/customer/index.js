import request from '@/utils/request'

// 查询客户列表 - 分页(不分组织)
export function queryCustomerList(data) {
  return request({
    url: '/tBdCustomer/queryCustomerList',
    method: 'post',
    data
  })
}

// 查询客户类别
export function queryFcustType(params) {
  return request({
    url: '/tBasAssistantdataentry/queryFcustType',
    method: 'get',
    params
  })
}

// 国家列表
export function queryFcountryList(data) {
  return request({
    url: '/tBasAssistantdataentry/queryFcountryList',
    method: 'post',
    data
  })
}

// 查询客户分组
export function queryCustomerGroup(params) {
  return request({
    url: '/tBdCustomer/queryCustomerGroup',
    method: 'get',
    params
  })
}

// 查询税分类
export function queryftaxTypeList(params) {
  return request({
    url: '/tBasAssistantdataentry/queryftaxTypeList',
    method: 'get',
    params
  })
}

// 查询发票类型
export function queryFinvoiceType(params) {
  return request({
    url: '/tMetaFormenumitem/queryFinvoiceType',
    method: 'get',
    params
  })
}

// 查询结算方式 - 分页
export function querySettletype(data) {
  return request({
    url: '/tBdSettletype/querySettletype',
    method: 'post',
    data
  })
}
