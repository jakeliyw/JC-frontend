import request from '@/utils/request'

// 查询客户列表 - 分页未审核
export function queryUntreateList(data) {
  return request({
    url: '/tBdCustomer/queryUntreateList',
    method: 'post',
    data
  })
}

// 客户准备审核
export function reviewCustomer(data) {
  return request({
    url: '/tBdCustomer/reviewCustomer',
    method: 'put',
    data
  })
}

// 客户进行审核不通过
export function notReviewCustomer(data) {
  return request({
    url: '/tBdCustomer/notReviewCustomer',
    method: 'put',
    data
  })
}
