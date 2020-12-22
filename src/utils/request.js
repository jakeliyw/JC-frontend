import axios from 'axios'
import { Message } from 'element-ui'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    // const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (response.data.code === 0) {
      return Promise.resolve(response.data)
    } else if (response.data.code === 2) {
      return Promise.resolve(response.data)
    } else if (response.data.code === 400) {
      router.replace({
        name: 'login'
      })
    } else if (response.data.code === 1) {
      return Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      return Message({
        message: response.data.message || '网络异常，请重新尝试',
        type: 'error',
        duration: 5 * 1000
      })
    }
  },
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 500:
          router.replace({
            name: 'login'
          })
          Message({
            message: '网络连接错误，请重新尝试！',
            type: 'error',
            duration: 5 * 1000
          })
          break
        case 404:
          Message({
            message: '网络请求不存在！',
            type: 'error',
            duration: 5 * 1000
          })
          break
        default:
          Message({
            message: error.response.data.message,
            type: 'error',
            duration: 5 * 1000
          })
      }
    }
    return Promise.reject(error.response)
  }
)

export default service
