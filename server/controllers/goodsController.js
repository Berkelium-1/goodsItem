const dbConfig = require('../config/dbconfig');
module.exports = {
    // 获取所有商品
    getGoodsAll(req, res, next) {
        let sql = `select * from ??;`; // sql语句
        let sqlArr = ['goods']; // 放进占位符的变量 
        let callBack = (err, data) => {
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

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },
    // 搜索商品
    searchGoods(req, res, next) {
        const { val } = req.query;
        const sql = `select * from ?? where binary id=? or goods_name=?;`; // sql语句
        const sqlArr = ['goods', val, val]; // 放进占位符的变量 
        const callBack = (err, data) => {
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

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },
    // 新建商品
    addGoods(req, res, next) {
        const { goods_name } = req.body;
        const sql = `insert into ?? (??) values(?);`; // sql语句
        const sqlArr = ['goods', 'goods_name', goods_name]; // 放进占位符的变量
        const callBack = (err, data) => {
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

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },
    // 获取一个商品
    getGoods(req, res, next) {
        const { id } = req.query;
        const sql = `select * from ?? where id=?;`; // sql语句
        const sqlArr = ['goods', id]; // 放进占位符的变量
        const callBack = (err, data) => {
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

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },
    // 修改商品
    modifyGoods(req, res, next) {
        console.log(req.body);
        const { id, goods_name } = req.body;
        const sql = `update ?? set goods_name=? where id=?;`; // sql语句
        const sqlArr = ['goods', goods_name, id]; // 放进占位符的变量
        const callBack = (err, data) => {
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

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },
    // 删除商品
    delGoods(req, res, next) {
        const { id } = req.body;
        const sql = `delete from ?? where id=?;`; // sql语句
        const sqlArr = ['goods', id]; // 放进占位符的变量
        const callBack = (err, data) => {
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

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },

}