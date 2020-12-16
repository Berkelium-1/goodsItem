const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    admin_id: state => state.user.admin_id,
    name: state => state.user.name,
    router_roles: state => state.user.router_roles,
    role_root: state => state.user.role_root,
    addRouters: state => state.permission.addRouters,
    routers: state => state.permission.routers,
    rbac_router: state => state.permission.rbac_router,
}
export default getters