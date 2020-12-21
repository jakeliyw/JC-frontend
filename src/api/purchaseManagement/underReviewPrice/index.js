import request from '@/utils/request'

// 查询审核未通过的采购价目表-分页
export function updateNotReview(data) {
  return request({
    url: '/tPurPricelist/updateNotReview',
    method: 'put',
    data
  })
}

// 查询审核中的采购价目表-分页
export function queryReviewPurPriceList(data) {
  return request({
    url: '/tPurPricelist/queryReviewPurPriceList',
    method: 'post',
    data
  })
}
