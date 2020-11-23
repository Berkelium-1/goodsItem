const dbConfig = require('../config/dbconfig');
const common = require('../util/common');

module.exports = {
    // 获取商品列表
    getGoodsList(req, res, next) {
        const { limit } = req.query;

        let sql = limit ? `select * from ?? limit ?;` : `select * from ??;`; // sql语句
        let sqlArr = ['goods', parseFloat(limit)]; // 放进占位符的变量 
        let callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                data.total
                const responseData = {
                    code: 200,
                    data,
                    total: data.length
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 搜索商品
    searchGoods(req, res, next) {
        let { keyword, category_id, limit } = req.query;
        category_id = parseFloat(category_id);
        limit = parseFloat(limit);
        let sql = '';
        if (keyword) {
            sql = category_id ? `select * from ?? where binary id=? or goods_name=? and category_id=? limit ?;` : `select * from ?? where binary id=? or goods_name=? limit ?;`; // sql语句
        } else {
            sql = category_id ? `select * from ?? where category_id=? limit ?;` : `select * from ?? limit ?;`; // sql语句
        }
        const sqlArr = ['goods', keyword || category_id || limit, keyword || limit, category_id || limit, limit]; // 放进占位符的变量 
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
    // 新建商品
    addGoods(req, res, next) {
        let { category_id, goods_name, img_src, caption, price, state } = req.body;
        const sql = `insert into ?? (category_id, goods_name, img_src, caption, price, state) values (?, ?, ?, ?, ?, ?);`; // sql语句
        const sqlArr = ['goods', category_id, goods_name, img_src, caption, price, state]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log(err);
            } else {
                let sql_1 = `update uploadimgs set state=1 where url=?;`; // sql语句
                let sqlArr_1 = [img_src]; // 放进占位符的变量
                dbConfig.sqlConnect(sql_1, sqlArr_1);

                const responseData = {
                    code: 200,
                    msg: '添加商品成功'
                }
                res.send(responseData);
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 获取一个商品
    getGoods(req, res, next) {
        const { id } = req.query;
        const sql = `select * from ?? where id=?;`; // sql语句
        const sqlArr = ['goods', id]; // 放进占位符的变量
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
    // 修改商品
    modifyGoods(req, res, next) {
        // console.log(req.body);
        let { id, category_id, goods_name, img_src, caption, price, state } = req.body;

        const callback = (err, data) => {
            if (err) {
                console.log(err);
            } else {
                dbConfig.sqlConnect(`update uploadimgs set state=0 where url=?;`, [data[0]['img_src']]); // 修改上传图片表 的图片状态为可删除
                dbConfig.sqlConnect(`update uploadimgs set state=1 where url=?;`, [img_src]); // 修改上传图片表 的图片状态为不可删除

                const sql = `update goods set category_id=?, goods_name=?, img_src=?, caption=?, price=?, state=? where id=?;`; // sql语句
                const sqlArr = [category_id, goods_name, img_src, caption, price, state, id]; // 放进占位符的变量
                dbConfig.sqlConnect(sql, sqlArr, err => {
                    const responseData = {
                        code: err ? 500 : 200,
                        msg: err ? '修改商品失败' : '修改商品成功'
                    }
                    res.send(responseData);
                });
            }
        }

        dbConfig.sqlConnect(`select * from goods where id=?;`, [id], callback);
    },
    // 改变上下架状态
    changeState(req, res, next) {
        let { state, id } = req.body;
        state = state == 1 ? 2 : 1; // 是否上架 ? 下架 : 上架
        const sql = `update goods set state=? where id=?;`; // sql语句
        const sqlArr = [state, id]; // 放进占位符的变量
        const callback = (err, data) => {
            const responseData = {
                code: err ? 500 : 200,
                msg: err ? '修改商品状态失败' : '修改商品状态成功'
            }
            res.send(responseData);
        };

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 删除商品
    delGoods(req, res, next) {
        const { id } = req.body;
        const sql = `select * from ?? where id=?;`; // sql语句
        const sqlArr = ['goods', id]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                dbConfig.sqlConnect(`delete from ?? where id=?;`, sqlArr, err => {
                    // 修改上传图片表 的图片状态
                    dbConfig.sqlConnect(`update uploadimgs set state=0 where url=?;`, [data[0]['img_src']]);
                    const responseData = {
                        code: err ? 500 : 200,
                        msg: err ? '删除商品失败' : '删除商品成功'
                    }
                    res.send(responseData);
                });
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callback); // 执行
    }
}