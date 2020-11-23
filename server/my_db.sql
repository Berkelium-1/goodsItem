/*
Navicat MySQL Data Transfer

Source Server         : bk
Source Server Version : 80021
Source Host           : localhost:3306
Source Database       : my_db

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2020-11-23 17:58:04
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL COMMENT '分类id',
  `goods_name` varchar(255) NOT NULL COMMENT '商品名称',
  `img_src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '商品图片',
  `caption` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '商品说明',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `state` int NOT NULL DEFAULT '0' COMMENT '上下架状态：0未上架，1上架，2下架',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
