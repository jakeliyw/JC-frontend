import request from '@/utils/request'

// 查询还未处理物料-分页
export function queryUntreatedMaterialList(data) {
  return request({
    url: '/tBdMaterial/queryUntreatedMaterialList',
    method: 'post',
    data
  })
}

// 未处理的物料进行审核
export function updateMaterialReview(data) {
  return request({
    url: '/tBdMaterial/updateMaterialReview',
    method: 'put',
    data
  })
}

// 反审核
export function updateMaterialNotReview(data) {
  return request({
    url: '/tBdMaterial/updateMaterialNotReview',
    method: 'put',
    data
  })
}
