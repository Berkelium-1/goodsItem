/* 后台管理路由文件 */
const express = require('express');
const router = express.Router();

// 控制器
const common = require('../controllers/commonController');
const login = require('../controllers/loginController');
const permission = require('../controllers/permissionController');
const sysAdmin = require('../controllers/sysAdminController');
const adminRoles = require('../controllers/adminRolesController');
const category = require('../controllers/categoryController');
const goods = require('../controllers/goodsController');

// test
router.get('/test', common.test); // 测试

// 登录
router.post('/login', login.login); // 登录 
router.post('/verifyToken', login.verifyToken); // 验证token
router.get('/getInfo', login.getInfo); // 获取信息

// 权限
router.get('/permissionRouter', permission.permissionRouter); // 获取权限路由 path
router.put('/addPermissionRouter', permission.addPermissionRouter); // 添加权限路由

// 管理员
router.get('/getSysAdmins', sysAdmin.getSysAdmins); // 获取管理员
router.get('/getAllRole', sysAdmin.getAllRole); // 获取所有角色
router.get('/isRepeatAdmin', sysAdmin.queryRepeat); // 查询是否有重复管理员用户
router.put('/addAdminUser', sysAdmin.addAdminUser); // 新建管理员用户
router.get('/adminInfo', sysAdmin.adminInfo); // 获取管理员信息用于编辑
router.post('/modifyAdminUser', sysAdmin.modifyAdminUser); // 修改管理员
router.post('/changeAdminState', sysAdmin.changeAdminState); // 修改管理员状态



// 角色
router.get('/getAdminRoles', adminRoles.getAdminRoles); // 获取角色
router.get('/getRight', adminRoles.getRight); // 获取权限
router.get('/isRepeatRoleName', adminRoles.queryRepeatName); // 查询是否有重名角色
router.put('/addRole', adminRoles.addRole); // 新建角色
router.get('/roleInfo', adminRoles.roleInfo); // 获取角色信息用于编辑
router.post('/modifyRole', adminRoles.modifyRole); // 修改角色
router.delete('/delRole', adminRoles.delRole); // 删除角色


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