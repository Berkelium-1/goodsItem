const path = require('path');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const uploadUrl = multer({ dest: path.join(__dirname, '../public/uploadImg') }); // 上传地址


// 控制器
const common = require('../controllers/commonController'); // 公共控制器
const category = require('../controllers/categoryController');
const goods = require('../controllers/goodsController');


// 公共接口
router.post('/uploadImg', uploadUrl.single('file'), common.uploadImg); // 图片上传
// router.post('/uploadImg', common.uploads); // 图片上传


// 分类
router.get('/categoryList', category.getCategoryAll); // 获取分类列表
router.get('/searchCategory', category.searchCategory); // 分类搜索
router.put('/addCategory', category.addCategory); // 添加分类
router.get('/categoryInfo', category.getCategory); // 获取分类信息
router.post('/modifyCategory', category.modifyCategory); // 修改分类 
router.delete('/delCategory', category.delCategory); // 删除分类

// 商品
router.get('/goodsList', goods.getGoodsAll); // 获取商品列表
router.get('/searchGoods', goods.searchGoods); // 商品搜索
router.put('/addGoods', goods.addGoods); // 添加商品
router.get('/goodsInfo', goods.getGoods); // 获取商品信息
router.post('/modifyGoods', goods.modifyGoods); // 修改商品
router.delete('/delGoods', goods.delGoods); // 删除商品




module.exports = router;