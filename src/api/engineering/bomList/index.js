import request from '@/utils/request'

// 获取列表数据
export function queryBomList(data) {
  return request({
    url: '/tEngBom/queryTEngBomList',
    method: 'post',
    data
  })
}
