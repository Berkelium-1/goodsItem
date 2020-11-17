<template>
  <div class="goods-list">
    <div class="header">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'addGoods' })"
        >新建商品</el-button
      >
      <label class="search">
        <el-input
          placeholder="商品ID/名称"
          prefix-icon="el-icon-search"
          v-model="val"
        />
        <el-button type="primary" @click="searchCategory(val)">搜索</el-button>
      </label>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      max-height="800"
      style="width: 100%"
      border
    >
      <!-- 商品ID -->
      <el-table-column
        prop="id"
        label="商品ID"
        width="180"
        align="center"
      ></el-table-column>

      <!-- 商品名称 -->
      <el-table-column
        prop="goods_name"
        label="名称"
        width="200"
        header-align="left"
      ></el-table-column>

      <!-- 商品图片 -->
      <el-table-column prop="img_scr" label="图片" width="350" align="center">
        <template slot-scope="item">
          <img :src="item.row.img_src" :alt="item.row.img_src" />
        </template>
      </el-table-column>

      <!-- 商品价格 -->
      <el-table-column
        prop="price"
        label="价格"
        width="180"
        align="center"
      ></el-table-column>

      <!-- 商品说明 -->
      <el-table-column
        prop="caption"
        label="说明"
        align="left"
        header-align="center"
      ></el-table-column>

      <!-- 操作按钮 -->
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="item">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="
              $router.push({
                name: 'editGoods',
                params: { id: item.row.id }
              })
            "
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="delGoods(item.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      val: '', // 搜索框的值
      loading: true,
      tableData: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 获取表格数据
    async getTableData() {
      this.loading = true; // 开启加载动画
      const res = await this.$request({ url: '/goodsList' });
      this.tableData = res.data;
      this.loading = false; // 关闭加载动画
    },
    // 搜索商品
    async searchGoods(val) {
      this.loading = true; // 开启加载动画
      const res = await this.$request({
        url: '/searchGoods',
        params: { val }
      });
      this.tableData = res.data;
      this.loading = false; // 关闭加载动画
    },
    // 删除商品
    delGoods(id) {
      this.$confirm('删除此商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确定
          const res = await this.$request({
            url: '/delGoods',
            method: 'delete',
            data: { id }
          });
          if (res.code == 200) {
            this.$message({
              message: '删除成功',
              type: 'success',
              center: true
            });
            this.getTableData();
          } else {
            this.$message({ message: '删除失败', type: 'error', center: true });
          }
        })
        .catch(() => {
          // 点击取消
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.goods-list {
  width: 90%;
  margin: 0 auto;
  padding: 20px 0;
  .header {
    display: flex;
    justify-content: space-between;
    .search {
      width: 25%;
      display: flex;
      .el-input {
        width: 75%;
        margin-right: auto;
      }
    }
  }
  .el-table {
    margin-top: 20px;
    img {
      margin: auto;
      max-width: 300px;
      max-height: 300px;
      height: auto;
    }
  }
}
</style>