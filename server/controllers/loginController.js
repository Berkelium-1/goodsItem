const jwt = require('../util/jsonwebtoken');
const dbConfig = require('../config/dbconfig');

module.exports = {
    // 登录
    login(req, res, next) {
        const { account, password } = req.body;
        const sql = `select admin_id, admin_name, login_account from sys_admins where binary (admin_name=? or login_account=?) and login_password=?`;
        const sqlArr = [account, account, password]; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                const responseData = {
                    code: 500,
                    msg: 'error'
                }
                res.send(responseData);
                return console.log(err);

            }
            if (!data.length > 0) {
                const responseData = {
                    code: 404,
                    msg: '账号或者密码错误'
                }
                res.send(responseData);
                return false;
            }

            const payload = JSON.parse(JSON.stringify(data[0])); // 转化为纯对象
            console.log(payload);

            const token = jwt.getToken(payload);


            const responseData = {
                code: 200,
                msg: '登录成功',
                token
            }
            res.send(responseData);
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
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

        const sql = `select * from sys_admins where admin_id=? and admin_name=? and login_account=?;`;
        const sqlArr = [admin_id, admin_name, login_account]; // 放进占位符的变量 
        const data = await dbConfig.sqlConnect(sql, sqlArr);

        if (data.length == 0) {
            const responseData = {
                code: 404,
                msg: '找不到此账号'
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


        // 账号表验证是否有此账号
        const sql = `select admin_id, admin_name, login_account, status, avatar from sys_admins where admin_id=? and admin_name=? and login_account=?;`; // 查询管理员表
        const sqlArr = [admin_id, admin_name, login_account]; // 放进占位符的变量 
        const sys_admins_data = await dbConfig.sqlConnect(sql, sqlArr);

        if (sys_admins_data.length == 0) {
            const responseData = {
                code: 404,
                msg: '找不到此账号'
            }
            res.send(responseData);
            return false;
        }

        const user_info = sys_admins_data[0];

        const sys_admin_roles_data = await dbConfig.sqlConnect(`select role_id from sys_admin_roles where admin_id=?;`, [admin_id]); // 查询 管理员--角色（中间表）

        let roles = [];
        for (let i = 0; i < sys_admin_roles_data.length; i++) {
            let role_id = sys_admin_roles_data[i]['role_id'];
            let admin_roles_data = await dbConfig.sqlConnect(`select role_name from admin_roles where role_id=?;`, [role_id]); // 查询 角色表
            let role_name = admin_roles_data[0]['role_name'];
            roles.push(role_name);
        }

        const responseData = {
            code: 200,
            user_info,
            roles,
            msg: '获取成功'
        }

        res.send(responseData);
    },
};