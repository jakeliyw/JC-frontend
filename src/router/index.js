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
    path: '/engineering',
    component: Layout,
    redirect: '/engineering/detailedListBom',
    name: 'customerManagement',
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
        menu: 'UnderReviewBom'
      },
      {
        path: '/refuseBom',
        name: 'RefuseBom',
        component: () => import('@/views/engineering/refuseBom'),
        meta: { title: '审核未通过BOM', noCache: false },
        menu: 'RefuseBom'
      },
      {
        path: '/listBom',
        name: 'ListBom',
        component: () => import('@/views/engineering/listBom'),
        meta: { title: 'BOM清单', noCache: false },
        menu: 'listBom'
      }
    ]
  },
  {
    path: '/basicManagement',
    component: Layout,
    redirect: '/basicManagement',
    name: 'BasicManagement',
    meta: {
      title: '基础管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/createMateriel',
        name: 'CreateMateriel',
        component: () => import('@/views/basicManagement/createMateriel'),
        meta: { title: '新增物料', noCache: false },
        menu: 'createMateriel'
      },
      {
        path: '/queryMateriel/:id',
        name: 'QueryMateriel',
        component: () => import('@/views/basicManagement/queryMateriel'),
        meta: { title: '查询物料' },
        hidden: true,
        menu: 'queryMateriel'
      },
      {
        path: '/untreatedMateriel',
        name: 'UntreatedMateriel',
        component: () => import('@/views/basicManagement/untreatedMateriel'),
        meta: { title: '还未处理物料', noCache: false },
        menu: 'untreatedMateriel'
      },
      {
        path: '/underReviewMateriel',
        name: 'UnderReviewMateriel',
        component: () => import('@/views/basicManagement/underReviewMateriel'),
        meta: { title: '审核中物料', noCache: false },
        menu: 'underReviewMateriel'
      },
      {
        path: '/refuseMateriel',
        name: 'RefuseMateriel',
        component: () => import('@/views/basicManagement/refuseMateriel'),
        meta: { title: '审核未通过物料', noCache: false },
        menu: 'refuseMateriel'
      },
      {
        path: '/materielList',
        name: 'MaterielList',
        component: () => import('@/views/basicManagement/materielList'),
        meta: { title: '物料列表', noCache: false },
        menu: 'materielList'
      }
    ]
  },
  {
    path: '/purchaseManagement',
    component: Layout,
    redirect: '/purchaseManagement',
    name: 'PurchaseManagement',
    meta: {
      title: '价目表管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/createPurchasePrice',
        name: 'CreatePurchasePrice',
        component: () => import('@/views/purchaseManagement/createPurchasePrice'),
        meta: { title: '新增价目', noCache: false },
        menu: 'createPurchasePrice'
      },
      {
        path: '/editPurchasePrice/:id',
        name: 'EditPurchasePrice',
        component: () => import('@/views/purchaseManagement/editPurchasePrice'),
        meta: { title: '修改价目', noCache: false },
        menu: 'editPurchasePrice',
        hidden: true
      },
      {
        path: '/detailPurchasePrice/:id',
        name: 'DetailPurchasePrice',
        component: () => import('@/views/purchaseManagement/detailPurchasePrice'),
        meta: { title: '详情价目' },
        hidden: true,
        menu: 'detailPurchasePrice'
      },
      {
        path: '/untreatedPriceList',
        name: 'UntreatedPriceList',
        component: () => import('@/views/purchaseManagement/untreatedPriceList'),
        meta: { title: '还未处理价目', noCache: false },
        menu: 'untreatedPriceList'
      },
      {
        path: '/underReviewPrice',
        name: 'UnderReviewPrice',
        component: () => import('@/views/purchaseManagement/underReviewPrice'),
        meta: { title: '审核中价目', noCache: false },
        menu: 'underReviewPrice'
      },
      {
        path: '/refusePriceList',
        name: 'RefusePriceList',
        component: () => import('@/views/purchaseManagement/refusePriceList'),
        meta: { title: '审核未通过价目', noCache: false },
        menu: 'refusePriceList'
      },
      {
        path: '/purchasePriceList',
        name: 'PurchasePriceList',
        component: () => import('@/views/purchaseManagement/purchasePriceList'),
        meta: { title: '价目列表', noCache: false },
        menu: 'purchasePriceList'
      }
    ]
  },
  {
    path: '/modifyPriceManagement',
    component: Layout,
    redirect: '/modifyPriceManagement',
    name: 'ModifyPriceManagement',
    meta: {
      title: '调价表管理',
      icon: 'nested'
    },
    children: [
      {
        path: '/createModifyPrice',
        name: 'CreateModifyPrice',
        component: () => import('@/views/modifyPriceManagement/createModifyPrice'),
        meta: { title: '新增调价', noCache: false },
        menu: 'createModifyPrice'
      },
      {
        path: '/editModifyPrice/:id',
        name: 'EditModifyPrice',
        component: () => import('@/views/modifyPriceManagement/editModifyPrice'),
        meta: { title: '修改调价', noCache: false },
        menu: 'editModifyPrice',
        hidden: true
      },
      {
        path: '/detailModifyPrice/:id',
        name: 'DetailModifyPrice',
        component: () => import('@/views/modifyPriceManagement/detailModifyPrice'),
        meta: { title: '详情调价', noCache: false },
        menu: 'detailModifyPrice',
        hidden: true
      },
      {
        path: '/untreatedModifyPrice',
        name: 'UntreatedModifyPrice',
        component: () => import('@/views/modifyPriceManagement/untreatedModifyPrice'),
        meta: { title: '未处理调价', noCache: false },
        menu: 'untreatedModifyPrice'
      },
      {
        path: '/underReviewModifyPrice',
        name: 'UnderReviewModifyPrice',
        component: () => import('@/views/modifyPriceManagement/underReviewModifyPrice'),
        meta: { title: '审核中调价', noCache: false },
        menu: 'underReviewModifyPrice'
      },
      {
        path: '/refuseModifyPrice',
        name: 'RefuseModifyPrice',
        component: () => import('@/views/modifyPriceManagement/refuseModifyPrice'),
        meta: { title: '审核不通过调价', noCache: false },
        menu: 'refuseModifyPrice'
      },
      {
        path: '/modifyPriceList',
        name: 'ModifyPriceList',
        component: () => import('@/views/modifyPriceManagement/modifyPriceList'),
        meta: { title: '调价列表', noCache: false },
        menu: 'modifyPriceList'
      }
    ]
  },
  {
    path: '/userRights',
    component: Layout,
    redirect: '/userRights',
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
      }
    ]
  },
  {
    path: '/encodingRules',
    component: Layout,
    redirect: '/encodingRules',
    name: 'EncodingRules',
    meta: {
      title: '编码规则',
      icon: 'nested'
    },
    children: [
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('@/views/encodingRules/categories/index'),
        meta: { title: '编码配置' },
        menu: 'userList'
      },
      {
        path: '/codeComparative',
        name: 'CodeComparative',
        component: () => import('@/views/encodingRules/codeComparative/index'),
        meta: { title: '编码规则' },
        menu: 'userList'
      }
    ]
  },
  {
    path: '/market',
    component: Layout,
    redirect: '/createMarkerOrder',
    name: 'MarketManage',
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
            meta: { title: '新增销售订单' }
          },
          {
            path: '/marketParticulars/:id',
            name: 'MarketParticulars',
            component: () => import('@/views/market/marketManage/marketParticulars/index'),
            meta: { title: '销售订单详情' },
            hidden: true
          },
          {
            path: '/marketUntreated',
            name: 'MarketUntreated',
            component: () => import('@/views/market/marketManage/marketUntreated/index'),
            meta: { title: '未处理订单' }
          },
          {
            path: '/marketAudit',
            name: 'MarketAudit',
            component: () => import('@/views/market/marketManage/marketAudit/index'),
            meta: { title: '审核中订单' }
          },
          {
            path: '/marketNoPass',
            name: 'MarketNoPass',
            component: () => import('@/views/market/marketManage/marketNoPass/index'),
            meta: { title: '审核未通过订单' }
          },
          {
            path: '/marketOrder',
            name: 'MarketOrder',
            component: () => import('@/views/market/marketManage/marketOrder/index'),
            meta: { title: '销售订单列表' }
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
            menu: 'userList'
          },
          {
            path: '/marketDetail/:id',
            name: 'marketDetail',
            component: () => import('@/views/market/salesPrice/marketDetail/index'),
            meta: { title: '销售价目明细' },
            hidden: true,
            menu: 'userList'
          },
          {
            path: '/markedUntreated',
            name: 'MarkedUntreated',
            component: () => import('@/views/market/salesPrice/markedUntreated/index'),
            meta: { title: '未处理价目' },
            menu: 'userList'
          },
          {
            path: '/markedAudit',
            name: 'MarkedAudit',
            component: () => import('@/views/market/salesPrice/markedAudit/index'),
            meta: { title: '审核中价目' },
            menu: 'userList'
          },
          {
            path: '/markedNoPass',
            name: 'MarkedNoPass',
            component: () => import('@/views/market/salesPrice/markedNoPass/index'),
            meta: { title: '审核未通过价目' },
            menu: 'userList'
          },
          {
            path: '/marketPriceList',
            name: 'MarketPriceList',
            component: () => import('@/views/market/salesPrice/marketPriceList/index'),
            meta: { title: '销售价目表' },
            menu: 'userList'
          }
        ]
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
