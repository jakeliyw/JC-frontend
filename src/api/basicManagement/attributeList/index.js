import request from '@/utils/request'

// 查询物料属性列表(分页)
export function queryAttributeList(data) {
  return request({
    url: '/tJxLargeitemtype/queryAttributeList',
    method: 'post',
    data
  })
}
