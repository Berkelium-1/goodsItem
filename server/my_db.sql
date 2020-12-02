/*
Navicat MySQL Data Transfer

Source Server         : bk
Source Server Version : 80021
Source Host           : localhost:3306
Source Database       : my_db

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2020-12-02 17:57:10
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account` varchar(255) NOT NULL COMMENT '账号',
  `password` varchar(255) NOT NULL COMMENT '密码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES ('1', '1922906183', '123456');
INSERT INTO `accounts` VALUES ('2', '2225710499', '123456');

-- ----------------------------
-- Table structure for adminroles
-- ----------------------------
DROP TABLE IF EXISTS `adminroles`;
CREATE TABLE `adminroles` (
  `role_id` int NOT NULL AUTO_INCREMENT COMMENT '角色id',
  `role_name` varchar(20) NOT NULL COMMENT '角色名称',
  `role_desc` varchar(100) DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色表';

-- ----------------------------
-- Records of adminroles
-- ----------------------------

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='分类表';

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

-- ----------------------------
-- Table structure for firstmenu
-- ----------------------------
DROP TABLE IF EXISTS `firstmenu`;
CREATE TABLE `firstmenu` (
  `first_menu_id` int NOT NULL AUTO_INCREMENT COMMENT '一级菜单id',
  `path` varchar(100) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `component` varchar(80) DEFAULT NULL,
  `redirect` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `title` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`first_menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='一级菜单';

-- ----------------------------
-- Records of firstmenu
-- ----------------------------
INSERT INTO `firstmenu` VALUES ('1', '/rbac', null, null, 'noRedirect', '权限管理', 'el-icon-cpu');

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
-- Table structure for rightlist
-- ----------------------------
DROP TABLE IF EXISTS `rightlist`;
CREATE TABLE `rightlist` (
  `right_id` int NOT NULL AUTO_INCREMENT COMMENT '权限id',
  `right_name` varchar(20) DEFAULT NULL,
  `right_code` varchar(20) DEFAULT NULL COMMENT '权限编码',
  `second_menu_id` int NOT NULL COMMENT '二级菜单id 关联二级菜单表',
  PRIMARY KEY (`right_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='所有权限列表';

-- ----------------------------
-- Records of rightlist
-- ----------------------------

-- ----------------------------
-- Table structure for rolerights
-- ----------------------------
DROP TABLE IF EXISTS `rolerights`;
CREATE TABLE `rolerights` (
  `role_right_id` int NOT NULL AUTO_INCREMENT COMMENT '角色权限id',
  `role_id` int NOT NULL COMMENT '角色id 关联角色表',
  `right_id` int NOT NULL COMMENT '权限id',
  PRIMARY KEY (`role_right_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='角色--权限表（中间表）';

-- ----------------------------
-- Records of rolerights
-- ----------------------------

-- ----------------------------
-- Table structure for secondmenu
-- ----------------------------
DROP TABLE IF EXISTS `secondmenu`;
CREATE TABLE `secondmenu` (
  `second_menu_id` int NOT NULL AUTO_INCREMENT COMMENT '二级菜单id',
  `first_menu_id` int NOT NULL COMMENT '一级菜单id 关联一级菜单表',
  `path` varchar(100) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `component` varchar(80) NOT NULL,
  `redirect` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `icon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`second_menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='二级菜单表';

-- ----------------------------
-- Records of secondmenu
-- ----------------------------
INSERT INTO `secondmenu` VALUES ('1', '1', 'ctrl', 'Ctrl', '@/views/rbac/ctrl', '', '权限控制', '');
INSERT INTO `secondmenu` VALUES ('2', '1', 'rbacUser', 'RbacUser', '@/views/rbac/rbacUser', '', '用户权限', '');

-- ----------------------------
-- Table structure for sysadmins
-- ----------------------------
DROP TABLE IF EXISTS `sysadmins`;
CREATE TABLE `sysadmins` (
  `admin_id` int NOT NULL AUTO_INCREMENT COMMENT '管理员id',
  `admin_name` varchar(50) NOT NULL COMMENT '姓名',
  `login_account` varchar(50) NOT NULL COMMENT '登录账号',
  `login_password` varchar(18) NOT NULL COMMENT '登录密码',
  `role_id` int NOT NULL COMMENT '角色id 关联角色表',
  `status` int NOT NULL DEFAULT '1' COMMENT '账号状态',
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='管理员表';

-- ----------------------------
-- Records of sysadmins
-- ----------------------------

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
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='图片上传表';

-- ----------------------------
-- Records of uploadimgs
-- ----------------------------
INSERT INTO `uploadimgs` VALUES ('18', 'G:\\lhp study\\goodsItem\\server\\public\\img\\1f7a75e6e21eba04dd8b3afd367322ad', 'http://localhost:3000/public/img/1f7a75e6e21eba04dd8b3afd367322ad', '2020-11-23 10:26:33', '0');
INSERT INTO `uploadimgs` VALUES ('19', 'G:\\lhp study\\goodsItem\\server\\public\\img\\075589984d1a36cd4cd538fcfd0cd5cc', 'http://localhost:3000/public/img/075589984d1a36cd4cd538fcfd0cd5cc', '2020-11-23 10:52:31', '0');
INSERT INTO `uploadimgs` VALUES ('20', 'G:\\lhp study\\goodsItem\\server\\public\\img\\262fecd144f2b1d20ecc729b9ddbfa52', 'http://localhost:3000/public/img/262fecd144f2b1d20ecc729b9ddbfa52', '2020-11-23 10:52:34', '0');
INSERT INTO `uploadimgs` VALUES ('21', 'G:\\lhp study\\goodsItem\\server\\public\\img\\0ab060f8a786ca2b0124c04f8a7dd718', 'http://localhost:3000/public/img/0ab060f8a786ca2b0124c04f8a7dd718', '2020-11-23 10:52:36', '0');
INSERT INTO `uploadimgs` VALUES ('23', 'G:\\lhp study\\goodsItem\\server\\public\\img\\edd027db6ccccbf6aac1170e06051479', 'http://localhost:3000/public/img/edd027db6ccccbf6aac1170e06051479', '2020-11-23 10:55:10', '0');
INSERT INTO `uploadimgs` VALUES ('24', 'G:\\lhp study\\goodsItem\\server\\public\\img\\0e8638616c426963b9412552822c27c0', 'http://localhost:3000/public/img/0e8638616c426963b9412552822c27c0', '2020-11-23 10:57:27', '0');
INSERT INTO `uploadimgs` VALUES ('25', 'G:\\lhp study\\goodsItem\\server\\public\\img\\70dc7bef8a642f9386a07aa5a8d0f0cc', 'http://localhost:3000/public/img/70dc7bef8a642f9386a07aa5a8d0f0cc', '2020-11-23 11:07:06', '0');
INSERT INTO `uploadimgs` VALUES ('26', 'G:\\lhp study\\goodsItem\\server\\public\\img\\ef3a4b7bf87e4e7c5caa61fa5a7448c5', 'http://localhost:3000/public/img/ef3a4b7bf87e4e7c5caa61fa5a7448c5', '2020-11-23 11:07:22', '0');
INSERT INTO `uploadimgs` VALUES ('27', 'G:\\lhp study\\goodsItem\\server\\public\\img\\9ca2e5e565dfe7a2320b271dda3af795', 'http://localhost:3000/public/img/9ca2e5e565dfe7a2320b271dda3af795', '2020-11-23 11:07:32', '0');
INSERT INTO `uploadimgs` VALUES ('28', 'G:\\lhp study\\goodsItem\\server\\public\\img\\99cb8d7a4a5a39874408ebe5957f3723', 'http://localhost:3000/public/img/99cb8d7a4a5a39874408ebe5957f3723', '2020-11-23 11:28:06', '1');
INSERT INTO `uploadimgs` VALUES ('29', 'G:\\lhp study\\goodsItem\\server\\public\\img\\da6f96198d1f7e788633cc3f8a2af6c2', 'http://localhost:3000/public/img/da6f96198d1f7e788633cc3f8a2af6c2', '2020-11-23 11:38:01', '0');
INSERT INTO `uploadimgs` VALUES ('30', 'G:\\lhp study\\goodsItem\\server\\public\\img\\e0b65a353b8c108a4c91cb35a861888b', 'http://localhost:3000/public/img/e0b65a353b8c108a4c91cb35a861888b', '2020-11-23 11:38:05', '0');
INSERT INTO `uploadimgs` VALUES ('31', 'G:\\lhp study\\goodsItem\\server\\public\\img\\d0e5ee471d3d33894641160cc0420397', 'http://localhost:3000/public/img/d0e5ee471d3d33894641160cc0420397', '2020-11-23 11:38:07', '0');
INSERT INTO `uploadimgs` VALUES ('32', 'G:\\lhp study\\goodsItem\\server\\public\\img\\f8bdc0b3b3ca3db23c30683d4821dd3e', 'http://localhost:3000/public/img/f8bdc0b3b3ca3db23c30683d4821dd3e', '2020-11-23 11:38:09', '0');
INSERT INTO `uploadimgs` VALUES ('33', 'G:\\lhp study\\goodsItem\\server\\public\\img\\9bc7bc61a7bf6e4a8332fff5397063ee', 'http://localhost:3000/public/img/9bc7bc61a7bf6e4a8332fff5397063ee', '2020-11-23 11:38:11', '0');
INSERT INTO `uploadimgs` VALUES ('34', 'G:\\lhp study\\goodsItem\\server\\public\\img\\38b80042f73c613443a2469e2407a08f', 'http://localhost:3000/public/img/38b80042f73c613443a2469e2407a08f', '2020-11-23 11:38:15', '0');
INSERT INTO `uploadimgs` VALUES ('35', 'G:\\lhp study\\goodsItem\\server\\public\\img\\8243941f79f2e5adc75a3a3e1ad0626d', 'http://localhost:3000/public/img/8243941f79f2e5adc75a3a3e1ad0626d', '2020-11-23 11:43:06', '1');
INSERT INTO `uploadimgs` VALUES ('36', 'G:\\lhp study\\goodsItem\\server\\public\\img\\c775b66982a056a93b4f298ba7de4ec5', 'http://localhost:3000/public/img/c775b66982a056a93b4f298ba7de4ec5', '2020-11-23 16:38:54', '0');
INSERT INTO `uploadimgs` VALUES ('37', 'G:\\lhp study\\goodsItem\\server\\public\\img\\7d58cd8e2d318f254f906cbde7e6044f', 'http://localhost:3000/public/img/7d58cd8e2d318f254f906cbde7e6044f', '2020-11-23 16:39:59', '1');
INSERT INTO `uploadimgs` VALUES ('38', 'G:\\lhp study\\goodsItem\\server\\public\\img\\b3a0b95e302dabf611a0c7b60de214b0', 'http://localhost:3000/public/img/b3a0b95e302dabf611a0c7b60de214b0', '2020-11-24 09:49:04', '0');
INSERT INTO `uploadimgs` VALUES ('39', 'G:\\lhp study\\goodsItem\\server\\public\\img\\816f343d8c62185a893b2084fb41b61d', 'http://localhost:3000/public/img/816f343d8c62185a893b2084fb41b61d', '2020-11-24 09:49:22', '0');
INSERT INTO `uploadimgs` VALUES ('40', 'G:\\lhp study\\goodsItem\\server\\public\\img\\622726d5bb42c96aaffaecf4cbc121d8', 'http://localhost:3000/public/img/622726d5bb42c96aaffaecf4cbc121d8', '2020-11-24 09:51:48', '0');
INSERT INTO `uploadimgs` VALUES ('41', 'G:\\lhp study\\goodsItem\\server\\public\\img\\5d80b0a88aad0ef0626cdd00f295da20', 'http://localhost:3000/public/img/5d80b0a88aad0ef0626cdd00f295da20', '2020-11-24 10:02:57', '0');
INSERT INTO `uploadimgs` VALUES ('42', 'G:\\lhp study\\goodsItem\\server\\public\\img\\5b561d5837c910ab52b47dc118e17983', 'http://localhost:3000/public/img/5b561d5837c910ab52b47dc118e17983', '2020-11-24 10:04:15', '1');
INSERT INTO `uploadimgs` VALUES ('43', 'G:\\lhp study\\goodsItem\\server\\public\\img\\52e46bff0901bc0f4a99bf6f54078b2c', 'http://localhost:3000/public/img/52e46bff0901bc0f4a99bf6f54078b2c', '2020-11-24 11:26:07', '1');

-- ----------------------------
-- Table structure for userinfo
-- ----------------------------
DROP TABLE IF EXISTS `userinfo`;
CREATE TABLE `userinfo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_id` int NOT NULL COMMENT '账号id',
  `nickname` varchar(255) NOT NULL COMMENT '昵称',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '头像',
  `role` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '权限角色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of userinfo
-- ----------------------------
INSERT INTO `userinfo` VALUES ('1', '1', '111', 'https://avatars1.githubusercontent.com/u/53506299?s=460&u=2f6d9228d75f3cf26497165e07379b317683e57d&v=4', 'admin');
