import request from '@/utils/request'

// 查询角色列表-分页
export function queryTJxRoleList(data) {
  return request({
    url: '/tJxRole/queryTJxRoleList',
    method: 'post',
    data
  })
}
// 查询权限关联
export function queryRoleMeun(params) {
  return request({
    url: '/tJxRole/queryRoleMeun',
    method: 'get',
    params
  })
}
// 新增角色
export function inserRole(data) {
  return request({
    url: '/tJxRole/inserRole',
    method: 'post',
    data
  })
}
// 更新权限管理
export function updateRoleMeun(data) {
  return request({
    url: '/tJxRole/updateRoleMeun',
    method: 'put',
    data
  })
}
// 删除角色
export function deleteRole(params) {
  return request({
    url: '/tJxRole/deleteRole',
    method: 'delete',
    params
  })
}
