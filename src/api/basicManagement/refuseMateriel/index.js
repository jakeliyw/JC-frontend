import request from '@/utils/request'

// 查询审核未通过的物料-分页
export function queryFailMaterialList(data) {
  return request({
    url: '/tBdMaterial/queryFailMaterialList',
    method: 'post',
    data
  })
}

// 审核未通过的物料重新审核
export function updateMaterialAgainReview(data) {
  return request({
    url: '/tBdMaterial/updateMaterialAgainReview',
    method: 'put',
    data
  })
}
