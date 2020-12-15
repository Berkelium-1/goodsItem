const dbConfig = require('../config/dbconfig');
module.exports = {
    // 获取所有分类
    async categoryAll(req, res, next) {
        try {
            const data = await dbConfig.sqlConnect(`select * from category;`, []);

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
    // 获取分类列表
    async getCategoryList(req, res, next) {
        let { keyword, pageSize, current } = req.query;

        pageSize = parseFloat(pageSize);
        current = parseFloat(current);

        const start = current * pageSize - pageSize;
        const length = pageSize;

        try {
            // 获取总条数 count(*)
            const countData = await dbConfig.sqlConnect(`select count(*) from category where binary category_name like ? or id like ?;`, [`%${keyword}%`, `%${keyword}%`]);
            const total = countData[0]['count(*)'];

            // console.log(countData);
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
            const data = await dbConfig.sqlConnect(`select * from category where binary category_name like ? or id like ? limit ?,?;`, [`%${keyword}%`, `%${keyword}%`, start, length]);
            const responseData = {
                code: 200,
                data,
                total
            }
            res.send(responseData);

        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }



    },
    // 搜索分类
    async searchCategory(req, res, next) {
        let { keyword, pageSize } = req.query;

        pageSize = parseFloat(pageSize);
        const length = pageSize;

        try {
            const countData = await dbConfig.sqlConnect(`select count(*) from category where binary category_name like ? or id like ?;`, [`%${keyword}%`, `%${keyword}%`]);

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
            const data = await dbConfig.sqlConnect(`select * from category where binary category_name like ? or id like ? limit ?;`, [`%${keyword}%`, `%${keyword}%`, length]);

            const responseData = {
                code: 200,
                data,
                total
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
    // 查询是否有重名商品
    async queryRepeatName(req, res, next) {
        const { category_name } = req.query;

        try {
            const data = await dbConfig.sqlConnect(`select * from category where category_name=?`, [category_name]);
            const responseData = {
                code: 200,
                msg: data.length > 0
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

    // 新建分类
    async addCategory(req, res, next) {
        const { category_name } = req.body;

        if (!category_name) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            await dbConfig.sqlConnect(`insert into category (category_name) values(?);`, [category_name]);

            const responseData = {
                code: 200,
                msg: 'create success'
            }
            res.send(responseData);
        } catch (err) {

            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }
    },

    // 获取一个分类
    async getCategory(req, res, next) {
        const { id } = req.query;

        if (!id) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            const data = await dbConfig.sqlConnect(`select * from category where id=? limit 1;`, [id]);
            const responseData = {
                code: 200,
                data
            }
            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }
    },

    // 修改分类
    async modifyCategory(req, res, next) {
        const { id, category_name } = req.body;

        if (!(id && category_name)) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            await dbConfig.sqlConnect(`update category set category_name=? where id=?;`, [category_name, id]);
            const responseData = {
                code: 200,
                msg: 'revise success'
            }
            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }

    },

    // 删除分类
    async delCategory(req, res, next) {
        const { id } = req.body;

        if (!id) {
            const responseData = {
                code: 400,
                msg: 'miss param' // 缺少参数
            };

            return res.send(responseData);
        }

        try {
            await dbConfig.sqlConnect(`delete from category where id=?;`, [id]);
            const responseData = {
                code: 200,
                msg: 'delete success'
            }
            res.send(responseData);
        } catch (err) {
            const responseData = {
                code: 500,
                msg: 'error'
            };
            res.send(responseData);
        }

    },

}