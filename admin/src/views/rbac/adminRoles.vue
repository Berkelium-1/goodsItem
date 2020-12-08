<template>
  <div class="admin-roles">
    <header>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'addAdminRole' })"
        >新建角色</el-button
      >
    </header>
    <el-table
      v-loading="loading"
      :data="tableData"
      max-height="800"
      style="width: 100%"
      border
    >
      <el-table-column
        prop="role_id"
        label="角色ID"
        width="180"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="role_name"
        label="角色名称"
        align="center"
        width="300"
      ></el-table-column>

      <el-table-column
        prop="role_desc"
        label="角色说明"
        align="center"
      ></el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="item">
          <el-button
            type="text"
            icon="el-icon-edit"
            @click="
              $router.push({
                name: 'editAdminRole',
                params: { id: item.row.id }
              })
            "
            >编辑</el-button
          >
          <el-button type="text" icon="el-icon-delete">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // 树状控件数据
      treeData: null,
      // 加载动画
      loading: false
    };
  },
  created() {
    this.getAdminRoles();
  },
  methods: {
    // 获取角色数据
    async getAdminRoles() {
      this.loading = true;
      const res = await this.$request({ url: '/getAdminRoles' });
      this.tableData = res.data;
      this.loading = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-roles {
  width: 90%;
  margin: 0 auto;
  padding: 20px 0;
  header {
    display: flex;
  }
  .el-table {
    margin-top: 20px;
  }
}
</style>