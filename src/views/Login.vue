<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>DevvvAdmin</h2>
        <p>欢迎登录</p>
      </div>
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            :prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            :prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            class="login-button"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="login-tip">
        <p>测试账号：superadmin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/cms_user_store'
import { useMenuStore } from '@/stores/menu_store'

const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

const loginFormRef = ref<FormInstance>()
const loading = ref(false)

// 登录表单数据
const loginForm = reactive({
  username: 'superadmin',
  password: '123456',
})

// 表单验证规则
const loginRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
}

// 处理登录
const handleLogin = async () => {
  if (!loginFormRef.value) return

  await loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // 1. 执行登录
        await userStore.loginByUsername({
          username: loginForm.username,
          password: loginForm.password,
        })
        
        // 2. 登录成功后立即加载菜单
        await menuStore.loadMenus()
        
        ElMessage.success('登录成功')
        
        // 3. 获取登录前保存的URL
        const redirectUrl = sessionStorage.getItem('redirectUrl')
        // 清除保存的URL
        sessionStorage.removeItem('redirectUrl')
        // 重定向到保存的URL，如果没有则跳转到/home
        router.push(redirectUrl || '/home')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped lang="scss">
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

  .login-box {
    width: 400px;
    padding: 40px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      h2 {
        font-size: 24px;
        color: #303133;
        margin-bottom: 8px;
      }

      p {
        font-size: 14px;
        color: #909399;
      }
    }

    .login-form {
      .login-button {
        width: 100%;
        margin-top: 10px;
      }
    }

    .login-tip {
      margin-top: 20px;
      text-align: center;

      p {
        font-size: 12px;
        color: #909399;
      }
    }
  }
}
</style>

