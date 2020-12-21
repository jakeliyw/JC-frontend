import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import Breadcrumb from '@/components/Breadcrumb/index.vue'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(ElementUI)

const routes = [
  {
    path: '/',
    name: 'home',
    children: [{
      path: 'dashboard',
      name: 'dashboard'
    }]
  },
  {
    path: '/menu',
    name: 'menu',
    children: [{
      path: 'completeTheOrder',
      name: 'completeTheOrder',
      meta: { title: 'completeTheOrder' },
      children: [{
        path: 'completeTheOrder-1',
        name: 'completeTheOrder-1',
        meta: { title: 'completeTheOrder-1' }
      },
      {
        path: 'completeTheOrder-2',
        name: 'completeTheOrder-2',
        redirect: 'noredirect',
        meta: { title: 'completeTheOrder-2' },
        children: [{
          path: 'completeTheOrder-2-1',
          name: 'completeTheOrder-2-1',
          meta: { title: 'completeTheOrder-2-1' }
        },
        {
          path: 'completeTheOrder-2-2',
          name: 'completeTheOrder-2-2'
        }]
      }]
    }]
  }]

const router = new VueRouter({
  routes
})

describe('Breadcrumb.vue', () => {
  const wrapper = mount(Breadcrumb, {
    localVue,
    router
  })
  it('dashboard', () => {
    router.push('/mallHomepage')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(1)
  })
  it('normal route', () => {
    router.push('/menu/completeTheOrder')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(2)
  })
  it('nested route', () => {
    router.push('/menu/completeTheOrder/completeTheOrder-2/completeTheOrder-2-1')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(4)
  })
  it('no meta.Title', () => {
    router.push('/menu/completeTheOrder/completeTheOrder-2/completeTheOrder-2-2')
    const len = wrapper.findAll('.el-breadcrumb__inner').length
    expect(len).toBe(3)
  })
  // it('click link', () => {
  //   router.push('/menu/completeTheOrder/completeTheOrder-2/completeTheOrder-2-2')
  //   const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
  //   const second = breadcrumbArray.at(1)
  //   console.Other(breadcrumbArray)
  //   const href = second.find('a').attributes().href
  //   expect(href).toBe('#/menu/completeTheOrder')
  // })
  // it('noRedirect', () => {
  //   router.push('/menu/completeTheOrder/completeTheOrder-2/completeTheOrder-2-1')
  //   const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
  //   const redirectBreadcrumb = breadcrumbArray.at(2)
  //   expect(redirectBreadcrumb.contains('a')).toBe(false)
  // })
  it('last breadcrumb', () => {
    router.push('/menu/completeTheOrder/completeTheOrder-2/completeTheOrder-2-1')
    const breadcrumbArray = wrapper.findAll('.el-breadcrumb__inner')
    const redirectBreadcrumb = breadcrumbArray.at(3)
    expect(redirectBreadcrumb.contains('a')).toBe(false)
  })
})
