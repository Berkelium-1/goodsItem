import { getToken, setToken, removeToken } from '@/utils/auth';
import { resetRouter } from '@/router';
import request from '@/utils/request';


const getDefaultState = () => {
    return {
        token: getToken() || '',
        name: '', // 用户名称
        avatar: '' // 用户头像
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
    }
}

const actions = {
    login({ commit }, userInfo) {
        // 登录
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            request({
                url: '/user/login',
                method: 'post',
                data: {
                    username: username.trim(),
                    password
                }
            }).then(response => {
                const { data } = response

                commit('SET_TOKEN', data.token);

                setToken(data.token) // 存储token

                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 获取用户信息
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            request({
                url: '/user/info',
                params: { token: state.token }
            }).then(response => {
                const { data } = response

                if (!data) {
                    return reject('验证失败，请重新登录');
                }

                const { name, avatar } = data

                commit('SET_NAME', name);

                commit('SET_AVATAR', avatar);

                resolve(data);
            }).catch(error => {
                reject(error)
            })
        })
    },

    // 退出登录
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            request({
                url: '/user/logout',
                method: 'post'
            }).then(() => {
                removeToken() // 删除 token

                resetRouter()

                commit('RESET_STATE')

                resolve()
            }).catch(error => {
                reject(error)
            })
        })
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