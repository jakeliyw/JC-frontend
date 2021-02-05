import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')
// 获取列表数据
export function queryFailBomList(data) {
  return request({
    url: '/tEngBom/queryFailBomList',
    method: 'post',
    data
  })
}

// 审核未通过的BOM 重新审核
export function updateAgainReview(data) {
  data.fuserId = fuserId
  return request({
    url: '/tEngBom/updateAgainReview',
    method: 'put',
    data
  })
}
