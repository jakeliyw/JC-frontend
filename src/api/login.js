import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/log/queryLogin',
    method: 'post',
    data
  })
}
