const dbConfig = require('../config/dbconfig');

module.exports = {
    // 获取管理员数据
    async getSysAdmins(req, res, next) {
        const sys_admin_data = await dbConfig.sqlConnect(`select admin_id, admin_name, status, avatar, admin_root from sys_admins`, []);
        const data = sys_admin_data;
        const responseData = {
            code: 200,
            data
        };
        res.send(responseData);
    },

    // 获取权限
    async getRight(req, res, next) {
        // 路由权限
        const first_menu_data = await dbConfig.sqlConnect(`select * from first_menu;`, []); // 查询一级菜单表

        const router_roles = [];

        for (let i = 0; i < first_menu_data.length; i++) {
            const label = first_menu_data[i]['title']; // 添加 label 属性
            const path = first_menu_data[i]['path']; // 添加 label 属性
            const children = []; // 添加 children 属性
            const first_menu_id = first_menu_data[i]['first_menu_id']; // 添加 first_menu_id 属性

            const first_menu_item = { path, label, children, first_menu_id };
            router_roles.push(first_menu_item)
        }


        const right_list_data = await dbConfig.sqlConnect(`select * from right_list where right_type='router';`, []); // 查询 所有权限表的路由权限
        const all_child = [];

        for (let i = 0; i < right_list_data.length; i++) {
            const second_menu_id = right_list_data[i]['second_menu_id'];
            const right_id = right_list_data[i]['right_id'];
            const second_menu_data = await dbConfig.sqlConnect(`select * from second_menu where second_menu_id=?;`, [second_menu_id]); // 查询二级菜单表
            const first_menu_id = second_menu_data[0]['first_menu_id'];
            const label = second_menu_data[0]['title'];
            const path = second_menu_data[0]['path'];

            const child = { path, label, right_id, first_menu_id };
            all_child.push(child);
        }

        router_roles.map(v => {
            v.children = all_child.filter(child => {
                return v.first_menu_id === child.first_menu_id
            });
            v.children.map(child => {
                child.path = `${v.path}/${child.path}`;
            });
        });

        const responseData = {
            code: 200,
            router_roles
        };
        res.send(responseData);
    },
    // 查询重名
    async queryRepeatName(req, res, next) {
        const { role_name } = req.query;

        try {
            const admin_roles_data = await dbConfig.sqlConnect(`select * from admin_roles where role_name=?`, [role_name]); // 查询角色表

            const responseData = {
                code: 200,
                msg: admin_roles_data.length > 0
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
    // 添加角色
    async addRole(req, res, next) {
        const { role_name, role_desc, router_rights } = req.body;

        try {
            await dbConfig.sqlConnect(`insert into admin_roles (role_name, role_desc) values(?, ?);`, [role_name, role_desc]); // 添加 角色表
        } catch (err) {
            const responseData = {
                code: 500,
                msg: '创建角色失败'
            };
            res.send(responseData);
        }

        const admin_roles_data = await dbConfig.sqlConnect(`select * from admin_roles where role_name=? and role_desc=?;`, [role_name, role_desc]); // 查询角色表
        const role_id = admin_roles_data[0]['role_id'];

        for (let i = 0; i < router_rights.length; i++) {
            const right_id = router_rights[i];
            try {
                await dbConfig.sqlConnect(`insert into role_rights (role_id, right_id) values (?, ?);`, [role_id, right_id]); // 添加 角色--权限表（中间表）
            } catch (err) {
                await dbConfig.sqlConnect(`delete from admin_roles where role_id=?;`, [role_id]); // 删除 添加的角色

                const responseData = {
                    code: 500,
                    msg: '添加权限出错'
                };
                res.send(responseData);
                return false;
            }
        }


        const responseData = {
            code: 200,
            msg: '创建成功'
        };
        res.send(responseData);

    },
    // 获取角色信息用于编辑
    async roleInfo(req, res, next) {
        const { role_id } = req.query;
        const admin_roles_data = await dbConfig.sqlConnect(`select * from admin_roles where role_id=?;`, [role_id]); // 查询角色表
        const { role_name, role_desc, role_root } = admin_roles_data[0];

        const role_rights_data = await dbConfig.sqlConnect(`select * from role_rights where role_id=?;`, [role_id]); // 查询 角色--权限表（中间表）

        const second_menu_id_all = []

        for (let i = 0; i < role_rights_data.length; i++) {
            const right_id = role_rights_data[i]['right_id'];
            const right_list_data = await dbConfig.sqlConnect(`select * from right_list where right_type='router' and right_id=?;`, [right_id]); // 查询 权限表的路由权限
            const second_menu_id = right_list_data[0]['second_menu_id'];
            second_menu_id_all.push(second_menu_id);
        }

        // 拥有的路由权限
        const router_rights = [];

        for (let i = 0; i < second_menu_id_all.length; i++) {
            const second_menu_id = second_menu_id_all[i];
            const second_menu_data = await dbConfig.sqlConnect(`select * from second_menu where second_menu_id=?;`, [second_menu_id]); // 查询二级菜单表
            const first_menu_id = second_menu_data[0]['first_menu_id'];
            const first_menu_data = await dbConfig.sqlConnect(`select * from first_menu where first_menu_id=?;`, [first_menu_id]); // 查询一级菜单表

            const first_menu_path = first_menu_data[0]['path'];
            const second_menu_path = second_menu_data[0]['path'];

            const path = `${first_menu_path}/${second_menu_path}`;

            router_rights.push(path);
        }

        const responseData = {
            code: 200,
            info: {
                role_name,
                role_desc,
                role_root
            },
            router_rights,
            msg: '获取信息成功'
        };
        res.send(responseData);

    },
    // 修改角色
    async modifyRole(req, res, next) {
        const { role_id, role_name, role_desc, router_rights } = req.body;

        try {
            await dbConfig.sqlConnect(`update admin_roles set role_name=?, role_desc=? where role_id=?;`, [role_name, role_desc, role_id]); // 修改角色表
        } catch (err) {
            const responseData = {
                code: 500,
                msg: '修改角色出错'
            };
            res.send(responseData);
            return false;
        }


        try {
            await dbConfig.sqlConnect(`delete from role_rights where role_id=?;`, [role_id]); // 删除原来的权限 角色--权限表（中间表）
        } catch (err) {
            const responseData = {
                code: 500,
                msg: '修改权限出错'
            };
            res.send(responseData);
            return false;
        }


        for (let i = 0; i < router_rights.length; i++) {

            const right_id = router_rights[i];

            try {
                await dbConfig.sqlConnect(`insert into role_rights (role_id, right_id) values (?, ?);`, [role_id, right_id]); // 添加 角色--权限表（中间表）
            } catch (err) {
                const responseData = {
                    code: 500,
                    msg: '修改权限出错,已删除所有权限'
                };
                res.send(responseData);
                return false;
            }
        }

        const responseData = {
            code: 200,
            msg: '修改成功'
        };
        res.send(responseData);
    },
    // 删除角色
    async delRole(req, res, next) {
        const { role_id } = req.body;

        try {
            // 删除该角色所有的权限
            await dbConfig.sqlConnect(`delete from role_rights where role_id=?;`, [role_id]); // 删除 角色--权限表（中间表）
        } catch (err) {
            const responseData = {
                code: 500,
                msg: '清除权限出错'
            };
            res.send(responseData);
            return false;
        }

        try {
            // 删除该角色与管理员的关联
            await dbConfig.sqlConnect(`delete from sys_admin_roles where role_id=?;`, [role_id]); // 删除 管理员--角色（中间表）
        } catch (err) {
            const responseData = {
                code: 500,
                msg: '清除管理与角色出错,但权限已经清除'
            };
            res.send(responseData);
            return false;
        }

        try {
            // 删除该角色
            await dbConfig.sqlConnect(`delete from admin_roles where role_id=?;`, [role_id]); // 删除 角色表间表）
        } catch (err) {
            const responseData = {
                code: 500,
                msg: '删除角色出错,但已清除权限和管理的联系'
            };
            res.send(responseData);
            return false;
        }


        const responseData = {
            code: 200,
            msg: '删除成功'
        };
        res.send(responseData);
    }
};