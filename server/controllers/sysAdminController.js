const dbConfig = require('../config/dbconfig');
const commom = require('../util/common');

module.exports = {
    // 获取管理员数据
    async getSysAdmins(req, res, next) {
        try {
            const sys_admin_data = await dbConfig.sqlConnect(`select admin_id, admin_name, status, avatar, latest_time, admin_root from sys_admins`, []);

            const data = sys_admin_data.map(v => {
                if (v.latest_time) {
                    v.latest_time = commom.formatTime(v.latest_time);
                }
                return v;
            });

            const responseData = {
                code: 200,
                data
            };
            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };

            res.send(responseData);
        }
    },

    // 获取所有角色
    async getAllRole(req, res, next) {
        try {
            const admin_roles_data = await dbConfig.sqlConnect(`select role_id, role_name from admin_roles`, []);
            const data = admin_roles_data;
            const responseData = {
                code: 200,
                data
            };
            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };

            res.send(responseData);
        }
    },

    // 查询重复
    async queryRepeat(req, res, next) {
        const { admin_name, login_account } = req.query;

        if (!(admin_name || login_account)) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }


        try {
            const sys_admins_data = await dbConfig.sqlConnect(`select * from sys_admins where admin_name=? or login_account=?`, [admin_name, login_account]); // 查询 管理员表

            const responseData = {
                code: 200,
                msg: sys_admins_data.length > 0
            };

            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };

            res.send(responseData);
        }

    },

    // 新建管理员
    async addAdminUser(req, res, next) {
        const {
            admin_name,
            login_account,
            login_password,
            avatar,
            admin_desc,
            roles
        } = req.body;

        if (!(admin_name && login_account && login_password && roles)) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            await dbConfig.sqlConnect(`begin;`, []); // 开启事务

            const { insertId } = await dbConfig.sqlConnect(`insert into sys_admins (admin_name, admin_desc, login_account, login_password, avatar) values (?, ?, ?, ?, ?);`, [admin_name, admin_desc, login_account, login_password, avatar]); // 插入数据到管理员表

            avatar && await dbConfig.sqlConnect(`update uploadimgs set state=1 where url=?;`, [avatar]); // 如果有图片 修改图片状态

            for (let i = 0; i < roles.length; i++) {
                const role_id = roles[i];
                await dbConfig.sqlConnect(`insert into sys_admin_roles (admin_id, role_id) values (?, ?);`, [insertId, role_id]); // 插入 管理员--角色（中间表）
            }

            await dbConfig.sqlConnect(`commit;`, []); // 提交事务

            const responseData = {
                code: 200,
                msg: 'create success'
            };

            res.send(responseData);

        } catch (err) {
            await dbConfig.sqlConnect('rollback;', []); // 回滚

            const responseData = {
                code: 500,
                msg: 'error'
            };

            res.send(responseData);
        }
    },

    // 获取管理员信息用于编辑
    async adminInfo(req, res, next) {
        const { admin_id } = req.query;

        if (!admin_id) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            const sys_admins_data = await dbConfig.sqlConnect(`select admin_name, admin_desc, login_account, login_password, avatar, admin_root from sys_admins where admin_id=? limit 1`, [admin_id]); // 查询 角色表
            const sys_admin_roles_data = await dbConfig.sqlConnect(`select role_id from sys_admin_roles where admin_id=?;`, [admin_id]); // 查询 角色表

            const responseData = {
                code: 200,
                info: sys_admins_data[0],
                roles: sys_admin_roles_data.map(v => v.role_id)
            };

            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };

            res.send(responseData);
        }
    },

    // 修改管理员
    async modifyAdminUser(req, res, next) {
        const { admin_id, admin_name, admin_desc, login_account, login_password, avatar, roles } = req.body;

        if (!(admin_id && admin_name && login_account && login_password && roles)) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            await dbConfig.sqlConnect(`begin;`, []); // 开启事务

            const [avatar_data] = await dbConfig.sqlConnect(`select avatar from sys_admins where admin_id=? limit 1;`, [admin_id]); // 查询 管理员表 获取旧的图片

            await dbConfig.sqlConnect(`update sys_admins set admin_name=?, admin_desc=?, login_account=?, login_password=?, avatar=? where admin_id=?;`, [admin_name, admin_desc, login_account, login_password, avatar, admin_id]); // 修改 管理员表

            // 如果有图片 且 图片有变化 修改图片状态
            if (avatar && avatar !== avatar_data['avatar']) {
                await dbConfig.sqlConnect(`update uploadimgs set state=1 where url=?;`, [avatar]);
                await dbConfig.sqlConnect(`update uploadimgs set state=0 where url=?;`, [avatar_data['avatar']]);
            }

            await dbConfig.sqlConnect(`delete from sys_admin_roles where admin_id=?;`, [admin_id]); // 删除原来的角色关联 管理员--角色（中间表）

            for (let i = 0; i < roles.length; i++) {
                const role_id = roles[i];
                await dbConfig.sqlConnect(`insert into sys_admin_roles (admin_id, role_id) values (?, ?);`, [admin_id, role_id]); // 删除原来的角色关联 管理员--角色（中间表）
            }

            await dbConfig.sqlConnect(`commit;`, []); // 提交事务

            const responseData = {
                code: 200,
                msg: 'revise success'
            };
            res.send(responseData);
        } catch (err) {

            await dbConfig.sqlConnect('rollback;', []); // 回滚

            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }


    },

    // 修改管理员状态
    async changeAdminState(req, res, next) {
        let { admin_id, status } = req.body;

        if (!(admin_id && (status === 0 || status))) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        status = status ? 0 : 1;


        try {
            await dbConfig.sqlConnect(`update sys_admins set status=? where admin_id=?;`, [status, admin_id]);

            const responseData = {
                code: 200,
                msg: 'revise success'
            };
            res.send(responseData);
        } catch (err) {

            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }
    },

    // 删除管理员
    async delAdmin(req, res, next) {
        const { admin_id } = req.body;

        if (!admin_id) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            await dbConfig.sqlConnect(`begin;`, []); // 开启事务

            const [{ avatar }] = await dbConfig.sqlConnect(`select avatar from sys_admins where admin_id=? limit 1;`, [admin_id]); // 查询 管理员表 获取图片

            await dbConfig.sqlConnect(`update uploadimgs set state=0 where url=?;`, [avatar]); // 修改图片状态

            // 删除该管理员
            await dbConfig.sqlConnect(`delete from sys_admins where admin_id=?;`, [admin_id]); // 删除 管理员表

            // 删除该管理员与角色的关联
            await dbConfig.sqlConnect(`delete from sys_admin_roles where admin_id=?;`, [admin_id]); // 删除 管理员--角色（中间表）

            await dbConfig.sqlConnect(`commit;`, []); // 提交事务

            const responseData = {
                code: 200,
                msg: 'delete success'
            };
            res.send(responseData);
        } catch (err) {
            await dbConfig.sqlConnect('rollback;', []); // 回滚

            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }
    }
};