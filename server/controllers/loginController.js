const jwt = require('../util/jsonwebtoken');
const dbConfig = require('../config/dbconfig');

module.exports = {
    // 登录
    login(req, res, next) {
        const { account, password } = req.body;
        const sql = `select id, account from accounts where account=? and password=?`;
        const sqlArr = [account, password]; // 放进占位符的变量 
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
    verifyToken(req, res, next) {
        const { token } = req.body;

        // 验证token
        let result = jwt.verifyToken(token);
        const { id, account } = result; // 获取id、账号

        if (!(id && account)) {
            const responseData = {
                code: 400,
                msg: '无效的token, 请重新登录'
            }
            res.send(responseData);
            return result;
        }

        const sql = `select * from accounts where id=? and account=?;`;
        const sqlArr = [id, account]; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                const responseData = {
                    code: 500,
                    msg: 'error'
                }
                res.send(responseData);
                return err;
            }

            console.log(data);

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
                data,
                msg: 'token有效, 验证成功'
            }
            res.send(responseData);

        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
    // 获取信息
    getInfo(req, res, next) {
        const { token } = req.query;

        // 验证token
        let result = jwt.verifyToken(token);
        const { id, account } = result; // 获取id、账号
        if (!(id && account)) {
            const responseData = {
                code: 400,
                msg: '无效的token, 请重新登录'
            }
            res.send(responseData);
            return result;
        }

        // 账号表验证是否有此账号
        const sql = `select * from accounts where id=? and account=?;`;
        const sqlArr = [id, account]; // 放进占位符的变量 
        const callback = (err, data) => {
            if (err) {
                const responseData = {
                    code: 500,
                    msg: 'error'
                }
                res.send(responseData);
                return err;
            }

            if (data.length == 0) {
                const responseData = {
                    code: 404,
                    msg: '找不到此账号'
                }
                res.send(responseData);
                return false;
            }

            // 获取用户消息
            dbConfig.sqlConnect(`select * from userInfo where account_id=?;`, [id], (err, userData) => {
                const user = userData[0];
                const responseData = {
                    code: 200,
                    user,
                    msg: '获取成功'
                }
                res.send(responseData);
            });

        }

        dbConfig.sqlConnect(sql, sqlArr, callback);
    },
};