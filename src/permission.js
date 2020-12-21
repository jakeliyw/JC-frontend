import router from './router'
import store from '@/store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
const whiteList = ['/login', '/404'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    // 如果已经登录

    if (to.path === '/login') {
      next()
      NProgress.done() // 结束Progress
    } else if (!store.getters.roleName) {
      store.dispatch('GetInfo').then(() => {
        next({ ...to })
      })
    } else {
      next()
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    // 如果前往的路径是白名单内的,就可以直接前往
    next()
  } else {
    // 如果路径不是白名单内的,而且又没有登录,就跳转登录页面
    store.commit('RESET_USER')
    next('/login')
    NProgress.done() // 结束Progress
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
