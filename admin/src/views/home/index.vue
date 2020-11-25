<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :md="8" :sm="24">
        <el-card class="user-card" shadow="hover">
          <el-row :gutter="20">
            <el-col :span="6" class="col-avatar">
              <div class="avatar">
                <img :src="avatar" />
              </div>
            </el-col>

            <el-col :span="18" class="col-info">
              <div class="name">
                <label>name:</label>
                {{ name }}
              </div>
              <div class="power">
                <label>power:</label>
                {{ power == 1 ? '管理员' : '超级管理员' }}
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import 'element-ui/lib/theme-chalk/display.css';

export default {
  computed: {
    ...mapGetters(['name', 'power', 'avatar'])
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin: 30px;

  .user-card {
    .el-col.col-avatar {
      display: flex;
      justify-content: center;
      align-items: center;
      .avatar {
        width: 100px;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
    .el-col.col-info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      .name,
      .power {
        margin: 5px 0;
        font-size: 20px;
        label {
          display: inline-block;
          width: 20%;
          // text-align: right;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
