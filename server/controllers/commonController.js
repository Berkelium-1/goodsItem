/* 公共控制器 */
const { baseURL } = require('../config/config');
const dbConfig = require('../config/dbconfig');

module.exports = {
    // 添加上传图片
    addUploadImg(req, res, next) {
        // console.log(req.file);

        const date = new Date(); // 获取时间
        const nowDtae = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

        const file = req.file;
        file.url = `${baseURL}/public/img/${file.filename}`;
        const sql = `insert into uploadimgs ( path, url, createtime) values (?, ?, ?);`; // sql语句
        const sqlArr = [file.path, file.url, nowDtae]; // 放进占位符的变量
        const callback = (err, data) => {
            if (err) {
                console.log('连接失败：', err);
            } else {
                const responseData = {
                    code: 200,
                    file
                };
                res.send(responseData);
            }
        }

        // 执行
        dbConfig.sqlConnect(sql, sqlArr, callback);
    },

    // 下载
    download(req, res, next) {
        req.query.url ? res.download(req.query.url) : res.send({ success: false });
    }
};