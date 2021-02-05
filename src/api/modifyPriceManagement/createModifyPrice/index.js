import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')
// 查询采购调价原因
export function queryFpareason(data) {
  return request({
    url: '/tBasAssistantdataentry/queryFpareason',
    method: 'post',
    data
  })
}

// 新增采购调价表
export function insertTPurPat(data) {
  data.fuserId = fuserId
  return request({
    url: '/tPurPat/insertTPurPat',
    method: 'post',
    data
  })
}

// 新增采购调价查询价目数据
export function queryTPurPatLs(data) {
  return request({
    url: '/tPurPat/queryTPurPatLs',
    method: 'post',
    data
  })
}

// 新增采购调价查询物料数据-分页
export function queryTPurPatLm(data) {
  return request({
    url: '/tPurPat/queryTPurPatLm',
    method: 'post',
    data
  })
}

