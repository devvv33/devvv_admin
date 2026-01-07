<template>
  <div class="welcome-container">
    <div class="welcome-card">

      <!-- 标题 -->
      <h1 class="welcome-title">欢迎访问管理系统</h1>
      
      <!-- 用户信息卡片 -->
      <el-card class="user-info-card" shadow="never">
        <div class="info-row">
          <span class="info-label">当前角色:</span>
          <div class="role-tags">
            <el-tag 
              v-for="role in userRoles" 
              :key="role.id" 
              type="info" 
              size="large"
              class="role-tag"
            >
              {{ role.roleName }}
            </el-tag>
            <el-tag v-if="userRoles.length === 0" type="info" size="large">
              游客
            </el-tag>
          </div>
        </div>
      </el-card>

      <!-- 提示信息 -->
      <div class="notice-section">
        <el-alert
          type="warning"
          :closable="false"
          show-icon
        >
          <template #title>
            <div class="alert-title">访问受限提示</div>
          </template>
          <div class="alert-content">
            <p class="notice-text">
              这是一个内部管理系统，不对外提供访问。
            </p>
            <p class="notice-text">
              如果您是系统使用人员，请联系管理员分配相应权限。
            </p>
          </div>
        </el-alert>
      </div>

      <!-- 权限申请信息 -->
      <div class="request-section">
        <h2 class="section-title">申请权限需提供以下信息</h2>
        
        <el-card class="request-card" shadow="hover">
          <div class="request-item">
            <div class="request-label">
              <el-icon class="item-icon">
                <User />
              </el-icon>
              <span>用户ID</span>
            </div>
            <div class="request-value">
              <el-input 
                :value="userId" 
                readonly 
                class="readonly-input"
              >
                <template #append>
                  <el-button 
                    :icon="CopyDocument" 
                    @click="copyToClipboard(userId, '用户ID')"
                    class="copy-button"
                  >
                    复制
                  </el-button>
                </template>
              </el-input>
            </div>
          </div>

          <el-divider />

          <div class="request-item">
            <div class="request-label">
              <el-icon class="item-icon">
                <OfficeBuilding />
              </el-icon>
              <span>所属部门</span>
            </div>
            <div class="request-value">
              <el-input 
                v-model="departmentInput" 
                placeholder="请填写您的部门名称"
                clearable
              />
            </div>
          </div>

          <el-divider />

          <div class="request-item">
            <div class="request-label">
              <el-icon class="item-icon">
                <Avatar />
              </el-icon>
              <span>需要的角色</span>
            </div>
            <div class="request-value">
              <el-input 
                v-model="roleInput" 
                placeholder="请填写需要的角色，如：编辑、管理员等"
                clearable
              />
            </div>
          </div>
        </el-card>

        <!-- 操作按钮 -->
        <div class="action-section">
          <el-button 
            type="primary" 
            size="large" 
            @click="copyAllInfo"
            :icon="CopyDocument"
            class="copy-all-button"
          >
            一键复制所有信息
          </el-button>
          <el-button 
            size="large" 
            @click="handleLogout"
            class="logout-button"
          >
            退出登录
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { User, OfficeBuilding, Avatar, CopyDocument } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/cms_user_store'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 用户信息
const userId = computed(() => userStore.adminInfo?.adminId || '未登录')
const userRoles = computed(() => userStore.adminInfo?.roleList || [])

// 表单输入
const departmentInput = ref('')
const roleInput = ref('')

// 复制到剪贴板
const copyToClipboard = async (text: string, label: string) => {
  try {
    // 检查浏览器是否支持 Clipboard API
    if (!navigator.clipboard) {
      ElMessage.warning('您的浏览器不支持自动复制')
      return
    }
    await navigator.clipboard.writeText(text)
    ElMessage.success(`${label}已复制到剪贴板`)
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败，请手动处理')
  }
}

// 一键复制所有信息
const copyAllInfo = async () => {
  const info = `
=== 权限申请信息 ===
用户ID: ${userId.value}
所属部门: ${departmentInput.value || '未填写'}
需要的角色: ${roleInput.value || '未填写'}
==================
  `.trim()
  
  try {
    // 检查浏览器是否支持 Clipboard API
    if (!navigator.clipboard) {
      ElMessage.warning('您的浏览器不支持自动复制，请手动复制')
      return
    }
    await navigator.clipboard.writeText(info)
    ElMessage.success('已复制所有信息到剪贴板，请发送给管理员')
  } catch (err) {
    console.error('复制失败:', err)
    ElMessage.error('复制失败，请手动复制')
  }
}

// 退出登录
const handleLogout = async () => {
  await userStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.welcome-container {
  min-height: calc(100vh - 100px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.welcome-card {
  width: 100%;
  max-width: 720px;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.welcome-title {
  font-size: 2rem;
  font-weight: 600;
  color: #1e293b;
  text-align: center;
  margin-bottom: 2rem;
  font-family: 'Poppins', sans-serif;
}

.user-info-card {
  margin-bottom: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  
  :deep(.el-card__body) {
    padding: 1.5rem;
  }
}

.info-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.info-label {
  font-size: 1rem;
  font-weight: 500;
  color: #475569;
  min-width: 90px;
}

.role-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  flex: 1;
}

.role-tag {
  font-size: 0.95rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.notice-section {
  margin-bottom: 2.5rem;
  
  :deep(.el-alert) {
    border-radius: 12px;
    border: 1px solid #fbbf24;
    background: #fffbeb;
    padding: 1.25rem;
  }
  
  :deep(.el-alert__icon) {
    font-size: 24px;
    color: #f59e0b;
  }
}

.alert-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 0.5rem;
}

.alert-content {
  color: #78350f;
  line-height: 1.6;
}

.notice-text {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.request-section {
  margin-top: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1.5rem;
  font-family: 'Poppins', sans-serif;
}

.request-card {
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
  
  :deep(.el-card__body) {
    padding: 2rem;
  }
}

.request-item {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    align-items: center;
  }
}

.request-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #1e293b;
  min-width: 120px;
  font-size: 1rem;
}

.item-icon {
  color: #3b82f6;
  font-size: 20px;
}

.request-value {
  flex: 1;
  
  .readonly-input {
    :deep(.el-input__wrapper) {
      background-color: #f8fafc;
    }
  }
}

.copy-button {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: #3b82f6;
  }
}

.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.copy-all-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
}

.logout-button {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

:deep(.el-divider) {
  margin: 1.5rem 0;
  border-color: #e2e8f0;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 0 0 1px #3b82f6 inset;
  }
  
  &.is-focus {
    box-shadow: 0 0 0 1px #3b82f6 inset;
  }
}

:deep(.el-button) {
  cursor: pointer;
}

// 响应式设计
@media (max-width: 640px) {
  .welcome-card {
    padding: 2rem 1.5rem;
  }
  
  .welcome-title {
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.1rem;
  }
  
  .request-card {
    :deep(.el-card__body) {
      padding: 1.5rem;
    }
  }
  
  .action-section {
    flex-direction: column;
    
    .copy-all-button,
    .logout-button {
      width: 100%;
    }
  }
}
</style>
