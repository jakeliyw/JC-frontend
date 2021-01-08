import request from '@/utils/request'

// 查询小类组合列表-分页
export function querySerialList(data) {
  return request({
    url: '/tJxLargeitemtype/querySerialList',
    method: 'post',
    data
  })
}
