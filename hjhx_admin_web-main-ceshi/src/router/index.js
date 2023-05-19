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
    icon: 'svg-name'             the icon show in the sidebar
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
    children: [
      {
        path: '',
        component: () => import('@/views/index'),
        name: 'home',
        meta: { title: '交易一览', icon: 'home', affix: true, keepAlive: true }
      }
    ],
    hidden: true
  },
  {
    path: '/statistics',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/statistics/statisticsIndex'),
        name: 'home',
        meta: { title: '商户数量统计', icon: 'home', affix: true, keepAlive: true }
      }
    ],
    hidden: true
  },
  {
    path: '/customerManager',
    component: Layout,
    children: [
      {
        path: '',
        component: () => import('@/views/customerManager/customerManagerIndex'),
        name: 'home',
        meta: { title: '客户经理管理', icon: 'home', affix: true, keepAlive: true }
      }
    ],
    hidden: true
  }
  // 404 page must be placed at the end !!!
  // { path: '/404', redirect: '/404', hidden: true }
]

// 动态路由
export const componentMap = {
  'system-account': () => import('@/views/system/account/accountIndex'), // 账户
  'system-menu': () => import('@/views/system/menu/menuIndex'), // 系统管理，菜单
  'system-role': () => import('@/views/system/role/roleIndex'), //   权限管理
  'system-role-edit': () => import('@/views/system/role/roleEditIndex'),
  'merchant-list': () => import('@/views/merchant/merchantListIndex'), // 商户  更多操作
  'merchant-account': () => import('@/views/merchant/merchantAccountIndex'), // 冻结
  'merchant-tradeTerminal-list': () => import('@/views/merchant/tradeTerminalListIndex'), // 更多操作 门店管理
  'merchant-tradeTerminal-info': () => import('@/views/merchant/tradeTerminalInfoIndex'), // 提示框
  'merchant-info': () => import('@/views/merchant/merchantInfoIndex'), // 商户详情
  'settlement-batch': () => import('@/views/settlement/settlementBatchIndex'), // 结算  结算批次
  'settlement-payable': () => import('@/views/settlement/payableIndex'), // 应付明细
  'settlement-receivable': () => import('@/views/settlement/receivableIndex'), // 应付明细
  'settlement-collect-records': () => import('@/views/settlement/collectRecordsIndex'), // 收款记录
  'config-split': () => import('@/views/config/split/splitIndex'),
  'config-split-temp': () => import('@/views/config/split/splitTempIndex'),
  'config-holiday': () => import('@/views/config/holiday/holidayIndex'), // 节假日管理
  'config-appVersion': () => import('@/views/config/appVersion/appVersionIndex'), // app版本管理
  'merchant-withdraw-record': () => import('@/views/merchant/withdrawRecordIndex'), // 商户  提现记录
  'merchant-settle': () => import('@/views/merchant/merchantSettleIndex'), // 清算
  'payment-list': () => import('@/views/payment/paymentIndex'), // 订单
  'work-merchant-approve-list': () => import('@/views/work/merchant/merchantApproveListIndex'),
  'work-merchant-approve-page': () => import('@/views/work/merchant/merchantApproveIndex'),
  'merchant-tradeDevice-list': () => import('@/views/merchant/tradeDeviceListIndex'),
  'config-agency-list': () => import('@/views/config/agencyInfo/agencyInfoListIndex'),
  'config-commonProblem-list': () => import('@/views/config/commonProblemInfo/commonProblemInfoIndex'),
  'reconciliation-internal-list': () => import('@/views/reconciliation/internalBillLogIndex'),
  'reconciliation-external-list': () => import('@/views/reconciliation/externalBillLogIndex'),
  'config-notice-list': () => import('@/views/config/noticeInfo/noticeInfoIndex'),
  'config-download-center': () => import('@/views/config/downloadCenter/downloadCenterIndex'),
  'system-customer-manager': () => import('@/views/system/customerManager/customerManager'),
  'settlement-query': () => import('@/views/settlement/queryList'),
  'config-qrCode': () => import('@/views/config/qrCode/qrCodeIndex'),
  'config-cloudHorn': () => import('@/views/config/cloudHorn/cloudHornIndex'),
  'workOrder-info': () => import('@/views/workOrder/info/infoIndex'), // 工单列表

  // 新增
  'statistics-Index': () => import('@/views/statistics/statisticsIndex') // 商户数据统计
}

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
