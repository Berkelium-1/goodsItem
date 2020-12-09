<template>
  <div class="sys-admins">
    <header>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'addSysAdmin' })"
        >新建用户</el-button
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
        prop="admin_id"
        label="管理员ID"
        width="180"
        align="center"
      ></el-table-column>

      <el-table-column
        prop="admin_name"
        label="管理员名称"
        align="center"
      ></el-table-column>

      <el-table-column prop="avatar" width="200" label="头像" align="center">
        <template slot-scope="item">
          <img :src="item.row.avatar" :alt="item.row.avatar" />
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="item">
          <span v-if="item.row.status">启用</span>
          <span v-else>未启用</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="item">
          <el-button type="text" icon="el-icon-edit"> 编辑 </el-button>
          <el-button
            type="text"
            icon="el-icon-delete"
            v-if="!item.row.admin_root"
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
    this.getSysAdmins();
  },
  methods: {
    // 获取管理员数据
    async getSysAdmins() {
      this.loading = true;
      const res = await this.$request({ url: '/getSysAdmins' });
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
.sys-admins {
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