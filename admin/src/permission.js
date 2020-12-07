import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar 进度条
import 'nprogress/nprogress.css' // progress bar style 进度条样式
import { getToken, hasPermission } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 无重定向白名单

router.beforeEach(async (to, from, next) => {
    // 开始进度条
    NProgress.start()

    // 设置页面标题
    document.title = getPageTitle(to.meta.title)

    // 确定用户是否已登录
    const hasToken = getToken();

    if (hasToken) { // 已登录
        if (to.path === '/login') {
            // 如果已登录，则重定向到主页
            next({ path: '/' })
            NProgress.done();
        } else {
            const hasGetUserInfo = store.getters.router_roles;

            if (!hasGetUserInfo) { // 没有用户信息
                try {
                    // 获取用户信息
                    await store.dispatch('user/getInfo');
                    const roles = store.getters.router_roles;
                    const root = store.getters.role_root;

                    // 生成权限路由
                    await store.dispatch('GenerateRoutes', { roles, root });

                    // 添加权限路由表
                    router.addRoutes(store.getters.addRouters);

                    // hack方法 确保addRoutes已完成, 设置 replace:true，这样导航就不会留下历史记录
                    next({ ...to, replace: true });
                } catch (error) {
                    // 删除令牌并转到登录页面重新登录
                    await store.dispatch('user/resetToken');

                    Message.error(error || '验证失败，请重新登录！');

                    // next(`/login?redirect=${to.path}`);
                    next('/login');

                    NProgress.done();
                }
            }
            next();
        }
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) {
            // in the free login whitelist, go directly
            next()
        } else {
            // other pages that do not have permission to access are redirected to the login page.
            next(`/login?redirect=${to.path}`)
            NProgress.done() // 结束进度条
        }
    }
})

router.afterEach(() => {
    NProgress.done(); // 结束进度条
});