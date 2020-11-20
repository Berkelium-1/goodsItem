/* 公共控制器 */
const fs = require('fs');
const dbConfig = require('../config/dbconfig');

module.exports = {
    // 删除多余的上传图片
    delUploadImg(tableName) {
        const time_limit = 1000 * 60 * 60; // 时限 1小时
        const sql = `select * from ??;`; // sql语句
        const sqlArr = ['uploads']; // 放进占位符的变量
        const callBack = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                data.forEach(v => {
                    console.log(3);

                    let createtime = new Date(v['createtime']).valueOf();
                    // 删除超过时限的图片
                    if (Date.now() - createtime > time_limit) {
                        delImg(v, tableName);
                    }
                });
            }
        }
        dbConfig.sqlConnect(sql, sqlArr, callBack);
    },
    // 下载
    download(req, res, next) {
        req.query.url ? res.download(req.query.url) : res.send({ success: false });
    }
};

// 删除图片某个表关联的图片不删除
function delImg(v, tableName) {
    const sql = `select * from ?? where img_src=?;`; // sql语句
    const sqlArr = [tableName, v['url']]; // 放进占位符的变量
    dbConfig.sqlConnect(sql, sqlArr, (err, data) => {
        if (err) {
            console.log(`查询 ${tableName} 表时出错：`, err);
        } else {
            if (data.length == 0) {
                console.log(v['path']);
                fs.unlink(v['path'], () => {
                    // 删除 uploads 表的无用记录
                    const delete_sql = `delete from ?? where id=?;`; // sql语句
                    const delete_sqlArr = ['uploads', v['id']]; // 放进占位符的变量
                    dbConfig.sqlConnect(delete_sql, delete_sqlArr);
                });
            }
        }
    });
}