import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')
// 查询客户列表 - 分页审核不通过
export function queryFailList(data) {
  data.fuserId = fuserId
  return request({
    url: '/tBdCustomer/queryFailList',
    method: 'post',
    data
  })
}

// 客户重新审核
export function againReviewCustomer(data) {
  data.fuserId = fuserId
  return request({
    url: '/tBdCustomer/againReviewCustomer',
    method: 'put',
    data
  })
}

// 修改客户
export function updateCustomer(data) {
  data.fuserId = fuserId
  return request({
    url: '/tBdCustomer/updateCustomer',
    method: 'put',
    data
  })
}
