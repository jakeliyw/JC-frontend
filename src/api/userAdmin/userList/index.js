import request from '@/utils/request'

// 查询用户列表-分页
export function queryTEngBomList(data) {
  return request({
    url: '/tSecUser/queryTSecUserList',
    method: 'post',
    data
  })
}

// 禁用/解禁用户
export function updateUserDisable(data) {
  return request({
    url: '/tSecUser/updateUserDisable',
    method: 'put',
    data
  })
}
// 查询角色列表
export function queryRoleList(params) {
  return request({
    url: '/tJxRole/queryRoleList',
    method: 'get',
    params
  })
}
// 给用户分配角色
export function distributionRole(data) {
  return request({
    url: '/tJxAdminrole/distributionRole',
    method: 'post',
    data
  })
}
