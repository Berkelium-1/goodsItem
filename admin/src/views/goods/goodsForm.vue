<template>
  <div class="goods-form" v-loading="loading">
    <el-form :model="model" label-width="80px">
      <el-form-item
        label="名称:"
        :rules="{ required: true, message: '请输入活动名称', trigger: 'blur' }"
        style="width: 50%"
      >
        <el-input v-model="model.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="图片:">
        <el-upload
          class="avatar-uploader"
          :action="$request.defaults.baseURL + '/uploadImg'"
          :show-file-list="false"
          :on-success="uploadImgSuccess"
        >
          <img v-if="model.img_src" :src="model.img_src" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span style="color: #aaa">请使用比例 1:1 的正方形图片</span>
      </el-form-item>
      <el-form-item label="说明:" style="width: 60%">
        <el-input
          type="textarea"
          :rows="5"
          v-model="model.desc"
          maxlength="100"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item
        label="价格:"
        :rules="{
          required: true,
          regexp: /^\d+(\.(\d){1,2})?$/,
          message: '格式有误, 请输入数字且最多保留两位小数',
          trigger: 'input'
        }"
        style="width: 30%"
      >
        <el-input v-model="model.price">
          <template slot="append">元</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="confirmDown(id)">{{
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
    return {
      // 编辑信息集合
      model: {
        goods_name: '',
        img_src: '',
        desc: '',
        price: ''
      },
      // 表单验证规则
      // required  是否必填
      // message 提示信息
      // trigger 触发条件
      rules: {
        name: { required: true, message: '请输入活动名称', trigger: 'blur' },
        price: [
          // { required: true, message: '请输入价格', trigger: 'blur' },
          {
            required: true,
            regexp: /^\d+(\.(\d){1,2})?$/,
            message: '格式有误, 请输入数字且最多保留两位小数',
            trigger: 'input'
          }
        ]
      },
      loading: false // 加载动画
    };
  },

  created() {
    this.id && this.getInfo(); // 有id就执行函数
  },
  methods: {
    // 获取要编辑的信息
    async getInfo() {
      console.log(this.id);
      const res = await this.$request({
        url: '/goodsInfo',
        params: {
          id: this.id
        }
      });
      this.model = res.data[0];
    },
    // 按下创建 或者 修改
    async confirmDown(id) {
      return;
      if (id) {
        const { category_name } = this.model;
        // 修改分类
        const res = await this.$request({
          url: '/modifyGoods',
          method: 'post',
          data: { id, category_name }
        });
        if (res.code == 200) {
          this.$message({ message: '修改成功', type: 'success', center: true });
          this.$router.push({ name: 'categoryList' });
        } else {
          this.$message({ message: '修改失败！', type: 'error', center: true });
        }
      } else {
        // 创建分类
        const res = await this.$request({
          url: '/addGoods',
          method: 'put',
          data: this.model
        });
        if (res.code == 200) {
          this.$message({ message: '创建成功', type: 'success', center: true });
          this.$router.push({ name: 'categoryList' });
        } else {
          this.$message({ message: '创建失败', type: 'error', center: true });
        }
      }
    },
    // 上传图片成功
    uploadImgSuccess(response, file, fileList) {
      console.log(response);

      this.model.img_src = response.file.url;
    },
    // 验证表单
    regFrom() {
      console.log(/^\d+(\.(\d){1,2})?$/.test(this.model.price));
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
      width: 178px;
      height: 178px;
      display: block;
    }
  }
}
</style>