import request from '@/utils/request'

// 查询客户详情
export function queryCustomerDetails(params) {
  return request({
    url: '/tBdCustomer/queryCustomerDetails',
    method: 'get',
    params
  })
}
