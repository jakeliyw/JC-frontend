import request from '@/utils/request'

// 修改采购调价表
export function updateTPurPat(data) {
  return request({
    url: '/tPurPat/updateTPurPat',
    method: 'put',
    data
  })
}
