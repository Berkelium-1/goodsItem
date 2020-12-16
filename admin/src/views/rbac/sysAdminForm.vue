<template>
  <div
    class="sys-admin-form"
    v-loading="loading"
    @keydown.enter="submitForm(id)"
  >
    <el-form ref="adminForm" :model="model" :rules="rules" label-width="100px">
      <!-- 用户名称 -->
      <el-form-item label="用户名称:" prop="admin_name" class="admin-name">
        <el-input
          v-model="model.admin_name"
          placeholder="请输入用户名称"
        ></el-input>
        <!-- <span style="color: #aaa">为了美观，建议中文控制在4个字以内</span> -->
      </el-form-item>

      <!-- 用户账号 -->
      <el-form-item
        label="用户账号:"
        prop="login_account"
        class="login-account"
      >
        <el-input
          v-model="model.login_account"
          placeholder="请输入账号"
        ></el-input>
        <span style="color: #aaa">8 ~ 16位数字</span>
      </el-form-item>

      <!-- 用户密码 -->
      <el-form-item
        label="用户密码:"
        prop="login_password"
        class="login-password"
      >
        <el-input
          type="password"
          v-model="model.login_password"
          placeholder="请输入密码"
        ></el-input>
        <span style="color: #aaa">仅支持 英文、数字、下划线</span>
      </el-form-item>

      <!-- 再次输入用户密码 -->
      <el-form-item
        label="确认密码:"
        prop="login_password2"
        class="login-password"
      >
        <el-input
          type="password"
          v-model="model.login_password2"
          placeholder="请再次输入密码"
        ></el-input>
      </el-form-item>

      <!-- 图片 -->
      <el-form-item label="图片:" class="upload-img">
        <el-upload
          ref="imgUpload"
          class="avatar-uploader"
          :action="$request.defaults.baseURL + '/uploadImg'"
          :show-file-list="false"
          :on-success="uploadImgSuccess"
        >
          <img v-if="model.avatar" :src="model.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span class="note">
          请尽量使用比例 1:1 的正方形图片，且大小不要超过5M
        </span>
      </el-form-item>

      <!-- 备注 -->
      <el-form-item label="备注:" class="admin-desc" style="width: 60%">
        <el-input
          type="textarea"
          :rows="5"
          maxlength="100"
          show-word-limit
          v-model="model.admin_desc"
          placeholder="请输入角色说明"
        ></el-input>
      </el-form-item>

      <!-- 角色绑定 -->
      <el-form-item
        label="角色绑定:"
        class="role-right"
        style="width: 60%"
        v-if="!model.admin_root"
      >
        <el-checkbox
          v-for="item in roleData"
          :key="item.role_id"
          :label="item.role_name"
          v-model="item.checked"
          border
        ></el-checkbox>
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
    const verifyAdminName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入名称'));
      } else {
        callback && callback(); // 这行一定要加 否则不进入表单整体验证
      }
    };
    // 验证账号
    const verifyAccount = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入账号'));
      } else {
        const reg = /^\d{8,16}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入8 ~ 16位的数字'));
        } else {
          callback && callback(); // 这行一定要加 否则不进入表单整体验证
        }
      }
    };
    // 验证密码
    const verifyPassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入密码'));
      } else if (value.length < 6) {
        callback(new Error('至少要6个字符长度'));
      } else {
        const reg = /^[\d_\w]{6,20}$/;
        if (!reg.test(value)) {
          callback(new Error('密码格式有误！'));
        } else {
          callback && callback(); // 这行一定要加 否则不进入表单整体验证
        }
      }
    };
    // 验证再次输入的密码
    var verifyPassword2 = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.model.login_password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback && callback(); // 这行一定要加 否则不进入表单整体验证
      }
    };
    return {
      // 编辑信息集合
      model: {
        admin_name: '',
        admin_desc: '',
        login_account: '',
        login_password: '',
        avatar: '',
        login_password2: '',
        admin_root: 0
      },
      admin_role: [], // 当前绑定的角色id
      roleData: [], // 角色数据
      old_name: '',
      old_account: '',
      loading: false, // 加载动画
      // 表单验证规则
      rules: {
        admin_name: [
          {
            required: true,
            validator: verifyAdminName,
            trigger: ['change', 'blur']
          }
        ],
        login_account: [
          {
            required: true,
            validator: verifyAccount,
            trigger: ['blur']
          }
        ],
        login_password: [
          {
            required: true,
            validator: verifyPassword,
            trigger: ['blur']
          }
        ],
        login_password2: [
          {
            required: true,
            validator: verifyPassword2,
            trigger: ['blur']
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
    // 初始化
    this.init();
  },
  computed: {
    ...mapGetters(['role_root', 'admin_id'])
  },
  methods: {
    // 初始化内容
    async init() {
      this.loading = true;
      await this.getAllRole();
      this.id && (await this.getInfo()); // 有id就执行函数
      this.loading = false;
    },

    // 获取所有角色
    async getAllRole() {
      const res = await this.$request({ url: '/getAllRole' });
      this.roleData = res.data.map((v) => {
        v.checked = false;
        return v;
      });
    },

    // 获取要编辑的信息
    async getInfo() {
      const res = await this.$request({
        url: '/adminInfo',
        params: {
          admin_id: this.id
        }
      });

      res.info.login_password2 = res.info.login_password;

      this.model = res.info;

      this.old_name = res.info.admin_name;
      this.old_account = res.info.login_account;

      this.roleData = this.roleData.map((v) => {
        v.checked = res.roles.some((roleId) => v.role_id === roleId);
        return v;
      });
    },

    // 上传图片成功
    uploadImgSuccess(response, file) {
      this.model.avatar = response.file.url;
    },

    // 按下创建 或者 修改
    async submitForm(id) {
      // 验证表单
      this.$refs['adminForm'].validate(async (valid) => {
        this.loading = true;

        if (!valid) {
          this.$message({ message: '请正确填写必填项！', type: 'error' });
          this.loading = false;
          return valid; // 表单验证错误则阻断后面代码
        }

        // 编辑时名称不变 则不执行查询是否重复
        if (!(this.old_name && this.model.admin_name == this.old_name)) {
          // 查询是否重复
          const isRepeatName = await this.$request({
            url: '/isRepeatAdmin',
            params: {
              admin_name: this.model.admin_name
            }
          });

          // 如果存在重复的用户名 阻断后面代码
          if (isRepeatName.msg) {
            this.$message({ message: '用户名已存在', type: 'error' });
            this.loading = false;
            return false;
          }
        }

        // 编辑时账号不变 则不执行查询是否重复
        const old_account = this.old_account;
        if (!(this.old_account && this.model.login_account == old_account)) {
          // 查询是否重复
          const isRepeatName = await this.$request({
            url: '/isRepeatAdmin',
            params: {
              login_account: this.model.login_account
            }
          });

          // 如果存在重复的账号 阻断后面代码
          if (isRepeatName.msg) {
            this.$message({ message: '账号已存在', type: 'error' });
            this.loading = false;
            return false;
          }
        }

        // 所有角色id
        const roles = this.roleData
          .filter((v) => v.checked)
          .map((v) => (v = v.role_id));

        // 用户信息
        const {
          admin_name,
          admin_desc,
          login_account,
          login_password,
          avatar
        } = this.model;

        const url = id ? '/modifyAdminUser' : '/addAdminUser'; // 修改角色 or 创建角色
        const method = id ? 'post' : 'put';
        const data = {
          admin_name,
          admin_desc,
          login_account,
          login_password,
          avatar,
          roles
        };

        if (id) data.admin_id = id;

        const res = await this.$request({ url, method, data });

        // 如果编辑的是自己
        if (id === this.admin_id) {
          // 获取用户信息
          await this.$store.dispatch('user/getInfo');
        }

        if (res.code == 200) {
          const message = id ? '修改成功' : '创建成功';
          this.$message({ message, type: 'success', center: true });
          this.$router.push({ name: 'sysAdmins' });
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
.sys-admin-form {
  padding: 20px;
  .el-form {
    // margin: 0 auto;
    width: 90%;
    .admin-name,
    .login-account,
    .login-password {
      .el-input {
        width: 50%;
      }
      span {
        margin-left: 10px;
      }
    }

    .upload-img {
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      .avatar-uploader-icon {
        border: 1px dashed #d9d9d9;
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        max-width: 300px;
        max-height: 300px;
        display: block;
      }

      span.note {
        color: #aaa;
      }
    }
  }
}
</style>