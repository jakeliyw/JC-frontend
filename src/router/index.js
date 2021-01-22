import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout框架 */
import Layout from '@/layout'

export const constantRouterMap = [
  {
    name: 'login',
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/mallHomepage',
    meta: { title: '商城', icon: 'el-icon-s-help' },
    children: [
      {
        path: '/',
        name: 'mallHomepage',
        component: () => import('@/views/mallHomepage/mallHomepage/index'),
        meta: { title: '商城首页' }
      },
      {
        path: '/productCategory',
        name: 'productCategory',
        component: () => import('@/views/mallHomepage/productCategory/index'),
        meta: { title: '产品类别' }
      },
      {
        path: '/shoppingCart',
        name: 'shoppingCart',
        component: () => import('@/views/mallHomepage/shoppingCart/index'),
        meta: { title: '购物车' }
      }
    ]
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/basic',
    component: Layout,
    name: 'Basic',
    meta: {
      title: '基础管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/createMateriel',
        name: 'CreateMateriel',
        component: () => import('@/views/basic/createMateriel'),
        meta: { title: '新增物料', noCache: false },
        menu: 'createMateriel'
      },
      {
        path: '/detailMateriel/:id',
        name: 'DetailMateriel',
        component: () => import('@/views/basic/detailMateriel'),
        meta: { title: '查询物料' },
        hidden: true,
        menu: 'detailMateriel'
      },
      {
        path: '/editMateriel',
        name: 'EditMateriel',
        component: () => import('@/views/basic/editMateriel'),
        meta: { title: '修改物料' },
        hidden: true,
        menu: 'editMateriel'
      },
      {
        path: '/untreatedMateriel',
        name: 'UntreatedMateriel',
        component: () => import('@/views/basic/untreatedMateriel'),
        meta: { title: '还未处理物料', noCache: false },
        menu: 'untreatedMateriel'
      },
      {
        path: '/underReviewMateriel',
        name: 'UnderReviewMateriel',
        component: () => import('@/views/basic/underReviewMateriel'),
        meta: { title: '审核中物料', noCache: false },
        menu: 'underReviewMateriel'
      },
      {
        path: '/refuseMateriel',
        name: 'RefuseMateriel',
        component: () => import('@/views/basic/refuseMateriel'),
        meta: { title: '审核未通过物料', noCache: false },
        menu: 'refuseMateriel'
      },
      {
        path: '/materielList',
        name: 'MaterielList',
        component: () => import('@/views/basic/materielList'),
        meta: { title: '物料列表', noCache: false },
        menu: 'materielList'
      },
      {
        path: '/encodingRules',
        component: () => import('@/views/basic/encodingRules'),
        name: 'EncodingRules',
        redirect: '/categories',
        meta: {
          title: '编码规则'
        },
        children: [
          {
            path: '/categories',
            name: 'Categories',
            component: () => import('@/views/basic/encodingRules/categories'),
            meta: { title: '编码配置' },
            menu: 'categories'
          },
          {
            path: '/codeComparative',
            name: 'CodeComparative',
            component: () => import('@/views/basic/encodingRules/codeComparative'),
            meta: { title: '编码规则' },
            menu: 'codeComparative'
          }
        ]
      }
    ]
  },
  {
    path: '/engineering',
    component: Layout,
    name: 'Engineering',
    meta: {
      title: 'BOM管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/createBom',
        name: 'CreateBom',
        component: () => import('@/views/engineering/createBom'),
        meta: { title: '新增BOM', noCache: false },
        menu: 'createBom'
      },
      {
        path: '/editBom/:FNUMBER',
        name: 'EditBom',
        component: () => import('@/views/engineering/editBom'),
        meta: { title: '修改BOM', noCache: false },
        hidden: true,
        menu: 'editBom'
      },
      {
        path: '/detailBom/:FNUMBER',
        name: 'DetailBom',
        component: () => import('@/views/engineering/detailBom'),
        meta: { title: '进入BOM' },
        hidden: true,
        menu: 'detailBom'
      },
      {
        path: '/untreatedBom',
        name: 'UntreatedBom',
        component: () => import('@/views/engineering/untreatedBom'),
        meta: { title: '还未处理BOM', noCache: false },
        menu: 'untreatedBom'
      },
      {
        path: '/underReviewBom',
        name: 'UnderReviewBom',
        component: () => import('@/views/engineering/underReviewBom'),
        meta: { title: '审核中BOM', noCache: false },
        menu: 'underReviewBom'
      },
      {
        path: '/refuseBom',
        name: 'RefuseBom',
        component: () => import('@/views/engineering/refuseBom'),
        meta: { title: '审核未通过BOM', noCache: false },
        menu: 'refuseBom'
      },
      {
        path: '/reportForm/:id',
        name: 'ReportForm',
        component: () => import('@/views/engineering/reportForm'),
        meta: { title: '查询报表' },
        hidden: true,
        menu: 'reportForm'
      },
      {
        path: '/listBom',
        name: 'ListBom',
        component: () => import('@/views/engineering/listBom'),
        meta: { title: 'BOM清单', noCache: false },
        menu: 'listBom'
      },
      {
        path: '/maintainPriceBom',
        name: 'MaintainPriceBom',
        component: () => import('@/views/engineering/maintainPriceBom'),
        meta: { title: 'BOM单价更新', noCache: false },
        menu: 'maintainPriceBom'
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/createMarkerOrder',
    name: 'Market',
    meta: {
      title: '销售管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/marketManage',
        redirect: '/createMarkerOrder',
        component: () => import('@/views/market/marketManage/index'),
        name: 'MarketManage',
        meta: {
          title: '销售订单'
        },
        children: [
          {
            path: '/createMarkerOrder',
            name: 'CreateMarkerOrder',
            component: () => import('@/views/market/marketManage/createMarkerOrder/index'),
            meta: { title: '新增销售订单' },
            menu: 'createMarkerOrder'
          },
          {
            path: '/marketParticulars/:id',
            name: 'MarketParticulars',
            component: () => import('@/views/market/marketManage/marketParticulars/index'),
            meta: { title: '查询销售订单' },
            menu: 'marketParticulars',
            hidden: true
          },
          {
            path: '/marketRevising/:id',
            name: 'marketRevising',
            component: () => import('@/views/market/marketManage/marketRevising/index'),
            meta: { title: '修改订单' },
            hidden: true,
            menu: 'marketRevising'
          },
          {
            path: '/marketUntreated',
            name: 'MarketUntreated',
            component: () => import('@/views/market/marketManage/marketUntreated/index'),
            meta: { title: '未处理订单' },
            menu: 'marketUntreated'
          },
          {
            path: '/marketAudit',
            name: 'MarketAudit',
            component: () => import('@/views/market/marketManage/marketAudit/index'),
            meta: { title: '审核中订单' },
            menu: 'marketAudit'
          },
          {
            path: '/marketNoPass',
            name: 'MarketNoPass',
            component: () => import('@/views/market/marketManage/marketNoPass/index'),
            meta: { title: '审核未通过订单' },
            menu: 'marketNoPass'
          },
          {
            path: '/marketOrder',
            name: 'MarketOrder',
            component: () => import('@/views/market/marketManage/marketOrder/index'),
            meta: { title: '销售订单列表' },
            menu: 'marketOrder'
          }
        ]
      },
      {
        path: '/salesPrice',
        name: 'SalesPrice',
        redirect: '/createMarketPrice',
        component: () => import('@/views/market/salesPrice/index'),
        meta: {
          title: '销售价目'
        },
        children: [
          {
            path: '/createMarketPrice',
            name: 'CreateMarketPrice',
            component: () => import('@/views/market/salesPrice/createMarketPrice/index'),
            meta: { title: '新增销售价目表' },
            menu: 'createMarketPrice'
          },
          {
            path: '/marketDetail/:id',
            name: 'marketDetail',
            component: () => import('@/views/market/salesPrice/marketDetail/index'),
            meta: { title: '销售价目明细' },
            hidden: true,
            menu: 'marketDetail'
          },
          {
            path: '/markedEdit/:id',
            name: 'MarkedEdit',
            component: () => import('@/views/market/salesPrice/markedEdit/index'),
            meta: { title: '修改价目' },
            hidden: true,
            menu: 'markedEdit'
          },
          {
            path: '/markedUntreated',
            name: 'MarkedUntreated',
            component: () => import('@/views/market/salesPrice/markedUntreated/index'),
            meta: { title: '未处理价目' },
            menu: 'markedUntreated'
          },
          {
            path: '/markedAudit',
            name: 'MarkedAudit',
            component: () => import('@/views/market/salesPrice/markedAudit/index'),
            meta: { title: '审核中价目' },
            menu: 'markedAudit'
          },
          {
            path: '/markedNoPass',
            name: 'MarkedNoPass',
            component: () => import('@/views/market/salesPrice/markedNoPass/index'),
            meta: { title: '审核未通过价目' },
            menu: 'markedNoPass'
          },
          {
            path: '/marketPriceList',
            name: 'MarketPriceList',
            component: () => import('@/views/market/salesPrice/marketPriceList/index'),
            meta: { title: '销售价目表' },
            menu: 'marketPriceList'
          }
        ]
      },
      {
        path: '/customer',
        redirect: '/createCustomer',
        component: () => import('@/views/market/customer/index'),
        name: 'Customer',
        meta: {
          title: '客户管理'
        },
        children: [
          {
            path: '/createCustomer',
            name: 'CreateCustomer',
            component: () => import('@/views/market/customer/createCustomer/index'),
            meta: { title: '新增客户' },
            menu: 'createCustomer'
          },
          {
            path: '/detailCustomer/:id',
            name: 'DetailCustomer',
            component: () => import('@/views/market/customer/detailCustomer/index'),
            meta: { title: '查询客户' },
            menu: 'detailCustomer',
            hidden: true
          },
          {
            path: '/editCustomer/:id',
            name: 'EditCustomer',
            component: () => import('@/views/market/customer/editCustomer/index'),
            meta: { title: '修改客户' },
            menu: 'editCustomer',
            hidden: true
          },
          {
            path: '/untreatedCustomer',
            name: 'UntreatedCustomer',
            component: () => import('@/views/market/customer/untreatedCustomer/index'),
            meta: { title: '未处理客户' },
            menu: 'untreatedCustomer'
          },
          {
            path: '/underReviewCustomer',
            name: 'UnderReviewCustomer',
            component: () => import('@/views/market/customer/underReviewCustomer/index'),
            meta: { title: '审核中客户' },
            menu: 'underReviewCustomer'
          },
          {
            path: '/refuseCustomer',
            name: 'RefuseCustomer',
            component: () => import('@/views/market/customer/refuseCustomer/index'),
            meta: { title: '审核未通过客户' },
            menu: 'refuseCustomer'
          },
          {
            path: '/customerList',
            name: 'CustomerList',
            component: () => import('@/views/market/customer/customerList/index'),
            meta: { title: '客户列表' },
            menu: 'createCustomer'
          }
        ]
      }
    ]
  },
  {
    path: '/purchasing ',
    component: Layout,
    name: 'Purchasing ',
    meta: {
      title: '采购管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/modifyPrice',
        name: 'ModifyPrice',
        component: () => import('@/views/purchasing/modifyPrice'),
        meta: {
          title: '调价表管理'
        },
        children: [
          {
            path: '/createModifyPrice',
            name: 'CreateModifyPrice',
            component: () => import('@/views/purchasing/modifyPrice/createModifyPrice'),
            meta: { title: '新增调价' },
            menu: 'createModifyPrice'
          },
          {
            path: '/editModifyPrice/:id',
            name: 'EditModifyPrice',
            component: () => import('@/views/purchasing/modifyPrice/editModifyPrice'),
            meta: { title: '修改调价' },
            menu: 'editModifyPrice',
            hidden: true
          },
          {
            path: '/detailModifyPrice/:id',
            name: 'DetailModifyPrice',
            component: () => import('@/views/purchasing/modifyPrice/detailModifyPrice'),
            meta: { title: '查询调价' },
            menu: 'detailModifyPrice',
            hidden: true
          },
          {
            path: '/untreatedModifyPrice',
            name: 'UntreatedModifyPrice',
            component: () => import('@/views/purchasing/modifyPrice/untreatedModifyPrice'),
            meta: { title: '未处理调价' },
            menu: 'untreatedModifyPrice'
          },
          {
            path: '/underReviewModifyPrice',
            name: 'UnderReviewModifyPrice',
            component: () => import('@/views/purchasing/modifyPrice/underReviewModifyPrice'),
            meta: { title: '审核中调价' },
            menu: 'underReviewModifyPrice'
          },
          {
            path: '/refuseModifyPrice',
            name: 'RefuseModifyPrice',
            component: () => import('@/views/purchasing/modifyPrice/refuseModifyPrice'),
            meta: { title: '审核不通过调价' },
            menu: 'refuseModifyPrice'
          },
          {
            path: '/modifyPriceList',
            name: 'ModifyPriceList',
            component: () => import('@/views/purchasing/modifyPrice/modifyPriceList'),
            meta: { title: '调价列表' },
            menu: 'modifyPriceList'
          }
        ]
      },
      {
        path: '/purchase',
        component: () => import('@/views/purchasing/purchase'),
        name: 'Purchase',
        meta: {
          title: '价目表管理',
          noCache: false
        },
        children: [
          {
            path: '/createPurchasePrice',
            name: 'CreatePurchasePrice',
            component: () => import('@/views/purchasing/purchase/createPurchasePrice'),
            meta: { title: '新增价目' },
            menu: 'createPurchasePrice'
          },
          {
            path: '/editPurchasePrice/:id',
            name: 'EditPurchasePrice',
            component: () => import('@/views/purchasing/purchase/editPurchasePrice'),
            meta: { title: '修改价目' },
            menu: 'editPurchasePrice',
            hidden: true
          },
          {
            path: '/detailPurchasePrice/:id',
            name: 'DetailPurchasePrice',
            component: () => import('@/views/purchasing/purchase/detailPurchasePrice'),
            meta: { title: '查询价目' },
            hidden: true,
            menu: 'detailPurchasePrice'
          },
          {
            path: '/untreatedPriceList',
            name: 'UntreatedPriceList',
            component: () => import('@/views/purchasing/purchase/untreatedPriceList'),
            meta: { title: '还未处理价目' },
            menu: 'untreatedPriceList'
          },
          {
            path: '/underReviewPrice',
            name: 'UnderReviewPrice',
            component: () => import('@/views/purchasing/purchase/underReviewPrice'),
            meta: { title: '审核中价目' },
            menu: 'underReviewPrice'
          },
          {
            path: '/refusePriceList',
            name: 'RefusePriceList',
            component: () => import('@/views/purchasing/purchase/refusePriceList'),
            meta: { title: '审核未通过价目' },
            menu: 'refusePriceList'
          },
          {
            path: '/purchasePriceList',
            name: 'PurchasePriceList',
            component: () => import('@/views/purchasing/purchase/purchasePriceList'),
            meta: { title: '价目列表' },
            menu: 'purchasePriceList'
          }
        ]
      },
      {
        path: '/procurement',
        name: 'Procurement',
        component: () => import('@/views/purchasing/procurement/index'),
        meta: { title: '采购拆单', noCache: false },
        menu: 'procurement'
      }
    ]
  },
  {
    path: '/userRights',
    component: Layout,
    name: 'UserRights',
    meta: {
      title: '用户权限',
      icon: 'nested'
    },
    children: [
      {
        path: '/userList',
        name: 'UserList',
        component: () => import('@/views/userRights/userList/index'),
        meta: { title: '用户列表' },
        menu: 'userList'
      },
      {
        path: '/roleList',
        name: 'RoleList',
        component: () => import('@/views/userRights/roleList/index'),
        meta: { title: '权限管理' },
        menu: 'roleList'
      },
      {
        path: '/menuList',
        name: 'MenuList',
        component: () => import('@/views/userRights/menuList/index'),
        meta: { title: '菜单列表' },
        menu: 'menuList'
      },
      {
        path: '/juisdictionList',
        name: 'JuisdictionList',
        component: () => import('@/views/userRights/jurisdictionList/index'),
        meta: { title: '审核权限列表' },
        menu: 'juisdictionList'
      }
    ]
  },
  {
    path: '/production',
    component: Layout,
    name: 'Production',
    meta: {
      title: '生产管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/mrpView ',
        name: 'MrpView ',
        component: () => import('@/views/production/mrpView/index'),
        meta: { title: '生产拆单' },
        menu: 'mrpView'
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
