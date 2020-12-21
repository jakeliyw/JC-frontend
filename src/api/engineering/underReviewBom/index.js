import request from '@/utils/request'

// 获取列表数据
export function queryReviewBomList(data) {
  return request({
    url: '/tEngBom/queryReviewBomList',
    method: 'post',
    data
  })
}
