<template>
  <div class="ctrl">
    <div class="collapse-content">
      <el-collapse :value="value" accordion>
        <el-collapse-item title="路由权限" :name="1">
          <el-tree
            :data="routerTreeData"
            node-key="router_url"
            :default-checked-keys="default_checked"
            default-expand-all
            highlight-current
          >
            <template slot-scope="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ data.meta.title }}</span>
                <el-button
                  class="btn"
                  v-if="
                    !node.checked &&
                    !(data.children && data.children.length > 0)
                  "
                  type="text"
                  size="mini"
                  @click="addPermissionRouter(node, data)"
                >
                  设为权限路由
                </el-button>
              </div>
            </template>
          </el-tree>
        </el-collapse-item>

        <el-collapse-item title="其它权限" :name="2">
          <div>暂无其它权限</div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      value: 1, // 默认展开第一个折叠面板
      default_checked: [] // 默认勾选的数组
    };
  },
  computed: {
    ...mapGetters(['rbac_router']),
    // 路由权限 Tree 数据
    routerTreeData() {
      const routerTreeData = JSON.parse(JSON.stringify(this.rbac_router));
      routerTreeData.forEach((v) => {
        v.router_url = v.path;
        if (v.children && v.children.length > 0) {
          v.children.forEach((child) => {
            child.router_url = `${v.path}/${child.path}`;
          });
        }
      });
      return routerTreeData;
    }
  },
  created() {
    this.getDefaultChecked();
  },
  methods: {
    async getDefaultChecked() {
      const res = await this.$request({ url: '/permissionRouter' });
      this.default_checked = res.data;
    },
    // 添加权限路由
    async addPermissionRouter(node, data) {
      const parent = node.parent.data;
      const child = data;
      const res = await this.$request({
        url: '/addPermissionRouter',
        method: 'put',
        data: { parent, child }
      });
      if (res.code == 200) {
        this.$message({ message: '添加成功', type: 'success' });
        this.getDefaultChecked(); // 刷新数据
      } else {
        this.$message({ message: '添加失败', type: 'error' });
      }
    },
    setChecked(data, checked, deep) {
      return setChecked(data, checked, deep);
    }
  }
};
</script>

<style lang="scss" scoped>
.ctrl {
  .collapse-content {
    margin: 0 auto;
    width: 90%;

    .el-tree {
      width: 100%;
      .custom-tree-node {
        width: 100%;
        display: flex;
        align-items: center;
        .btn {
          margin-left: auto;
        }
      }
    }
  }
}
</style>