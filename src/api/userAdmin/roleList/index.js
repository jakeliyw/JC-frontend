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
