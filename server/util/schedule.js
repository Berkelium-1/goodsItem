// 定时任务
const fs = require('fs'); // 文件系统
const schedule = require('node-schedule'); // 定时任务模块
const dbConfig = require('../config/dbconfig'); // 数据库

module.exports = {
    // 定时删除图片
    delImages() {
        // 秒 分 时 日 月 周几 
        // * 表示任意 例如当秒是*时，表示任意秒数都触发
        const time = '* 30 3 * * *'; // 设置时间 为每天 03:30 
        // const time = '15 * * * * *'; // 测试 每 30 秒 
        // 设置定时任务
        schedule.scheduleJob(time, () => {
            const sql = `select * from uploadimgs where state=0;`; // sql语句
            const sqlArr = []; // 放进占位符的变量
            const callback = (err, data) => {
                if (err) {
                    console.log(err);
                } else {
                    for (let i = 0; i < data.length; i++) {
                        // 删除图片
                        fs.unlink(data[i]['path'], err => {
                            if (err) {
                                console.log(err);
                            } else {
                                // 删除 uploads 表的无用记录
                                const delete_sql = `delete from uploadimgs where id=?;`; // sql语句
                                const delete_sqlArr = [data[i]['id']]; // 放进占位符的变量
                                dbConfig.sqlConnect(delete_sql, delete_sqlArr); // 执行
                                // console.log('删除成功:', data[i]['path']);
                            }
                        });
                    }
                }
            }
            dbConfig.sqlConnect(sql, sqlArr, callback);
        });
    }
};