<template>
  <div class="category-form" v-loading="loading">
    <el-form :model="model" label-width="80px">
      <el-form-item label="分类名称">
        <el-input v-model="model.category_name"></el-input>
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
  data() {
    return {
      // 编辑信息集合
      model: {
        category_name: ''
      },
      loading: false // 加载动画
    };
  },
  props: {
    id: {}
  },
  created() {
    this.id && this.getInfo(); // 有id就执行函数
  },
  methods: {
    // 获取要编辑的信息
    async getInfo() {
      console.log(this.id);
      const res = await this.$request({
        url: '/categoryInfo',
        params: {
          id: this.id
        }
      });
      this.model = res.data[0];
    },
    // 按下创建 或者 修改
    async confirmDown(id) {
      if (id) {
        const { category_name } = this.model;
        // 修改分类
        const res = await this.$request({
          url: '/modifyCategory',
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
          url: '/addCategory',
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
  }
}
</style>