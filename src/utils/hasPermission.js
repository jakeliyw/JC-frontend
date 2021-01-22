import store from '@/store'

export function hasPermission(permission) {
  const myPermissions = store.getters.permissionList
  return myPermissions.indexOf(permission) > -1
}
export function buttonList(permission) {
  const myPermiss = store.getters.permissionList
  return myPermiss.indexOf(permission) > -1
}
