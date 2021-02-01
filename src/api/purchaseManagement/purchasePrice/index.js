import request from '@/utils/request'

// 查询采购价目列表-分页
export function queryTPurPriceList(data) {
  return request({
    url: '/tPurPricelist/queryTPurPriceList',
    method: 'post',
    data
  })
}

// 查询采购价目明细
export function detailPriceList(params) {
  return request({
    url: '/tPurPricelistentry/queryTPurPriceDetailList',
    method: 'get',
    params
  })
}

// 采购价目表重新审核
export function updateNotReview(data) {
  return request({
    url: '/tPurPricelist/updateNotReview',
    method: 'put',
    data
  })
}

// 查询采购价目表日志、操作人
export function queryPricelistLog(data) {
  return request({
    url: '/TJxLog/queryPricelistLog',
    method: 'post',
    data
  })
}
