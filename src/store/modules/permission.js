import { constantRouterMap, asyncRouterMap } from '@/router/index'

function hasPermission(menus, route) {
  if (route.menu) {
    /*
    * 如果这个路由有menu属性,就需要判断用户是否拥有此menu权限
    */
    return menus.indexOf(route.menu) > -1
  } else {
    return true
  }
}
// 异步路由和所有路由
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    // filter,js语法里数组的过滤筛选方法
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        // 如果这个路由下面还有下一级的话,就递归调用
        route.children = filterAsyncRouter(route.children, menus)
        // 如果过滤一圈后,没有子元素了,这个父级菜单就也不显示了
        return (route.children && route.children.length)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap, // 本用户所有的路由，包括固定的路由和下面的addRouters
    addRouters: [] // 本用户的角色赋予的新增的动态路由
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      // 将固定路由和新增路由进行合并，成为本用户最终的全部路由信息
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, res) {
      // 生成路由
      return new Promise(resolve => {
        const roleName = res.roleName
        const menus = res.menuList
        // 声明 该角色可用的路由
        let accessedRouters
        if (roleName === '超级管理员') {
          // 如果角色里包含'超级管理员',那么所有的路由都可以用
          // 其实管理员也拥有全部菜单,这里主要是利用角色判断,节省加载时间
          accessedRouters = asyncRouterMap
        } else {
          accessedRouters = filterAsyncRouter(asyncRouterMap, menus)
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
