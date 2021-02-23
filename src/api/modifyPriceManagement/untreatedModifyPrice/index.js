import request from '@/utils/request'

// 查询还未处理采购调价表-分页
export function queryUntreatePurPatList(data) {
  return request({
    url: '/tPurPat/queryUntreatePurPatList',
    method: 'post',
    data
  })
}

// 未处理的调价表进行审核(研发,财务)
export function reviewPurPat(data) {
  return request({
    url: '/tPurPat/reviewPurPat',
    method: 'put',
    data
  })
}

// 采购调价表进行审核不通过
export function updateNotReview(data) {
  return request({
    url: '/tPurPat/updateNotReview',
    method: 'put',
    data
  })
}
