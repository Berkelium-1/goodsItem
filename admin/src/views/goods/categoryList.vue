<template>
  <div class="category-list">
    <div class="header">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'addCategory' })"
        >新建分类</el-button
      >
      <label class="search">
        <el-input
          placeholder="分类ID/名称"
          prefix-icon="el-icon-search"
          v-model="keyword"
        />
        <el-button type="primary" @click="searchCategory(keyword, pageSize)"
          >搜索</el-button
        >
      </label>
    </div>
    <el-table
      v-loading="loading"
      :data="tableData"
      max-height="800"
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="分类ID"
        width="180"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="category_name"
        label="名称"
        header-align="left"
      ></el-table-column>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="item">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="
              $router.push({
                name: 'editCategory',
                params: { id: item.row.id }
              })
            "
            >编辑</el-button
          >
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="delCategory(item.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-pagination
      background
      :page-size="pageSize"
      :current-page="nowPage"
      layout="prev, pager, next, total"
      :total="pageTotal"
      :hide-on-single-page="false"
      @current-change="changePage"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '', // 搜索框的值
      loading: true,
      tableData: [],
      nowPage: 1, // 当前页
      pageSize: 5, // 每页显示的条数
      pageTotal: 0 // 总条数
    };
  },
  created() {
    this.getTableData(this.keyword, this.pageSize, this.nowPage);
  },
  methods: {
    // 获取表格数据
    async getTableData(keyword, pageSize, current) {
      this.loading = true; // 开启加载动画
      const res = await this.$request({
        url: '/categoryList',
        params: { keyword, pageSize, current }
      });
      this.tableData = res.data;
      this.pageTotal = res.total;
      this.loading = false; // 关闭加载动画
    },
    // 搜索分类
    async searchCategory(keyword, pageSize) {
      this.loading = true; // 开启加载动画
      const res = await this.$request({
        url: '/searchCategory',
        params: { keyword, pageSize }
      });
      this.tableData = res.data;
      this.pageTotal = res.total;
      this.nowPage = 1;
      this.loading = false; // 关闭加载动画
    },
    // 删除分类
    delCategory(id) {
      this.$confirm('删除此分类和分类下的所有商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确定
          const res = await this.$request({
            url: '/delCategory',
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
    },
    // 翻页
    changePage(nowPage) {
      this.getTableData(this.keyword, this.pageSize, nowPage);
    }
  }
};
</script>

<style lang="scss" scoped>
.category-list {
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
  }
  .el-pagination {
    margin: 50px auto;
    display: flex;
    justify-content: center;
  }
}
</style>