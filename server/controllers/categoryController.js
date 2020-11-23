const dbConfig = require('../config/dbconfig');
module.exports = {
    // 获取所有分类
    getCategoryAll(req, res, next) {
        let sql = `select * from ??;`; // sql语句
        let sqlArr = ['category']; // 放进占位符的变量 
        let callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    data
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 搜索分类
    searchCategory(req, res, next) {
        const { val } = req.query;
        const sql = `select * from ?? where binary id=? or category_name=?;`; // sql语句
        const sqlArr = ['category', val, val]; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    data
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 新建分类
    addCategory(req, res, next) {
        const { category_name } = req.body;
        const sql = `insert into ?? (??) values(?);`; // sql语句
        const sqlArr = ['category', 'category_name', category_name]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    msg: '添加分类成功'
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 获取一个分类
    getCategory(req, res, next) {
        const { id } = req.query;
        const sql = `select * from ?? where id=?;`; // sql语句
        const sqlArr = ['category', id]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    data
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 修改分类
    modifyCategory(req, res, next) {
        const { id, category_name } = req.body;
        const sql = `update ?? set category_name=? where id=?;`; // sql语句
        const sqlArr = ['category', category_name, id]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    msg: '修改分类成功'
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 删除分类
    delCategory(req, res, next) {
        const { id } = req.body;
        const sql = `delete from ?? where id=?;`; // sql语句
        const sqlArr = ['category', id]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    msg: '删除分类成功'
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },

}