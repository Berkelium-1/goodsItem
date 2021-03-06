import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu 只会出现在有超过一个嵌套路由时 children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   如果设置为true，则不会在侧边栏中显示该项（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果未设置alwaysShow，则当项目有多个子路径时，
 *                                它将变成嵌套模式，否则不显示根菜单
 * redirect: 'noRedirect'         如果设置为 'noRedirect' 将不会被重定向
 * name:'router-name'             名称由 <keep alive> 使用 (必须设置!!!)
 * meta : {
    roles: ['admin','editor']    控制页面角色 (可以设置多个角色)
    title: 'title'               名称显示在侧边栏和面包屑中 
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            如果设置为false，则项目将隐藏在breadcrumb中 (默认值为true)
    activeMenu: '/example/list'  如果设置路径，侧栏将突出显示您设置的路径
    noCache: false                是否缓存此页面 默认值 true
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 没有权限要求的基页
 * 可以访问所有角色
 */
export const constantRouterMap = [ // 无权限控制的路由 
    // 登录页
    {
        path: '/login',
        name: 'Login',
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




    // 外部链接
    // {
    //     path: 'external-link',
    //     component: Layout,
    //     children: [{
    //         path: 'https://www.baidu.com',
    //         meta: { title: '外部链接', icon: 'link' }
    //     }]
    // },
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

const router = createRouter()

// 详情请看: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // 重置 router
}

export const asyncRouterMap = [ // 异步加载的路由 有权限控制
    //
    {
        path: '/rbac',
        component: Layout,
        redirect: 'noRedirect',
        meta: { title: '权限管理', icon: 'el-icon-cpu' },
        children: [
            //
            {
                path: 'ctrl',
                name: 'ctrl',
                component: () => import('@/views/rbac/ctrl'),
                meta: { title: '权限设置' },
            },
            //
            {
                path: 'sysAdmins',
                name: 'sysAdmins',
                component: () => import('@/views/rbac/sysAdmins'),
                meta: { title: '管理人员' },
            },
            //
            {
                path: 'addSysAdmin',
                name: 'addSysAdmin',
                component: () => import('@/views/rbac/sysAdminForm'),
                meta: { title: '新建用户' },
                hidden: true
            },
            //
            {
                path: 'editSysAdmin/:id',
                name: 'editSysAdmin',
                props: true,
                component: () => import('@/views/rbac/sysAdminForm'),
                meta: { title: '编辑用户' },
                hidden: true
            },
            //
            {
                path: 'adminRoles',
                name: 'adminRoles',
                component: () => import('@/views/rbac/adminRoles'),
                meta: { title: '角色权限' },
            },
            //
            {
                path: 'addAdminRole',
                name: 'addAdminRole',
                component: () => import('@/views/rbac/adminRoleForm'),
                meta: { title: '新建角色' },
                hidden: true
            },
            //
            {
                path: 'editAdminRole/:id',
                name: 'editAdminRole',
                props: true,
                component: () => import('@/views/rbac/adminRoleForm'),
                meta: { title: '编辑角色' },
                hidden: true
            }
        ]
    },

    //
    // {
    //     path: '/user',
    //     component: Layout,
    //     redirect: 'noRedirect',
    //     meta: { title: '用户管理', icon: 'user', breadcrumb: false },

    //     children: [{
    //         path: 'user',
    //         name: 'User',
    //         component: () => import('@/views/user/index'),
    //         meta: { title: '用户管理' },
    //     }]
    // },
    //
    {
        path: '/goods',
        component: Layout,
        redirect: 'noRedirect',
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
    //
    {
        path: '/article',
        component: Layout,
        redirect: 'noRedirect',
        meta: { title: '文章管理', icon: 'user', breadcrumb: false },
        breadcrumb: false,
        children: [{
            path: 'articleList',
            name: 'articleList',
            component: () => import('@/views/article/articleList'),
            meta: { title: '文章列表' },
        }]
    },
    // 404 页必须放在末尾 !!!
    { path: '*', redirect: '/404', hidden: true }
]

export default router