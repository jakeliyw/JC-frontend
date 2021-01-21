import request from '@/utils/request'

export function queryCriteria(params) {
  return request({
    url: '/tBdMaterial/queryCriteria',
    method: 'get',
    params
  })
}
