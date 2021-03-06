import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
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
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/commodity',
    component: Layout,
    redirect: '/commodity/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/commodity/index'),
        name: 'Commodity',
        meta: { title: '商品管理', icon: 'example', noCache: true }
      }
    ]
  },
  {
    path: '/invoice',
    component: Layout,
    redirect: '/invoice/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/invoice/index'),
        name: 'Invoice',
        meta: { title: '发票管理', icon: 'eye', noCache: true }
      }
    ]
  },
  {
    path: '/inventory',
    component: Layout,
    redirect: '/inventory/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/inventory/index'),
        name: 'Inventory',
        meta: { title: '库存管理', icon: 'form', noCache: true }
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    redirect: '/supplier/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/supplier/index'),
        name: 'Supplier',
        meta: { title: '供应商管理', icon: 'link', noCache: true }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'),
        name: 'Order',
        meta: { title: '订单管理', icon: 'nested', noCache: true }
      }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    redirect: '/purchase/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/purchase/index'),
        name: 'Purchase',
        meta: { title: '采购管理', icon: 'table', noCache: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'),
        name: 'User',
        meta: { title: '业务员管理', icon: 'user', noCache: true }
      }
    ]
  },
  {
    path: '/sales',
    component: Layout,
    redirect: '/sales/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/sales/index'),
        name: 'Sales',
        meta: { title: '退货管理', icon: 'tree', noCache: true }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
