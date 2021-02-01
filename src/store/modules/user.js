import { login, logout, getInfo } from '@/api/user'
import { setToken } from '@/utils/auth'
import store from '@/store'
import resetRouter from '@/router'

const user = {
  state: {
    userName: '',
    avatar: 'https://s3.ax1x.com/2020/11/19/DuAbbd.jpg',
    roleName: '',
    fuserId: '',
    permissionList: [],
    menuList: []
  },
  mutations: {
    SET_USER: (state, userInfo) => {
      state.userName = userInfo.userName
      state.roleName = userInfo.roleName
      state.menuList = userInfo.menuList
      state.permissionList = userInfo.buttonList
    },
    RESET_USER: (state) => {
      state.userName = ''
      state.roleName = ''
      state.menuList = []
      // 权限
      state.permissionList = []
    }
  },
  actions: {
    // user login
    login({ commit, state }, loginForm) {
      const { userName, password } = loginForm
      return new Promise((resolve, reject) => {
        login({ userName: userName.trim(), password: password }).then(data => {
          setToken()
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user info
    async GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const fuserId = window.sessionStorage.getItem('fuserId')
        getInfo({ fuserId }).then(res => {
          if (!res) {
            return
          }
          commit('SET_USER', res.data)
          store.dispatch('GenerateRoutes', res.data).then(() => {
            // 生成该用户的新路由json操作完毕之后，调用vue-router的动态新增路由方法，将新路由添加
            resetRouter.addRoutes(store.getters.addRouters)
          })
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // user logout
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout().then(data => {
          commit('RESET_USER')
          resolve(data)
        }).catch(() => {
          commit('RESET_USER')
        })
      })
    }
  }
}

export default user

