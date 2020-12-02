// import Cookies from 'js-cookie'

const TokenKey = 'berkelium_admin_token'

export function getToken() {
    // return Cookies.get(TokenKey)
    return localStorage.getItem(TokenKey);

}

export function setToken(token) {
    // return Cookies.set(TokenKey, token);
    return localStorage.setItem(TokenKey, token);
}

export function removeToken() {
    // return Cookies.remove(TokenKey)
    return localStorage.removeItem(TokenKey);
}

export function hasPermission(role, metaRole) { // 判断是否有权限
    let hasPermission = false;
    const type = typeof(metaRole);
    if (type == 'string') {
        return role === metaRole;
    }
    for (let i = 0; i < metaRole.length; i++) {
        if (role == metaRole[i]) {
            hasPermission = true;
            break;
        }
    }
    return hasPermission;
}