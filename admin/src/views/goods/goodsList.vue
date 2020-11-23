<template>
  <div class="goods-list">
    <div class="header">
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'addGoods' })"
        >新建商品</el-button
      >
      <el-select
        v-model="value"
        filterable
        placeholder="请选择"
        @change="searchGoods(keyword, value, pageSize)"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.category_name"
          :label="item.category_name"
          :value="item.id"
        >
        </el-option>
      </el-select>
      <label class="search">
        <el-input
          placeholder="商品ID/名称"
          prefix-icon="el-icon-search"
          v-model="keyword"
        />
        <el-button type="primary" @click="searchGoods(keyword, value, pageSize)"
          >搜索</el-button
        >
      </label>
    </div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
      <!-- 商品ID -->
      <el-table-column
        prop="id"
        label="商品ID"
        width="80"
        align="center"
      ></el-table-column>

      <!-- 商品名称 -->
      <el-table-column
        prop="goods_name"
        label="商品名称"
        width="230"
        align="center"
      ></el-table-column>

      <!-- 商品图片 -->
      <el-table-column prop="img_scr" label="图片" width="180" align="center">
        <template slot-scope="item">
          <img :src="item.row.img_src" :alt="item.row.img_src" />
        </template>
      </el-table-column>

      <!-- 商品价格 -->
      <el-table-column prop="price" label="价格" width="100" align="center">
        <template slot-scope="item"> {{ item.row.price }}元 </template>
      </el-table-column>

      <!-- 商品状态 -->
      <el-table-column prop="state" label="状态" width="100" align="center">
        <template slot-scope="item">
          <span v-if="item.row.state === 0">未上架</span>
          <span v-else-if="item.row.state == 1">上架</span>
          <span v-else-if="item.row.state == 2">下架</span>
        </template>
      </el-table-column>

      <!-- 商品说明 -->
      <el-table-column
        prop="caption"
        label="说明"
        align="left"
        header-align="center"
      ></el-table-column>

      <!-- 操作按钮 -->
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="item">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="editGoods(item.row.id)"
          >
            编辑
          </el-button>

          <el-button
            type="text"
            icon="el-icon-sort"
            @click="changeState(item.row.state, item.row.id)"
          >
            {{ item.row.state === 1 ? '下架' : '上架' }}
          </el-button>

          <el-button
            type="text"
            icon="el-icon-delete"
            @click="delGoods(item.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      :page-size="pageSize"
      :current-page="nowPage"
      layout="prev, pager, next, total"
      :total="pageTotal"
      :hide-on-single-page="false"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: 0, // 选择器的值
      categoryList: [{ id: 0, category_name: '全部' }], // 分类
      keyword: '', // 搜索框的值
      loading: false, // 加载动画
      tableData: [], // 商品表格
      nowPage: 1, // 当前页
      pageSize: 10, // 每页显示的条数
      pageTotal: 0 // 总条数
    };
  },
  created() {
    this.getTableData(this.pageSize);
    this.getCategoryList();
  },
  methods: {
    // 获取表格数据
    async getTableData(limit) {
      this.loading = true; // 开启加载动画
      const res = await this.$request({ url: '/goodsList', params: { limit } });
      this.tableData = res.data;
      this.loading = false; // 关闭加载动画
    },

    // 获取分类
    async getCategoryList() {
      const category = await this.$request({ url: '/categoryList' });
      this.categoryList.push(...category.data);
    },

    // 搜索商品
    async searchGoods(keyword, category_id, limit) {
      this.loading = true; // 开启加载动画
      const res = await this.$request({
        url: '/searchGoods',
        params: { keyword, category_id, limit }
      });
      this.tableData = res.data;
      this.loading = false; // 关闭加载动画
    },
    // 编辑商品
    editGoods(id) {
      this.$router.push({ name: 'editGoods', params: { id } });
    },
    // 改变上下架状态
    async changeState(state, id) {
      console.log(state);
      const res = await this.$request({
        url: '/changeState',
        method: 'post',
        data: { state, id }
      });
      if (res.code == 200) {
        const message = state == 1 ? '下架成功' : '上架成功';
        this.$message({ message, type: 'success', center: true });
        this.searchGoods(this.keyword, this.value, this.pageSize); // 刷新页面
      } else {
        const massage = state == 1 ? '下架失败' : '上架失败';
        this.$message({ message, type: 'error', center: true });
      }
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
    },
    // 翻页
    changePage() {}
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
    // justify-content: space-between;
    .el-button {
      margin-right: auto;
    }
    .el-select {
      margin-right: 20px;
    }
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
      max-width: 80%;
      max-height: 100px;
      height: auto;
    }
  }

  .el-pagination {
    margin: 0 auto;
    display: flex;
    justify-content: center;
  }
}
</style>