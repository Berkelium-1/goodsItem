/* 后台管理路由文件 */
const express = require('express');
const router = express.Router();

// 控制器
const login = require('../controllers/loginController');
const category = require('../controllers/categoryController');
const goods = require('../controllers/goodsController');


// 登录
router.post('/login', login.login); // 登录 

// 分类
router.get('/categoryAll', category.categoryAll); // 获取所有分类
router.get('/categoryList', category.getCategoryList); // 获取分类列表
router.get('/searchCategory', category.searchCategory); // 分类搜索
router.get('/isRepeatCategoryName', category.queryRepeatName); // 查询是否有重名分类
router.put('/addCategory', category.addCategory); // 添加分类
router.get('/categoryInfo', category.getCategory); // 获取分类信息
router.post('/modifyCategory', category.modifyCategory); // 修改分类 
router.delete('/delCategory', category.delCategory); // 删除分类

// 商品
router.get('/goodsList', goods.getGoodsList); // 获取商品列表
router.get('/searchGoods', goods.searchGoods); // 商品搜索
router.get('/isRepeatGoodsName', goods.queryRepeatName); // 查询是否有重名商品
router.put('/addGoods', goods.addGoods); // 添加商品
router.get('/goodsInfo', goods.getGoods); // 获取商品信息
router.post('/modifyGoods', goods.modifyGoods); // 修改商品
router.post('/changeState', goods.changeState); // 修改商品状态
router.delete('/delGoods', goods.delGoods); // 删除商品




module.exports = router;