import request from '@/utils/request'

// 查询客户列表 - 分页(不分组织)
export function queryCustomerList(data) {
  return request({
    url: '/tBdCustomer/queryCustomerList',
    method: 'post',
    data
  })
}
