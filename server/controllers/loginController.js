const jwt = require('../util/jsonwebtoken');
const dbConfig = require('../config/dbconfig');
const commom = require('../util/common');

module.exports = {
    // 登录
    async login(req, res, next) {
        const { account, password } = req.body;
        try {
            const sys_admins_data = await dbConfig.sqlConnect(`select * from sys_admins where binary (admin_name=? or login_account=?) and login_password=?`, [account, account, password]);
            if (sys_admins_data.length === 0) {
                const responseData = {
                    code: 404,
                    msg: '账号或者密码错误'
                }
                res.send(responseData);
                return false;
            }

            const { admin_id, admin_name, login_account, status } = sys_admins_data[0];

            if (!status) {
                const responseData = {
                    code: 403,
                    msg: '账号已冻结'
                }
                res.send(responseData);
                return false;
            }



            const payload = { admin_id, admin_name, login_account };

            const token = jwt.getToken(payload);

            const latest_time = commom.formatTime(Date.now());

            await dbConfig.sqlConnect(`update sys_admins set latest_time=? where admin_id=?`, [latest_time, admin_id]);

            const responseData = {
                code: 200,
                msg: '登录成功',
                token
            }
            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            }
            res.send(responseData);
        }



    },

    // 验证token
    async verifyToken(req, res, next) {
        const { token } = req.body;

        // 验证token
        let result = jwt.verifyToken(token);
        const { admin_id, admin_name, login_account } = result; // 获取管理员id、管理员名称、账号

        if (!(admin_id && admin_name && login_account)) {
            const responseData = {
                code: 400,
                msg: '无效的token, 请重新登录'
            }
            res.send(responseData);
            return result;
        }

        const data = await dbConfig.sqlConnect(`select * from sys_admins where admin_id=? and admin_name=? and login_account=?;`, [admin_id, admin_name, login_account]);

        if (data.length == 0) {
            const responseData = {
                code: 404,
                msg: '找不到此账号'
            }
            res.send(responseData);
            return false;
        }

        const { status } = data[0];

        if (!status) {
            const responseData = {
                code: 403,
                msg: '账号已冻结'
            }
            res.send(responseData);
            return false;
        }

        const responseData = {
            code: 200,
            msg: 'token有效, 验证成功'
        }
        res.send(responseData);

    },

    // 获取信息
    async getInfo(req, res, next) {
        const { token } = req.query;

        // 验证token
        let result = jwt.verifyToken(token);

        const { admin_id, admin_name, login_account } = result; // 获取管理员id、管理员名称、账号

        if (!(admin_id && admin_name && login_account)) {
            const responseData = {
                code: 400,
                msg: '无效的token, 请重新登录'
            }
            res.send(responseData);
            return result;
        }


        // 管理员表验证是否有此账号
        const sql = `select admin_id, admin_name, login_account, status, avatar from sys_admins where admin_id=? and admin_name=? and login_account=? limit 1;`; // 查询管理员表
        const sys_admins_data = await dbConfig.sqlConnect(sql, [admin_id, admin_name, login_account]);

        if (sys_admins_data.length == 0) {
            const responseData = {
                code: 404,
                msg: '找不到此账号'
            }
            res.send(responseData);
            return false;
        }

        const [user_info] = sys_admins_data;
        user_info.role_name = [];

        const sys_admin_roles_data = await dbConfig.sqlConnect(`select role_id from sys_admin_roles where admin_id=?;`, [admin_id]); // 查询 管理员--角色（中间表）

        let right_id_all = []; // 定义一个数组存放角色拥有的所有权限id

        for (let i = 0; i < sys_admin_roles_data.length; i++) {
            const role_id = sys_admin_roles_data[i]['role_id']; // 获取角色id

            const admin_roles_data = await dbConfig.sqlConnect(`select * from admin_roles where role_id=?;`, [role_id]); // 查询 角色表

            user_info['role_name'].push(admin_roles_data[0]['role_name']); // 获取角色名称

            const role_root = admin_roles_data[0]['role_root']; // 获取角色最高权限状态
            user_info['role_root'] = role_root;

            let right_list_data = await dbConfig.sqlConnect(`select right_id from right_list where right_type='router';`, []); // 查询 权限表 所有路由权限id
            for (let i = 0; i < right_list_data.length; i++) {
                right_list_data[i] = right_list_data[i]['right_id']; // 去除对象改为只有 right_id 的值
            }

            if (role_root === 1) { // 如果拥有最高权限
                right_id_all = right_list_data;
                break; // 跳出循环节省性能
            }

            let role_rights_data = await dbConfig.sqlConnect(`select right_id from role_rights where role_id=?;`, [role_id]); // 查询 角色--权限表
            for (let i = 0; i < role_rights_data.length; i++) {
                role_rights_data[i] = role_rights_data[i]['right_id']; // 去除对象改为只有right_id的值
            }

            // 当前遍历 角色 所拥有的所有 权限id
            const admin_roles_right_id_all = role_rights_data.filter(item => right_list_data.some(v => v === item));

            right_id_all.push(...admin_roles_right_id_all);
        }

        // 去除重复的权限id
        right_id_all = [...new Set(right_id_all)];

        const second_menu_id_all = [];

        for (let i = 0; i < right_id_all.length; i++) {
            const right_id = right_id_all[i]; // 获取权限id
            const right_list_data = await dbConfig.sqlConnect(`select second_menu_id from right_list where right_id=? and right_type='router';`, [right_id]); // 查询 权限表 菜单id
            second_menu_id_all.push(right_list_data[0]['second_menu_id']);
        }

        const router_roles = [];

        for (let i = 0; i < second_menu_id_all.length; i++) {
            const second_menu_id = second_menu_id_all[i];
            const second_menu_data = await dbConfig.sqlConnect(`select * from second_menu where second_menu_id=?;`, [second_menu_id]); // 查询 二级菜单表 
            const first_menu_id = second_menu_data[0]['first_menu_id'];
            const first_menu_data = await dbConfig.sqlConnect(`select * from first_menu where first_menu_id=?;`, [first_menu_id]); // 查询 一级级菜单表

            const first_path = first_menu_data[0]['path'];
            const path = second_menu_data[0]['path'];


            router_roles.push({ first_path, path });

        }

        const responseData = {
            code: 200,
            user_info,
            router_roles,
            msg: '获取成功'
        }

        res.send(responseData);
    },
};