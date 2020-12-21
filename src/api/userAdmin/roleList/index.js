import request from '@/utils/request'

// 查询角色列表-分页
export function queryTJxRoleList(data) {
  return request({
    url: '/tJxRole/queryTJxRoleList',
    method: 'post',
    data
  })
}
