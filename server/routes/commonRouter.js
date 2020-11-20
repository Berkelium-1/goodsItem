/* 公共路由文件 */
const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

const imgPath = path.join(__dirname, '../public/img/'); // 图片上传地址
const uploadUrl = multer({ dest: imgPath }); // 设置图片上传地址

// 控制器
const common = require('../controllers/commonController');


// 路由
router.post('/uploadImg', uploadUrl.single('file'), common.addUploadImg); // 单个图片上传
router.get('/download', common.download); // 下载


module.exports = router;