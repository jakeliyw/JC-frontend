import request from '@/utils/request'

const fuserId = window.sessionStorage.getItem('fuserId')
// 修改采购调价表
export function updateTPurPat(data) {
  data.fuserId = fuserId
  return request({
    url: '/tPurPat/updateTPurPat',
    method: 'put',
    data
  })
}
