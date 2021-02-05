import request from '@/utils/request'

export function getPriceList(params) {
  return request({
    url: '/tSalOrder/GetPriceList',
    method: 'get',
    params
  })
}
