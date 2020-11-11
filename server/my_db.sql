/*
Navicat MySQL Data Transfer

Source Server         : bk
Source Server Version : 80021
Source Host           : localhost:3306
Source Database       : my_db

Target Server Type    : MYSQL
Target Server Version : 80021
File Encoding         : 65001

Date: 2020-11-11 17:53:41
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for categorylist
-- ----------------------------
DROP TABLE IF EXISTS `categorylist`;
CREATE TABLE `categorylist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '类别',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of categorylist
-- ----------------------------
INSERT INTO `categorylist` VALUES ('1', '冷饮');

-- ----------------------------
-- Table structure for goodlist
-- ----------------------------
DROP TABLE IF EXISTS `goodlist`;
CREATE TABLE `goodlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `goods_name` varchar(255) NOT NULL COMMENT '商品名称',
  `img_src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL COMMENT '商品图片',
  `desc` varchar(255) DEFAULT NULL COMMENT '商品说明',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `state` int NOT NULL DEFAULT '0' COMMENT '上下架状态：0未上架，1上架，2下架',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of goodlist
-- ----------------------------

-- ----------------------------
-- Table structure for orderlist
-- ----------------------------
DROP TABLE IF EXISTS `orderlist`;
CREATE TABLE `orderlist` (
  `id` int NOT NULL,
  `good_list` varchar(255) NOT NULL COMMENT '订单商品集合',
  `remarks` varchar(255) DEFAULT NULL COMMENT '备注',
  `price` decimal(10,2) NOT NULL COMMENT '订单价格',
  `user_id` int NOT NULL COMMENT '用户id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ----------------------------
-- Records of orderlist
-- ----------------------------
