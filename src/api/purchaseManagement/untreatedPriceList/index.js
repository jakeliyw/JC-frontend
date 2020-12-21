import request from '@/utils/request'

// 查询还未处理采购价目表-分页
export function queryUntreatePurPriceList(data) {
  return request({
    url: '/tPurPricelist/queryUntreatePurPriceList',
    method: 'post',
    data
  })
}

// 未处理的价目表进行审核(研发,财务)
export function reviewPurPrice(data) {
  return request({
    url: '/tPurPricelist/reviewPurPrice',
    method: 'put',
    data
  })
}

// 采购价目表进行审核不通过
export function updateNotReview(data) {
  return request({
    url: '/tPurPricelist/updateNotReview',
    method: 'put',
    data
  })
}
