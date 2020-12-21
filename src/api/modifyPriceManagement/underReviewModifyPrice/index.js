import request from '@/utils/request'

// 查询审核中的采购调价表-分页
export function queryReviewPurPatList(data) {
  return request({
    url: '/tPurPat/queryReviewPurPatList',
    method: 'post',
    data
  })
}
