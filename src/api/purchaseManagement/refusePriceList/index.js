import request from '@/utils/request'

// 查询审核未通过的采购价目表-分页
export function queryFailPurPriceList(data) {
  return request({
    url: '/tPurPricelist/queryFailPurPriceList',
    method: 'post',
    data
  })
}

// 采购价目表重新审核
export function updateAgainReview(data) {
  return request({
    url: '/tPurPricelist/updateAgainReview',
    method: 'put',
    data
  })
}
