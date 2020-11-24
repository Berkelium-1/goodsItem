const jwt = require('../util/jsonwebtoken');
const dbConfig = require('../config/dbconfig');

module.exports = {
    // 登录
    login(req, res, next) {
        const { account, password } = req.body;
        const sql = `select id, account from administrators where account=? and password=?`;
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
    }
};