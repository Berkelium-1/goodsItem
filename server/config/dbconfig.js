const mysql = require('mysql');
const { mysqlConfig } = require('./config');
let pool = mysql.createPool(mysqlConfig); // 创建连接池

module.exports = {
    // 连接数据库, 使用mysql连接池连接方法
    // 连接池对象
    sqlConnect(sql, sqlArr, callback) {
        return new Promise((resolve, reject) => {
            pool.getConnection((err, conn) => {

                if (err) {
                    console.log('pool连接失败：', err);
                    reject(err);
                    return;
                }
                if (callback) { // 如果有回调函数
                    conn.query(sql, sqlArr, callback); // 事件驱动回调
                } else {
                    conn.query(sql, sqlArr, (err, data) => { // 事件驱动回调

                        if (err) {
                            console.log('事件驱动回调失败:', err);
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                }

                // pool.end(err => {
                //     if (err) {
                //         console.log('释放连接错误！');
                //     }
                // });

                // 释放连接
                conn.release();
                // conn.release() 释放连接 不成功时使用以下方法
                // pool.releaseConnection(conn);

            });
        })

    }
}