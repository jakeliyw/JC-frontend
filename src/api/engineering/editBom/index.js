import request from '@/utils/request'

// 获取列表数据
export function queryBomchildList(params) {
  return request({
    url: '/tEngBom/queryBomchildList/',
    method: 'get',
    params
  })
}

// 修改BOM
export function upDateBom(data) {
  return request({
    url: '/tEngBom/updateBom',
    method: 'post',
    data
  })
}

// 查询BOM的操作人和日志
export function queryBomLog(data) {
  return request({
    url: '/tEngBom/queryBomLog',
    method: 'post',
    data
  })
}
