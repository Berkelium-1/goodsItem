// store/permission.js
import { asyncRouterMap, constantRouterMap } from '@/router';

function hasPermission(roles, route) {
    if (route.meta && route.meta.role) { // 是否需要权限才能进入此路由
        // 检测是否有权限
        return roles.some(role => route.meta.role.indexOf(role) >= 0);
    } else {
        return true
    }
}

const permission = {

    state: {
        routers: constantRouterMap,
        addRouters: []
    },

    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) { // 生成路由
            return new Promise(resolve => {
                const { roles } = data; // roles是个数组
                const accessedRouters = asyncRouterMap.filter(v => {
                    return true;
                    if (hasPermission(roles, v)) {

                        if (v.children && v.children.length > 0) {
                            v.children = v.children.filter(child => {
                                if (hasPermission(roles, child)) {
                                    return child;
                                }
                                return false;
                            });
                            return v;
                        } else {
                            return v;
                        }

                    }

                    return false;
                });

                commit('SET_ROUTERS', accessedRouters);
                // commit('SET_ROUTERS', asyncRouterMap);

                resolve();
            })
        }
    }
};

export default permission;