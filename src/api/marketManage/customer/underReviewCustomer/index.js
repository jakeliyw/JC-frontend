import request from '@/utils/request'

// 查询客户列表 - 分页审核中
export function queryReviewList(data) {
  return request({
    url: '/tBdCustomer/queryReviewList',
    method: 'post',
    data
  })
}
