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
                params: { id: item.row.role_id }
              })
            "
          >
            编辑
          </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            @click="delRole(item.row.role_id)"
            v-if="!item.row.role_root"
          >
            删除
          </el-button>
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
    },
    delRole(role_id) {
      this.$confirm('删除此角色会使关联此角色的用户失去此角色的权限', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$request({
            url: '/delRole',
            method: 'delete',
            data: { role_id }
          });
          if (res.code == 200) {
            this.$message({ message: '删除成功', type: 'success' });
            this.getAdminRoles();
          } else {
            this.$message({ message: '删除失败', type: 'error' });
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