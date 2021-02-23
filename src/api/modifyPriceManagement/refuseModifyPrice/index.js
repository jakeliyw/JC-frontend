import request from '@/utils/request'

// 查询审核未通过的采购调价表-分页
export function queryFailPurPatList(data) {
  return request({
    url: '/tPurPat/queryFailPurPatList',
    method: 'post',
    data
  })
}

// 采购调价表重新审核
export function updateAgainReview(data) {
  return request({
    url: '/tPurPat/updateAgainReview',
    method: 'put',
    data
  })
}
