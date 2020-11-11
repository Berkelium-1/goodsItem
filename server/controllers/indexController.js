const dbConfig = require('../config/dbconfig');
module.exports = {
    index(req, res, next) {
        let sql = 'show databases'; // sql语句
        let sqlArr = []; // 放进占位符的变量 
        let callBack = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                res.send({ data });
            }
        }

        dbConfig.sqlConnect(sql, sqlArr, callBack);
    }
}