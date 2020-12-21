import request from '@/utils/request'

// 查询审核中的物料-分页
export function queryReviewMaterialList(data) {
  return request({
    url: '/tBdMaterial/queryReviewMaterialList',
    method: 'post',
    data
  })
}
