import request from '@/utils/request'

// 获取列表数据
export function queryUntreatedBomList(data) {
  return request({
    url: '/tEngBom/queryUntreatedBomList',
    method: 'post',
    data
  })
}

// 未处理的BOM进行审核
export function updateReview(data) {
  return request({
    url: '/tEngBom/updateReview',
    method: 'put',
    data
  })
}

// 未处理的BOM进行审核不通过
export function updateNotReview(data) {
  return request({
    url: '/tEngBom/updateNotReview',
    method: 'put',
    data
  })
}
