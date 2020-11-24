const dbConfig = require('../config/dbconfig');
module.exports = {
    // 获取所有分类
    categoryAll(req, res, next) {
        const sql = `select * from category;`; // sql语句
        const sqlArr = []; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                const responseData = {
                    code: 500,
                    msg: 'error'
                };
                res.send(responseData);
                return console.log(err);
            }
            const responseData = {
                code: 200,
                data
            };
            res.send(responseData);
        }
        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 获取分类列表
    getCategoryList(req, res, next) {
        let { keyword, pageSize, current } = req.query;

        pageSize = parseFloat(pageSize);
        current = parseFloat(current);

        const start = current * pageSize - pageSize;
        const length = pageSize;
        const sql = `select count(*) from category where binary category_name like ? or id like ?;`; // sql语句
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
            const sql1 = `select * from category where binary category_name like ? or id like ? limit ?,?;`; // sql语句
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
    // 搜索分类
    searchCategory(req, res, next) {
        let { keyword, pageSize } = req.query;
        console.log(pageSize);

        pageSize = parseFloat(pageSize);

        const length = pageSize;
        const sql = `select count(*) from category where binary category_name like ? or id like ?;`; // sql语句
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
            const sql1 = `select * from category where binary category_name like ? or id like ? limit ?;`; // sql语句
            const sqlArr1 = [`%${keyword}%`, `%${keyword}%`, length]; // 放进占位符的变量 
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
        const { category_name } = req.query;
        const sql = `select * from category where category_name=?`;
        const sqlArr = [category_name]; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                console.log(err);
                const responseData = {
                    code: 500,
                    msg: 'error'
                };
                res.send(responseData);
            } else {
                const responseData = {
                    code: 200,
                    msg: data.length > 0
                };
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