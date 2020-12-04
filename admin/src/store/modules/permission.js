// store/permission.js
import { asyncRouterMap, constantRouterMap } from '@/router';

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
                const { roles, root } = data; // roles是个数组

                if (root) { // 如果有最高权限
                    commit('SET_ROUTERS', asyncRouterMap);
                    resolve();
                    return root;
                }

                const accessedRouters = asyncRouterMap.filter(v => {
                    if (v.path == '*' || /^http(s?):\/\//.test(v.path)) { // 404 重定向 或者 外部链接
                        return true;
                    }

                    const first_path = v.path; // 一级菜单path

                    if (v.children && v.children.length > 0) { // 如果有子菜单
                        v.children = v.children.filter(child => {
                            // 外部链接 or 有权限
                            return /^http(s?):\/\//.test(child.path) || roles.some(item => item.first_path === first_path && item.path === child.path); // 父级 path 和 子级 path相等
                        });

                        return v.children.length > 0; // 如果还有子菜单则显示
                    }

                    // 如果没有子菜单
                    return roles.some(item => item.first_path == first_path); // path 和  roles path相等
                });

                commit('SET_ROUTERS', accessedRouters);

                resolve();
            })
        }
    }
};

export default permission;