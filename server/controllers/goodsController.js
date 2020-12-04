const dbConfig = require('../config/dbconfig');

module.exports = {
    // 获取商品列表
    getGoodsList(req, res, next) {
        let { keyword, category_id, pageSize, current } = req.query;

        category_id = parseFloat(category_id);
        pageSize = parseFloat(pageSize);
        current = parseFloat(current);

        const start = current * pageSize - pageSize;
        const length = pageSize;
        const sql = `select count(*) from goods where binary (goods_name like ? or id like ?) ${category_id ? 'and category_id='+category_id:''};`; // sql语句
        const sqlArr = [`%${keyword}%`, `%${keyword}%`]; // 放进占位符的变量 
        const callback = (err, countData) => {
            if (err) {
                const responseData = {
                    code: 500,
                    msg: 'error'
                }
                res.send(responseData);
                return console.log(err);
            }
            const total = countData[0]['count(*)'];

            // 当一条数据都没有时 不执行下方查询代码 节省性能
            if (!total) {
                const responseData = {
                    code: 200,
                    data: [],
                    total
                };
                res.send(responseData);
                return total;
            }

            // 获取模糊查询出来的数据
            const sql1 = `select * from goods where binary (goods_name like ? or id like ?) ${category_id ? 'and category_id='+category_id:''} limit ?,?;`; // sql语句
            // const sqlArr1 = [`%${keyword}%`, `%${keyword}%`, 1, 2]; // 放进占位符的变量 
            const sqlArr1 = [`%${keyword}%`, `%${keyword}%`, start, length]; // 放进占位符的变量 
            dbConfig.sqlConnect(sql1, sqlArr1, (err, data) => {
                if (err) {
                    const responseData = {
                        code: 500,
                        msg: 'error'
                    }
                    res.send(responseData);
                    return console.log(err);
                }
                const responseData = {
                    code: 200,
                    data,
                    total
                }
                res.send(responseData);
            });
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 搜索商品
    searchGoods(req, res, next) {
        let { keyword, category_id, pageSize } = req.query;
        console.log(req.query);

        category_id = parseFloat(category_id);
        pageSize = parseFloat(pageSize);

        const sql = `select count(*) from goods where binary (goods_name like ? or id like ?) ${category_id ? 'and category_id='+category_id:''};`; // sql语句
        const sqlArr = [`%${keyword}%`, `%${keyword}%`]; // 放进占位符的变量 
        const callback = (err, countData) => {
            if (err) {
                const responseData = {
                    code: 500,
                    msg: 'error'
                }
                res.send(responseData);
                return console.log(err);
            }
            const total = countData[0]['count(*)'];

            // 当一条数据都没有时 不执行下方查询代码 节省性能
            if (!total) {
                const responseData = {
                    code: 200,
                    data: [],
                    total
                }
                res.send(responseData);
                return total;
            }

            // 获取模糊查询出来的数据
            const sql1 = `select * from goods where binary (goods_name like ? or id like ?) ${category_id ? 'and category_id='+category_id:''} limit ?;`; // sql语句
            const sqlArr1 = [`%${keyword}%`, `%${keyword}%`, pageSize]; // 放进占位符的变量 
            dbConfig.sqlConnect(sql1, sqlArr1, (err, data) => {
                if (err) {
                    const responseData = {
                        code: 500,
                        msg: 'error'
                    }
                    res.send(responseData);
                    return console.log(err);
                }
                const responseData = {
                    code: 200,
                    data,
                    total
                }
                res.send(responseData);
            });
        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 查询是否有重名商品
    queryRepeatName(req, res, next) {
        const { goods_name } = req.query;
        const sql = `select * from goods where goods_name=?`;
        const sqlArr = [goods_name]; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                console.log(err);
                const responseData = {
                    code: 500,
                    msg: 'error'
                }
                res.send(responseData);
            } else {
                const responseData = {
                    code: 200,
                    msg: data.length > 0
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
    // 获取一个商品 用于编辑
    getGoods(req, res, next) {
        const { id } = req.query;
        const sql = `select * from ?? where id=?;`; // sql语句
        const sqlArr = ['goods', id]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('获取一个商品：', err);
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
                console.log('删除商品：', err);
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