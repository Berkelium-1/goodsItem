import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import request from '@/utils/request';


const getDefaultState = () => {
    return {
        token: getToken() || '',
        name: '', // 用户名称
        avatar: '', // 用户头像
        router_roles: null, // 用户路由权限
        role_root: 0 // 用户是否有最高权限
    }
}

const state = getDefaultState()

const mutations = {
    // 重置状态
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState());
    },
    // 设置 token 在状态里
    SET_TOKEN: (state, token) => {
        state.token = token;
    },
    // 设置用户名称 在状态里
    SET_NAME: (state, name) => {
        state.name = name;
    },
    // 设置用户头像 在状态里
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar;
    },
    // 设置用户路由权限 在状态里
    SET_ROUTER_ROLE: (state, router_roles) => {
        state.router_roles = router_roles;
    },
    // 设置用户是否有最高权限 在状态里
    SET_ROLE_ROOT: (state, role_root) => {
        state.role_root = role_root;
    },
}

const actions = {
    login({ commit }, data) {
        // 登录
        return new Promise((resolve, reject) => {
            request({
                url: '/login',
                method: 'post',
                data
            }).then(response => {
                const { token } = response;

                commit('SET_TOKEN', token);

                setToken(token) // 存储token

                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            request({
                url: '/getInfo',
                params: { token: state.token }
            }).then(response => {
                if (response.code != 200) {
                    return reject('验证失败，请重新登录');
                }

                const { admin_name, avatar, role_root } = response.user_info;
                const { router_roles } = response;

                commit('SET_NAME', admin_name);
                commit('SET_ROUTER_ROLE', router_roles);
                commit('SET_AVATAR', avatar);
                commit('SET_ROLE_ROOT', role_root);


                resolve(response);
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 退出登录
    logout({ commit, state }) {
        removeToken(); // 删除 token
        resetRouter(); // 重置路由
        commit('RESET_STATE');
    },

    // 删除 token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken(); // 必须先删除 token
            commit('RESET_STATE');
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}