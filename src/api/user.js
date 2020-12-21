import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/log/queryLogin',
    method: 'post',
    data
  })
}

// 获取权限
export function getInfo() {
  return request({
    url: '/tSecUser/getInfo',
    method: 'get'
  })
}

// 登出
export function logout() {
  return request({
    url: '/log/logout',
    method: 'get'
  })
}
