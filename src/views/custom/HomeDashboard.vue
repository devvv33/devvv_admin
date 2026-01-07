<template>
  <div class="dashboard-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="总用户数" :value="5678">
            <template #suffix>
              <el-icon style="vertical-align: -0.125em">
                <User />
              </el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="今日访问" :value="1234">
            <template #suffix>
              <el-icon style="vertical-align: -0.125em">
                <View />
              </el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="系统版本" value="1">
            <template #suffix>
              <el-icon style="vertical-align: -0.125em">
                <Setting />
              </el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="在线用户" :value="89">
            <template #suffix>
              <el-icon style="vertical-align: -0.125em">
                <UserFilled />
              </el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, View, Setting, UserFilled } from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.dashboard-container {
  .stat-card {
    text-align: center;
  }
}
</style>

