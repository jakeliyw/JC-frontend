import request from '@/utils/request'

// 查询采购调价列表-分页
export function queryTPurPatList(data) {
  return request({
    url: '/tPurPat/queryTPurPatList',
    method: 'post',
    data
  })
}
