const mysql = require('mysql');
const { mysqlConfig } = require('./config');
module.exports = {
    // 连接数据库, 使用mysql连接池连接方法
    // 连接池对象
    sqlConnect(sql, sqlArr, callBack) {
        let pool = mysql.createPool(mysqlConfig);
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('连接失败：', err);
                return;
            }
            // 事件驱动回调
            conn.query(sql, sqlArr, callBack);
            // 释放连接
            conn.release();
            // conn.release() 释放连接 不成功时使用以下方法
            // pool.releaseConnection(conn);
        });
    }
}