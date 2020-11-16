const { baseURL } = require('../config/config');
const dbConfig = require('../config/dbconfig');
module.exports = {
    // 处理上传图片
    uploadImg(req, res, next) {
        const file = req.file;
        file.url = `${baseURL}/public/uploadImg/${file.filename}`;
        const responseData = {
            code: 200,
            file
        }
        res.send(responseData);
    }
};