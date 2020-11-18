const path = require('path');
const fs = require('fs');
const express = require('express');
const multer = require('multer');

const { baseURL } = require('../config/config');

const router = express.Router();
const uploadUrl = multer({
    dest: path.join(__dirname, '../public/uploadImg') // 上传地址
});

// 单个图片上传路由
router.post('/uploadImg', uploadUrl.single('file'), (req, res, next) => {
    console.log(req.body);
    console.log(req.file);
    const file = req.file;
    file.url = `${baseURL}/public/uploadImg/${file.filename}`;
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