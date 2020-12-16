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
        schedule.scheduleJob(time, async () => {
            try {
                await dbConfig.sqlConnect(`begin;`, []); // 开启事务
                const data = await dbConfig.sqlConnect(`select * from uploadimgs where state=0;`, [], callback);
                for (let i = 0; i < data.length; i++) {
                    // 删除图片
                    fs.unlink(data[i]['path'], err => {
                        if (err) throw new Error('delete imgs error!');
                        // 删除 uploads 表的无用记录
                        dbConfig.sqlConnect(`delete from uploadimgs where id=?;`, [data[i]['id']]); // 执行
                    });
                }
                await dbConfig.sqlConnect(`commit;`, []); // 提交事务
                console.log('delete imgs success!');
            } catch (err) {
                await dbConfig.sqlConnect('rollback;', []); // 回滚
                console.log('delete imgs error!');
            }

        });
    }
};