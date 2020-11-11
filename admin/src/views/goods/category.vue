<template>
  <div>
    <el-table :data="tableData" max-height="800" style="width: 90%">
      <el-table-column prop="id" label="分类ID" width="180"> </el-table-column>
      <el-table-column prop="category_name" label="名称" width="180">
      </el-table-column>
      <el-table-column label="操作"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: []
    };
  }
};
</script>

<style lang="less" scoped>
</style>