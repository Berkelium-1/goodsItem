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

              <div class="role">
                <label>role:</label>
                {{ role }}
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
location.search;
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['name', 'role', 'avatar'])
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
      .role {
        margin: 5px 0;
        font-size: 20px;
        label {
          display: inline-block;
          width: 25%;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
