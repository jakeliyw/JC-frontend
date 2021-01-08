import request from '@/utils/request'

// 查询菜单列表-分页
export function queryTJxQueryList(data) {
  return request({
    url: '/tJxQuery/queryTJxQueryList',
    method: 'post',
    data
  })
}
// 新增审核权限
export function insertTJxQuery(data) {
  return request({
    url: '/tJxQuery/insertTJxQuery',
    method: 'post',
    data
  })
}
// 修改审核权限
export function updayeTJxQuery(data) {
  return request({
    url: '/tJxQuery/updayeTJxQuery',
    method: 'put',
    data
  })
}
// 查询用户列表
export function querySecUser(params) {
  return request({
    url: '/tSecUser/querySecUser',
    method: 'get',
    params
  })
}
