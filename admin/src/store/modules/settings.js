import defaultSettings from '@/settings'

const { showSettings, fixedHeader, sidebarLogo } = defaultSettings

const state = { showSettings, fixedHeader, sidebarLogo }

const mutations = {
    // 更改设置
    CHANGE_SETTING: (state, { key, value }) => {
        // eslint-disable-next-line no-prototype-builtins 下一个原型链禁用
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    // 调用更改设置
    changeSetting({ commit }, data) {
        commit('CHANGE_SETTING', data);
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}