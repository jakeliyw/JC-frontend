import request from '@/utils/request'

export function MrpInfo(params) {
  return request({
    url: '/tSalOrder/MrpInfo',
    method: 'get',
    params
  })
}
