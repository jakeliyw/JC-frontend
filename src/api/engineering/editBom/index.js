import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')
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
  data.fuserId = fuserId
  return request({
    url: '/tEngBom/updateBom',
    method: 'put',
    data
  })
}

