const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    name: state => state.user.name,
    router_roles: state => state.user.router_roles,
    role_root: state => state.user.role_root,
    addRouters: state => state.permission.addRouters
}
export default getters