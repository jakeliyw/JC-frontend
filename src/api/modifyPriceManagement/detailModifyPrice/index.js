import request from '@/utils/request'

// 查询采购调价明细(需要传分页)-分页
export function queryTPurPatDetailList(params) {
  return request({
    url: '/tPurPat/queryTPurPatDetailList',
    method: 'get',
    params
  })
}
