import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// 创建 axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // 跨域请求时发送Cookie
    timeout: 5000 // 请求时间
});

// 请求拦截器
service.interceptors.request.use(
    config => {
        // 在发送请求之前

        if (store.getters.token) {
            // 让每个请求携带令牌
            // ['X-Token'] 是一个自定义头密钥
            // 请根据实际情况修改
            config.headers['X-Token'] = getToken()
        }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * 如果您想获取http信息，如头或状态
     * 请返回response=>response
     */

    /**
     * 通过自定义代码确定请求状态
     * 这里只是一个例子
     * 您还可以通过HTTP状态代码来判断状态
     */
    response => {
        const res = response.data
        // console.log('response=>', response);

        // 如果自定义代码不是20000，则判断为错误(修改过)
        if (response.status !== 200) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('您已注销，您可以取消停留在该页上，或重新登录', {
                    confirmButtonText: '重新登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    })
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service