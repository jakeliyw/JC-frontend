import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')

// 查询还未处理物料-分页
export function queryUntreatedMaterialList(data) {
  data.fuserId = fuserId
  return request({
    url: '/tBdMaterial/queryUntreatedMaterialList',
    method: 'post',
    data
  })
}

// 未处理的物料进行审核
export function updateMaterialReview(data) {
  data.fuserId = fuserId
  return request({
    url: '/tBdMaterial/updateMaterialReview',
    method: 'put',
    data
  })
}

// 反审核
export function updateMaterialNotReview(data) {
  data.fuserId = fuserId
  return request({
    url: '/tBdMaterial/updateMaterialNotReview',
    method: 'put',
    data
  })
}
