import request from '@/utils/request'

export function queryCriteria(params) {
  return request({
    url: '/tJxSearch/queryCriteria',
    method: 'get',
    params
  })
}
