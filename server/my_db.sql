/*
Navicat MySQL Data Transfer

Source Server         : bk
Source Server Version : 80021
Source Host           : localhost:3306
Source Database       : my_db

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2020-12-16 11:51:17
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin_roles
-- ----------------------------
DROP TABLE IF EXISTS `admin_roles`;
CREATE TABLE `admin_roles` (
  `role_id` int NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `role_name` varchar(20) NOT NULL COMMENT '角色名称',
  `role_desc` varchar(100) DEFAULT NULL COMMENT '角色描述',
  `role_root` int NOT NULL DEFAULT '0' COMMENT '1 拥有所有权限 0 按照角色--权限表来分配权限',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';

-- ----------------------------
-- Records of admin_roles
-- ----------------------------
INSERT INTO `admin_roles` VALUES ('1', 'root admin', '最高权限', '1');
INSERT INTO `admin_roles` VALUES ('2', 'admin', '普通管理', '0');
INSERT INTO `admin_roles` VALUES ('6', 'test1', '测试', '0');

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='分类表';

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('1', '分类11');
INSERT INTO `category` VALUES ('10', '热饮');
INSERT INTO `category` VALUES ('12', '分类1');
INSERT INTO `category` VALUES ('13', '分类2');
INSERT INTO `category` VALUES ('14', '分类3');
INSERT INTO `category` VALUES ('15', '分类4');
INSERT INTO `category` VALUES ('16', '分类5');
INSERT INTO `category` VALUES ('17', '分类6');
INSERT INTO `category` VALUES ('18', '分类7');
INSERT INTO `category` VALUES ('19', '分类8');
INSERT INTO `category` VALUES ('20', '分类9');
INSERT INTO `category` VALUES ('21', 'dds');

-- ----------------------------
-- Table structure for first_menu
-- ----------------------------
DROP TABLE IF EXISTS `first_menu`;
CREATE TABLE `first_menu` (
  `first_menu_id` int NOT NULL AUTO_INCREMENT COMMENT '一级菜单id',
  `path` varchar(100) NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `redirect` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`first_menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='一级菜单表';

-- ----------------------------
-- Records of first_menu
-- ----------------------------
INSERT INTO `first_menu` VALUES ('1', '/rbac', '权限管理', 'el-icon-cpu', 'noRedirect');
INSERT INTO `first_menu` VALUES ('2', '/goods', '商品管理', 'el-icon-s-goods', 'noRedirect');
INSERT INTO `first_menu` VALUES ('7', '/article', '文章管理', 'user', 'noRedirect');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL COMMENT '分类id 关联分类表',
  `goods_name` varchar(255) NOT NULL COMMENT '商品名称',
  `img_src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '商品图片',
  `caption` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '商品说明',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `state` int NOT NULL DEFAULT '0' COMMENT '上下架状态：0未上架，1上架，2下架',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='商品表';

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('21', '10', 'aa', 'http://localhost:3000/public/img/99cb8d7a4a5a39874408ebe5957f3723', 'sdsd', '2.00', '2');
INSERT INTO `goods` VALUES ('22', '1', 'sss', 'http://localhost:3000/public/img/8243941f79f2e5adc75a3a3e1ad0626d', 'dfasdf', '4.00', '1');
INSERT INTO `goods` VALUES ('23', '10', 'sd', 'http://localhost:3000/public/img/7d58cd8e2d318f254f906cbde7e6044f', 'ss', '2.00', '1');
INSERT INTO `goods` VALUES ('24', '1', '33', 'http://localhost:3000/public/img/5b561d5837c910ab52b47dc118e17983', 'asdf', '4.00', '0');
INSERT INTO `goods` VALUES ('25', '1', 'asdsad', 'http://localhost:3000/public/img/52e46bff0901bc0f4a99bf6f54078b2c', 'asd', '6.00', '0');

-- ----------------------------
-- Table structure for order
-- ----------------------------
DROP TABLE IF EXISTS `order`;
CREATE TABLE `order` (
  `id` int NOT NULL,
  `good_list` varchar(255) NOT NULL COMMENT '订单商品集合',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `price` decimal(10,2) NOT NULL COMMENT '订单价格',
  `user_id` int NOT NULL COMMENT '用户id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of order
-- ----------------------------

-- ----------------------------
-- Table structure for right_list
-- ----------------------------
DROP TABLE IF EXISTS `right_list`;
CREATE TABLE `right_list` (
  `right_id` int NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `right_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '权限名称',
  `right_code` varchar(20) DEFAULT NULL COMMENT '权限编码',
  `right_type` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限类型',
  `second_menu_id` int DEFAULT NULL COMMENT '二级菜单id 关联二级菜单表',
  PRIMARY KEY (`right_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='所有权限列表';

-- ----------------------------
-- Records of right_list
-- ----------------------------
INSERT INTO `right_list` VALUES ('1', null, null, 'router', '1');
INSERT INTO `right_list` VALUES ('2', null, null, 'router', '2');
INSERT INTO `right_list` VALUES ('3', null, null, 'router', '3');
INSERT INTO `right_list` VALUES ('4', null, null, 'router', '4');
INSERT INTO `right_list` VALUES ('5', null, null, 'router', '5');
INSERT INTO `right_list` VALUES ('6', null, null, 'router', '6');
INSERT INTO `right_list` VALUES ('7', null, null, 'router', '7');
INSERT INTO `right_list` VALUES ('8', null, null, 'router', '8');
INSERT INTO `right_list` VALUES ('19', null, null, 'router', '46');
INSERT INTO `right_list` VALUES ('20', null, null, 'router', '47');
INSERT INTO `right_list` VALUES ('21', null, null, 'router', '48');
INSERT INTO `right_list` VALUES ('22', null, null, 'router', '49');
INSERT INTO `right_list` VALUES ('23', null, null, 'router', '50');
INSERT INTO `right_list` VALUES ('24', null, null, 'router', '51');
INSERT INTO `right_list` VALUES ('25', null, null, 'router', '52');

-- ----------------------------
-- Table structure for role_rights
-- ----------------------------
DROP TABLE IF EXISTS `role_rights`;
CREATE TABLE `role_rights` (
  `role_right_id` int NOT NULL AUTO_INCREMENT COMMENT '角色权限id',
  `role_id` int NOT NULL COMMENT '角色id 关联角色表',
  `right_id` int NOT NULL COMMENT '权限id 关联所有权限表',
  PRIMARY KEY (`role_right_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色--权限表（中间表）';

-- ----------------------------
-- Records of role_rights
-- ----------------------------
INSERT INTO `role_rights` VALUES ('33', '2', '4');
INSERT INTO `role_rights` VALUES ('34', '2', '5');
INSERT INTO `role_rights` VALUES ('35', '2', '6');
INSERT INTO `role_rights` VALUES ('36', '2', '7');
INSERT INTO `role_rights` VALUES ('37', '2', '8');
INSERT INTO `role_rights` VALUES ('38', '2', '19');
INSERT INTO `role_rights` VALUES ('39', '2', '20');

-- ----------------------------
-- Table structure for second_menu
-- ----------------------------
DROP TABLE IF EXISTS `second_menu`;
CREATE TABLE `second_menu` (
  `second_menu_id` int NOT NULL AUTO_INCREMENT COMMENT '二级菜单id',
  `first_menu_id` int NOT NULL COMMENT '一级菜单id 关联一级菜单表',
  `path` varchar(100) NOT NULL,
  `redirect` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`second_menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='二级菜单表';

-- ----------------------------
-- Records of second_menu
-- ----------------------------
INSERT INTO `second_menu` VALUES ('1', '1', 'ctrl', '', '权限控制');
INSERT INTO `second_menu` VALUES ('2', '1', 'rbacUser', '', '用户权限');
INSERT INTO `second_menu` VALUES ('3', '1', 'adminRoles', null, '角色权限');
INSERT INTO `second_menu` VALUES ('4', '2', 'goodsList', null, '商品列表');
INSERT INTO `second_menu` VALUES ('5', '2', 'addGoods', null, '新建商品');
INSERT INTO `second_menu` VALUES ('6', '2', 'editGoods/:id', null, '编辑商品');
INSERT INTO `second_menu` VALUES ('7', '2', 'categoryList', null, '商品分类');
INSERT INTO `second_menu` VALUES ('8', '2', 'addCategory', null, '新建分类');
INSERT INTO `second_menu` VALUES ('46', '2', 'editCategory/:id', null, '编辑分类');
INSERT INTO `second_menu` VALUES ('47', '7', 'articleList', null, '文章列表');
INSERT INTO `second_menu` VALUES ('48', '1', 'addAdminRole', null, '新建角色');
INSERT INTO `second_menu` VALUES ('49', '1', 'editAdminRole/:id', null, '编辑角色');
INSERT INTO `second_menu` VALUES ('50', '1', 'sysAdmins', null, '管理员列表');
INSERT INTO `second_menu` VALUES ('51', '1', 'addSysAdmin', null, '新建用户');
INSERT INTO `second_menu` VALUES ('52', '1', 'editSysAdmin/:id', null, '编辑用户');

-- ----------------------------
-- Table structure for sys_admins
-- ----------------------------
DROP TABLE IF EXISTS `sys_admins`;
CREATE TABLE `sys_admins` (
  `admin_id` int NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `admin_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '管理员名称',
  `admin_desc` varchar(100) DEFAULT NULL COMMENT '管理员说明',
  `login_account` varchar(50) NOT NULL COMMENT '登录账号',
  `login_password` varchar(18) NOT NULL COMMENT '登录密码',
  `status` int NOT NULL DEFAULT '1' COMMENT '账号状态',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像',
  `latest_time` datetime DEFAULT NULL COMMENT '最近登录的时间',
  `admin_root` int NOT NULL DEFAULT '0' COMMENT '0 普通 1 最高级',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员表';

-- ----------------------------
-- Records of sys_admins
-- ----------------------------
INSERT INTO `sys_admins` VALUES ('1', 'root', '最高管理', '1922906183', '123456', '1', 'http://localhost:3000/public/img/068b1a552e411ce0358caf278193cc2e', '2020-12-16 11:02:12', '1');
INSERT INTO `sys_admins` VALUES ('2', 'putong', '123', '2225710499', '123456', '1', 'http://localhost:3000/public/img/5873a6f8b4d28c4756aebf94474df043', '2020-12-16 11:02:08', '0');
INSERT INTO `sys_admins` VALUES ('12', '123', '', '2696095097', '123456', '1', 'http://localhost:3000/public/img/66345fffc5e1c9070270daa2075e94a3', '2020-12-16 10:24:54', '0');

-- ----------------------------
-- Table structure for sys_admin_roles
-- ----------------------------
DROP TABLE IF EXISTS `sys_admin_roles`;
CREATE TABLE `sys_admin_roles` (
  `adnin_role_id` int NOT NULL AUTO_INCREMENT COMMENT '管理角色id',
  `admin_id` int NOT NULL COMMENT '管理员id 关联管理员表',
  `role_id` int NOT NULL COMMENT '角色id 关联角色表',
  PRIMARY KEY (`adnin_role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员--角色（中间表）';

-- ----------------------------
-- Records of sys_admin_roles
-- ----------------------------
INSERT INTO `sys_admin_roles` VALUES ('20', '2', '2');
INSERT INTO `sys_admin_roles` VALUES ('21', '1', '1');
INSERT INTO `sys_admin_roles` VALUES ('22', '12', '2');
INSERT INTO `sys_admin_roles` VALUES ('23', '12', '6');

-- ----------------------------
-- Table structure for uploadimgs
-- ----------------------------
DROP TABLE IF EXISTS `uploadimgs`;
CREATE TABLE `uploadimgs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '图片在服务器的路径',
  `url` varchar(255) NOT NULL COMMENT '图片http地址',
  `createtime` datetime NOT NULL COMMENT '上传时间',
  `state` int NOT NULL DEFAULT '0' COMMENT '使用状态：0未使用，1使用中',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='图片上传表';

-- ----------------------------
-- Records of uploadimgs
-- ----------------------------
INSERT INTO `uploadimgs` VALUES ('28', 'G:\\lhp study\\goodsItem\\server\\public\\img\\99cb8d7a4a5a39874408ebe5957f3723', 'http://localhost:3000/public/img/99cb8d7a4a5a39874408ebe5957f3723', '2020-11-23 11:28:06', '1');
INSERT INTO `uploadimgs` VALUES ('35', 'G:\\lhp study\\goodsItem\\server\\public\\img\\8243941f79f2e5adc75a3a3e1ad0626d', 'http://localhost:3000/public/img/8243941f79f2e5adc75a3a3e1ad0626d', '2020-11-23 11:43:06', '1');
INSERT INTO `uploadimgs` VALUES ('37', 'G:\\lhp study\\goodsItem\\server\\public\\img\\7d58cd8e2d318f254f906cbde7e6044f', 'http://localhost:3000/public/img/7d58cd8e2d318f254f906cbde7e6044f', '2020-11-23 16:39:59', '1');
INSERT INTO `uploadimgs` VALUES ('42', 'G:\\lhp study\\goodsItem\\server\\public\\img\\5b561d5837c910ab52b47dc118e17983', 'http://localhost:3000/public/img/5b561d5837c910ab52b47dc118e17983', '2020-11-24 10:04:15', '1');
INSERT INTO `uploadimgs` VALUES ('43', 'G:\\lhp study\\goodsItem\\server\\public\\img\\52e46bff0901bc0f4a99bf6f54078b2c', 'http://localhost:3000/public/img/52e46bff0901bc0f4a99bf6f54078b2c', '2020-11-24 11:26:07', '1');
INSERT INTO `uploadimgs` VALUES ('46', 'G:\\lhp study\\goodsItem\\server\\public\\img\\fe4813568ed830a604bbe7fd26b832c2', 'http://localhost:3000/public/img/fe4813568ed830a604bbe7fd26b832c2', '2020-12-16 09:34:49', '0');
INSERT INTO `uploadimgs` VALUES ('47', 'G:\\lhp study\\goodsItem\\server\\public\\img\\53ff3a6d607ec85e48c3d0a29126d59f', 'http://localhost:3000/public/img/53ff3a6d607ec85e48c3d0a29126d59f', '2020-12-16 09:42:42', '1');
INSERT INTO `uploadimgs` VALUES ('49', 'G:\\lhp study\\goodsItem\\server\\public\\img\\afcc40ffdb283bb0ac8b6b5268b3d16d', 'http://localhost:3000/public/img/afcc40ffdb283bb0ac8b6b5268b3d16d', '2020-12-16 10:03:52', '0');
INSERT INTO `uploadimgs` VALUES ('50', 'G:\\lhp study\\goodsItem\\server\\public\\img\\5873a6f8b4d28c4756aebf94474df043', 'http://localhost:3000/public/img/5873a6f8b4d28c4756aebf94474df043', '2020-12-16 10:04:00', '1');
INSERT INTO `uploadimgs` VALUES ('51', 'G:\\lhp study\\goodsItem\\server\\public\\img\\068b1a552e411ce0358caf278193cc2e', 'http://localhost:3000/public/img/068b1a552e411ce0358caf278193cc2e', '2020-12-16 10:08:46', '1');
INSERT INTO `uploadimgs` VALUES ('52', 'G:\\lhp study\\goodsItem\\server\\public\\img\\66345fffc5e1c9070270daa2075e94a3', 'http://localhost:3000/public/img/66345fffc5e1c9070270daa2075e94a3', '2020-12-16 10:22:41', '1');
