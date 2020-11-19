/* 公共路由文件 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');


const router = express.Router();

const imgPath = path.join(__dirname, '../public/img/'); // 图片上传地址
const uploadUrl = multer({ dest: imgPath }); // 设置图片上传地址
const { baseURL } = require('../config/config');


// 单个图片上传路由
router.post('/uploadImg', uploadUrl.single('file'), (req, res, next) => {
    console.log(req.body);
    console.log(req.file);

    const { oldFileName } = req.body;
    // 有旧的上传图片就删除旧的
    if (oldFileName) {
        fs.unlink(imgPath + oldFileName, err => {
            if (err) {
                console.log(err);
            } else {
                console.log('旧的图片已被删除');
            }
        });
    }

    const file = req.file;
    file.url = `${baseURL}/public/img/${file.filename}`;

    const responseData = {
        code: 200,
        file
    };
    res.send(responseData);
});

// 下载
router.get('/download', (req, res) => {
    req.query.url ? res.download(`${path.join(__dirname, '../public/uploadImg')}/${req.query.url}`) : res.send({ success: false });
})
module.exports = router;