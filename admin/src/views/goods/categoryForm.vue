<template>
  <div
    class="category-form"
    v-loading="loading"
    @keydown.enter="submitForm(id)"
  >
    <el-form ref="goodsForm" :model="model" :rules="rules" label-width="100px">
      <el-form-item
        label="分类名称:"
        prop="category_name"
        class="category-name"
        required
      >
        <el-input
          v-model="model.category_name"
          placeholder="请输入分类名称"
        ></el-input>
        <span style="color: #aaa">为了美观，建议中文控制在4个字以内</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(id)">
          {{ id ? '立即修改' : '立即创建' }}
        </el-button>
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
    return {
      // 编辑信息集合
      model: {
        category_name: ''
      },
      old_name: '',
      loading: false, // 加载动画
      // 表单验证规则
      rules: {
        category_name: [
          {
            required: true,
            validator: verifyGoodsName,
            trigger: ['change', 'blur']
          }
        ]
      }
    };
  },

  created() {
    this.id && this.getInfo(); // 有id就执行函数
  },
  methods: {
    // 获取要编辑的信息
    async getInfo() {
      const res = await this.$request({
        url: '/categoryInfo',
        params: {
          id: this.id
        }
      });
      this.model = res.data[0];
      this.old_name = res.data[0].category_name;
    },
    // 按下创建 或者 修改
    async submitForm(id) {
      // 验证表单
      this.$refs['goodsForm'].validate(async (valid) => {
        if (!valid) {
          // this.$message({ message: '请正确填写必填项！', type: 'error' });
          return valid; // 表单验证错误则阻断后面代码
        }

        // 编辑时名称不变 则不执行查询是否同名称
        if (!(this.old_name && this.model.category_name == this.old_name)) {
          // 查询是否同名称的商品
          const isRepeatName = await this.$request({
            url: '/isRepeatCategoryName',
            params: { category_name: this.model.category_name }
          });

          // 如果存在同名称的分类 阻断后面代码
          if (isRepeatName.msg) {
            return this.$message({ message: '此分类已存在', type: 'error' });
          }
        }

        const url = id ? '/modifyCategory' : '/addCategory'; // 修改分类 or 创建分类
        const method = id ? 'post' : 'put';
        const { category_name } = this.model;
        const data = id ? { id, category_name } : { category_name };
        const res = await this.$request({ url, method, data });

        if (res.code == 200) {
          const message = id ? '修改成功' : '创建成功';
          this.$message({ message, type: 'success', center: true });
          this.$router.push({ name: 'categoryList' });
        } else {
          const message = id ? '修改失败' : '创建失败';
          this.$message({ message, type: 'error', center: true });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.category-form {
  padding: 20px;
  .el-form {
    // margin: 0 auto;
    width: 90%;
    .category-name {
      .el-input {
        width: 50%;
      }
      span {
        margin-left: 10px;
      }
    }
  }
}
</style>