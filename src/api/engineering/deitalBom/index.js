import request from '@/utils/request'

// 查询BOM详情信息(父类和子项)
export function queryBomchildList(params) {
  return request({
    url: '/tEngBom/queryBomchildList',
    method: 'get',
    params
  })
}

// 进入BOM判断BOM详情和物料主数据
export function queryFtypeInfo(params) {
  return request({
    url: '/tEngBom/queryFtypeInfo',
    method: 'get',
    params
  })
}

// 查询BOM的操作人和日志
export function queryBomLog(data) {
  return request({
    url: '/TJxLog/queryBomLog',
    method: 'post',
    data
  })
}
