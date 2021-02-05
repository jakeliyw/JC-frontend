import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')
// 获取列表数据
export function queryUntreatedBomList(data) {
  data.fuserId = fuserId
  return request({
    url: '/tEngBom/queryUntreatedBomList',
    method: 'post',
    data
  })
}

// 未处理的BOM进行审核
export function updateReview(data) {
  data.fuserId = fuserId
  return request({
    url: '/tEngBom/updateReview',
    method: 'put',
    data
  })
}

// 未处理的BOM进行审核不通过
export function updateNotReview(data) {
  data.fuserId = fuserId
  return request({
    url: '/tEngBom/updateNotReview',
    method: 'put',
    data
  })
}
