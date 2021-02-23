import request from '@/utils/request'

// 查询客户列表 - 分页审核不通过
export function queryFailList(data) {
  return request({
    url: '/tBdCustomer/queryFailList',
    method: 'post',
    data
  })
}

// 客户重新审核
export function againReviewCustomer(data) {
  return request({
    url: '/tBdCustomer/againReviewCustomer',
    method: 'put',
    data
  })
}

// 修改客户
export function updateCustomer(data) {
  return request({
    url: '/tBdCustomer/updateCustomer',
    method: 'put',
    data
  })
}
