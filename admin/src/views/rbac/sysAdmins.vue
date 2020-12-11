<template>
  <div class="sys-admins">
    <header>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="$router.push({ name: 'addSysAdmin' })"
      >
        新建用户
      </el-button>
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
        label="用户ID"
        width="180"
        align="center"
      ></el-table-column>

      <el-table-column prop="avatar" label="头像" align="center" width="200">
        <template slot-scope="{ row }">
          <img :src="row.avatar" :alt="row.avatar" />
        </template>
      </el-table-column>

      <el-table-column
        prop="admin_name"
        label="用户名称"
        align="center"
        width="280"
      ></el-table-column>

      <el-table-column prop="latest_time" label="最近登录时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.latest_time || '未使用' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" align="center" width="200">
        <template slot-scope="{ row }">
          <span v-if="row.status" class="success-text">正常</span>
          <span v-else class="error-text">冻结</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            icon="el-icon-edit"
            v-if="!row.admin_root || role_root"
          >
            编辑
          </el-button>
          <span v-else> 无权限 </span>
          <el-button type="text" icon="el-icon-set-up" v-if="!row.admin_root">
            {{ row.status ? '冻结' : '启用' }}
          </el-button>
          <el-button type="text" icon="el-icon-delete" v-if="!row.admin_root">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
  computed: {
    ...mapGetters(['role_root'])
  },
  methods: {
    // 获取管理员数据
    async getSysAdmins() {
      this.loading = true;
      const res = await this.$request({ url: '/getSysAdmins' });
      this.tableData = res.data;
      this.loading = false;
    },

    // 删除角色
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