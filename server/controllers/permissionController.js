const dbConfig = require('../config/dbconfig');

module.exports = {
    // 获取权限路由
    async permissionRouter(req, res, next) {
        const right_list_data = await dbConfig.sqlConnect(`select second_menu_id from right_list where right_type='router';`, []);

        const data = [];

        for (let i = 0; i < right_list_data.length; i++) {
            const second_menu_id = right_list_data[i]['second_menu_id'];
            const second_menu_data = await dbConfig.sqlConnect(`select * from second_menu where second_menu_id=?;`, [second_menu_id]);
            const path = second_menu_data[0]['path'];
            const first_menu_id = second_menu_data[0]['first_menu_id'];
            const first_menu_data = await dbConfig.sqlConnect(`select * from first_menu where first_menu_id=?;`, [first_menu_id]);
            const first_path = first_menu_data[0]['path'];
            data.push(`${first_path}/${path}`);
        }

        const responseData = {
            code: 200,
            data
        };
        res.send(responseData);
    },

    // 添加权限路由
    async addPermissionRouter(req, res, next) {
        const { parent, child } = req.body;

        const first_menu_data = await dbConfig.sqlConnect(`select * from first_menu where path=?;`, [parent.path]); // 查询一级菜单表
        let first_menu_id = null;

        if (first_menu_data.length > 0) { // 已有此菜单
            first_menu_id = first_menu_data[0]['first_menu_id'];
        } else {
            // 增加数据 一级菜单表
            await dbConfig.sqlConnect(`insert into first_menu ( path, redirect, title, icon) values (?, ?, ?, ?);`, [parent.path, parent.redirect, parent.meta.title, parent.meta.icon]);
            const f_data = await dbConfig.sqlConnect(`select * from first_menu where path=?;`, [parent.path]); // 查询一级菜单表
            first_menu_id = f_data[0]['first_menu_id'];
        }


        const second_menu_data = await dbConfig.sqlConnect(`select * from second_menu where path=? and first_menu_id=?;`, [child.path, first_menu_id]); // 查询二级菜单表
        let second_menu_id = null;

        if (second_menu_data.length > 0) { // 已有此菜单
            second_menu_id = second_menu_data[0]['second_menu_id'];
        } else {
            // 增加数据 二级菜单表
            await dbConfig.sqlConnect(`insert into second_menu ( first_menu_id, path,  title) values (?, ?, ?);`, [first_menu_id, child.path, child.meta.title]);
            const s_data = await dbConfig.sqlConnect(`select * from second_menu where path=? and first_menu_id=?;`, [child.path, first_menu_id]); // 查询二级菜单表
            second_menu_id = s_data[0]['second_menu_id'];
        }


        try {
            // 增加数据 所有权限表
            await dbConfig.sqlConnect(`insert into right_list ( right_type, second_menu_id) values ('router', ?);`, [second_menu_id]);
            const responseData = {
                code: 200,
                msg: '添加权限路由成功'
            };
            res.send(responseData);
        } catch (error) {
            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }
    },

};