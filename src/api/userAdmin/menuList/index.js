import request from '@/utils/request'

// 查询菜单列表-分页
export function queryTJxMenuList(data) {
  return request({
    url: '/tJxMenu/queryTJxMenuList',
    method: 'post',
    data
  })
}
