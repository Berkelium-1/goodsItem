<template>
  <div class="goods-form" v-loading="loading">
    <el-form
      :model="model"
      ref="goodsForm"
      :rules="rules"
      label-width="100px"
      inline-message
    >
      <!-- 分类 -->
      <el-form-item
        label="分类:"
        style="width: 30%"
        prop="category_id"
        required
      >
        <el-select v-model="model.category_id" filterable placeholder="请选择">
          <el-option
            v-for="item in categoryList"
            :key="item.category_name"
            :label="item.category_name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <!-- 名称 -->
      <el-form-item label="名称:" style="width: 50%" prop="goods_name">
        <el-input v-model="model.goods_name"></el-input>
      </el-form-item>

      <!-- 图片 -->
      <el-form-item label="图片:">
        <el-upload
          ref="imgUpload"
          class="avatar-uploader"
          :action="$request.defaults.baseURL + '/uploadImg'"
          :show-file-list="false"
          :on-success="uploadImgSuccess"
        >
          <img v-if="model.img_src" :src="model.img_src" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="color: #aaa">
          请尽量使用比例 1:1 的正方形图片，且大小不要超过5M
        </span>
      </el-form-item>

      <!-- 说明 -->
      <el-form-item label="说明:" style="width: 60%">
        <el-input
          type="textarea"
          :rows="5"
          v-model="model.caption"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>

      <!-- 价格 -->
      <el-form-item label="价格:" style="width: 30%" prop="price">
        <el-input v-model="model.price">
          <template slot="append">元 </template>
        </el-input>
        <span style="color: #aaa">0元为免费</span>
      </el-form-item>

      <!-- 是否上架 -->
      <el-form-item label="是否上架:" required>
        <el-radio v-model="model.state" :label="1" border>上架</el-radio>
        <el-radio v-model="model.state" :label="0" border>暂不上架</el-radio>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(id)">{{
          id ? '立即修改' : '立即创建'
        }}</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    id: {}
  },
  data() {
    // 验证名称
    const verifyGoodsName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入名称'));
      } else {
        callback && callback(); // 这行一定要加 否则不进入表单整体验证
      }
    };

    // 验证价格
    const verifyPrice = (rule, value, callback) => {
      const reg = /^\d+(\.(\d){1,2})?$/;
      if (value !== '') {
        if (!reg.test(value)) {
          callback(new Error('只能输入数字且最多保留两位小数'));
        } else {
          callback && callback(); // 这行一定要加 否则不进入表单整体验证
        }
      } else {
        callback(new Error('请输入价格'));
      }
    };

    return {
      // 编辑信息集合
      model: {
        category_id: 0,
        goods_name: '',
        img_src: '',
        caption: '',
        price: '',
        state: 1
      },
      // 原商品名称
      old_name: '',
      // 验证表单
      rules: {
        goods_name: [
          {
            required: true,
            validator: verifyGoodsName,
            trigger: ['change', 'blur']
          }
        ],
        price: [
          {
            required: true,
            validator: verifyPrice,
            trigger: ['change', 'blur']
          }
        ]
      },
      // 分类数据
      categoryList: [],
      // 加载动画
      loading: false
    };
  },

  created() {
    this.getCategoryList(); // 获取分类
    this.id && this.getInfo(); // 有id就执行函数
  },
  methods: {
    // 获取要编辑的信息
    async getInfo() {
      this.loading = true;
      // 获取商品信息
      const res = await this.$request({
        url: '/goodsInfo',
        params: {
          id: this.id
        }
      });
      this.model = res.data[0];
      this.old_name = res.data[0].goods_name;
      this.loading = false;
    },

    // 获取分类
    async getCategoryList() {
      this.loading = true;

      const category = await this.$request({ url: '/categoryList' });
      this.categoryList = category.data;

      if (!this.id) {
        // 如果不是编辑就给个默认值
        this.model.category_id = category.data[0].id;
      }
      this.loading = false;
    },
    // 上传图片成功
    uploadImgSuccess(response, file) {
      console.log(response);
      console.log(file);
      this.model.img_src = response.file.url;
    },

    // 创建 或者 修改
    async submitForm(id) {
      // 验证表单
      this.$refs['goodsForm'].validate(async (valid) => {
        if (!valid) {
          this.$message({ message: '请正确填写必填项！', type: 'error' });
          return valid; // 表单验证错误则阻断后面代码
        }

        // 编辑时名称不变 则不执行查询是否同名称
        if (!(this.old_name && this.model.goods_name == this.old_name)) {
          // 查询是否同名称的商品
          const listData = await this.$request({
            url: '/searchGoods',
            params: { val: this.model.goods_name }
          });

          // 如果存在同名称的商品 阻断后面代码
          if (listData.data.length) {
            return this.$message({
              message: '该商品名称已经存在',
              type: 'error'
            });
          }
        }

        const data = this.model;
        const url = id ? '/modifyGoods' : '/addGoods'; // 修改 or 创建
        const method = id ? 'post' : 'put';
        const res = await this.$request({ url, method, data });

        if (res.code == 200) {
          const message = id ? '修改成功' : '创建成功';
          this.$message({ message, type: 'success' });
          this.$router.push({ name: 'goodsList' });
        } else {
          const message = id ? '修改失败！' : '创建失败！';
          this.$message({ message, type: 'error' });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-form {
  padding: 20px;
  .el-form {
    // margin: 0 auto;
    width: 90%;
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      border: 1px dashed #d9d9d9;
      font-size: 28px;
      color: #8c939d;
      width: 178px;
      height: 178px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      max-width: 300px;
      max-height: 300px;
      display: block;
    }
  }
}
</style>