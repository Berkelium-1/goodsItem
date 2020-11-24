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
    // 登录页
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
    },
    // 404 页
    {
        path: '/404',
        component: () => import('@/views/error/404'),
        hidden: true
    },
    // 首页
    {
        path: '/',
        component: Layout,
        redirect: { name: 'Home' },
        children: [{
            path: 'home',
            name: 'Home',
            component: () => import('@/views/home/index'),
            meta: { title: '首页', icon: 'el-icon-s-home' }
        }]
    },
    //
    {
        path: '/user',
        component: Layout,
        redirect: { name: 'User' },
        // meta: { title: '用户管理', icon: 'user' },
        children: [{
            path: 'user',
            name: 'User',
            component: () => import('@/views/user/index'),
            meta: { title: '用户管理', icon: 'user' },
        }]
    },
    //
    {
        path: '/goods',
        component: Layout,
        redirect: { name: 'goodsList' },
        meta: { title: '商品管理', icon: 'el-icon-s-goods' },
        children: [
            //
            {
                path: 'goodsList',
                name: 'goodsList',
                component: () => import('@/views/goods/goodsList'),
                meta: { title: '商品列表' }
            },
            //
            {
                path: 'addGoods',
                name: 'addGoods',
                component: () => import('@/views/goods/goodsForm'),
                meta: { title: '新建商品' },
                hidden: true
            },
            //
            {
                path: 'editGoods/:id',
                name: 'editGoods',
                component: () => import('@/views/goods/goodsForm'),
                props: true,
                meta: { title: '编辑商品' },
                hidden: true
            },
            //
            {
                path: 'categoryList',
                name: 'categoryList',
                component: () => import('@/views/goods/categoryList'),
                meta: { title: '商品分类' }
            },
            //
            {
                path: 'addCategory',
                name: 'addCategory',
                component: () => import('@/views/goods/categoryForm'),
                meta: { title: '新建分类' },
                hidden: true
            },
            //
            {
                path: 'editCategory/:id',
                name: 'editCategory',
                component: () => import('@/views/goods/categoryForm'),
                props: true,
                meta: { title: '编辑分类' },
                hidden: true
            },
        ]
    },


    // 外部链接
    // {
    //     path: 'external-link',
    //     component: Layout,
    //     children: [{
    //         path: 'https://www.baidu.com',
    //         meta: { title: '外部链接', icon: 'link' }
    //     }]
    // },

    // 404 页必须放在末尾 !!!
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