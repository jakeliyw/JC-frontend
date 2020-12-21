import request from '@/utils/request'

// 查询采购价目列表-分页
export function queryTPurPriceList(data) {
  return request({
    url: '/tPurPricelistentry/queryTPurPriceList',
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
