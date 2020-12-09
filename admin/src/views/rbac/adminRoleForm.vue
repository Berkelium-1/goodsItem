<template>
  <div
    class="admin-role-form"
    v-loading="loading"
    @keydown.enter="submitForm(id)"
  >
    <el-form ref="roleForm" :model="model" :rules="rules" label-width="100px">
      <!-- 角色名称 -->
      <el-form-item
        label="角色名称:"
        prop="role_name"
        class="role-name"
        required
      >
        <el-input
          v-model="model.role_name"
          placeholder="请输入角色名称"
        ></el-input>
        <!-- <span style="color: #aaa">为了美观，建议中文控制在4个字以内</span> -->
      </el-form-item>

      <!-- 角色说明 -->
      <el-form-item label="角色说明:" class="role-desc" style="width: 60%">
        <el-input
          type="textarea"
          :rows="5"
          maxlength="100"
          show-word-limit
          v-model="model.role_desc"
          placeholder="请输入角色说明"
        ></el-input>
      </el-form-item>

      <!-- 角色权限 -->
      <el-form-item
        label="角色权限:"
        class="role-right"
        style="width: 60%"
        v-if="!model.role_root"
      >
        <el-tabs type="card">
          <el-tab-pane>
            <span slot="label">路由权限</span>
            <el-tree
              ref="routerTree"
              :data="routerTreeData"
              node-key="path"
              :default-checked-keys="router_default_checked"
              default-expand-all
              highlight-current
              show-checkbox
            >
            </el-tree>
          </el-tab-pane>
          <el-tab-pane>
            <span slot="label">其它权限</span>
            暂无其它权限
          </el-tab-pane>
        </el-tabs>
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
import { mapGetters } from 'vuex';

export default {
  props: {
    id: {}
  },
  data() {
    // 验证名称
    const verifyRoleName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入名称'));
      } else {
        callback && callback(); // 这行一定要加 否则不进入表单整体验证
      }
    };
    return {
      // 编辑信息集合
      model: {
        role_name: '',
        role_desc: '',
        role_root: 0
      },
      old_name: '',
      loading: false, // 加载动画
      // 表单验证规则
      rules: {
        role_name: [
          {
            required: true,
            validator: verifyRoleName,
            trigger: ['change', 'blur']
          }
        ]
      },
      // 路由权限数据
      routerTreeData: [],
      // 路由权限默认勾选
      router_default_checked: []
    };
  },

  created() {
    this.init();
  },
  methods: {
    // 初始化内容
    async init() {
      this.loading = true;
      this.id && (await this.getInfo()); // 有id就执行函数
      await this.getRight();
      this.loading = false;
    },

    // 获取权限信息
    async getRight() {
      const res = await this.$request({ url: '/getRight' });
      this.routerTreeData = res.router_roles; // 路由权限设置
    },

    // 获取要编辑的信息
    async getInfo() {
      const res = await this.$request({
        url: '/roleInfo',
        params: {
          role_id: this.id
        }
      });
      this.model = res.info;
      this.old_name = res.info.role_name;
      this.router_default_checked = res.router_rights;
    },

    // 按下创建 或者 修改
    async submitForm(id) {
      // 验证表单
      this.$refs['roleForm'].validate(async (valid) => {
        this.loading = true;

        if (!valid) {
          this.$message({ message: '请正确填写必填项！', type: 'error' });
          return valid; // 表单验证错误则阻断后面代码
        }

        // 编辑时名称不变 则不执行查询是否同名称
        if (!(this.old_name && this.model.role_name == this.old_name)) {
          // 查询是否同名称
          const isRepeatName = await this.$request({
            url: '/isRepeatRoleName',
            params: { role_name: this.model.role_name }
          });

          // 如果存在同名称的分类 阻断后面代码
          if (isRepeatName.msg) {
            return this.$message({ message: '此角色已存在', type: 'error' });
          }
        }
        const routerCheckedNodes = this.$refs['routerTree'].getCheckedNodes();
        const router_rights = []; // 所有的路由权限id

        routerCheckedNodes.forEach((v) => {
          if (v.right_id) {
            router_rights.push(v.right_id);
          }
        });

        const url = id ? '/modifyRole' : '/addRole'; // 修改角色 or 创建角色
        const method = id ? 'post' : 'put';
        const { role_name, role_desc } = this.model;
        const data = { role_name, role_desc, router_rights };

        if (id) data.role_id = id;

        const res = await this.$request({ url, method, data });

        if (res.code == 200) {
          const message = id ? '修改成功' : '创建成功';
          this.$message({ message, type: 'success', center: true });
          this.$router.push({ name: 'adminRoles' });
        } else {
          const message = id ? '修改失败' : '创建失败';
          this.$message({ message, type: 'error', center: true });
        }
        this.loading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-role-form {
  padding: 20px;
  .el-form {
    // margin: 0 auto;
    width: 90%;
    .role-name {
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