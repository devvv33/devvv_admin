import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LoginByMobileParams, TokenInfo, AdminUserInfo, LoginByUsernameParams } from '@/types/user'
import { authApi } from '@/api/auth'
import { router, resetDynamicRoutes } from '@/router'
import { useMenuStore } from './menu_store'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 用户信息
  const adminUserInfo = ref<AdminUserInfo | null>(null)
  // Token
  const tokenInfo = ref<TokenInfo | null>(null)

  // 登录
  const loginByUsername = async (params: LoginByUsernameParams) => {
    try {
      const response = await authApi.loginByUsername(params)
      adminUserInfo.value = response.adminSessionInfo
      tokenInfo.value = response.tokenInfo
      localStorage.setItem('tokenInfo', JSON.stringify(response.tokenInfo))
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }
  const loginByMobile = async (params: LoginByMobileParams) => {
    try {
      const response = await authApi.loginByMobile(params)
      adminUserInfo.value = response.adminSessionInfo
      tokenInfo.value = response.tokenInfo
      localStorage.setItem('tokenInfo', JSON.stringify(response.tokenInfo))
      return response
    } catch (error) {
      console.error('登录失败:', error)
      throw error
    }
  }

  // 退出登录
  const logout = async (redirect: boolean = true) => {
    try {
      // 先清理本地态，避免出现 “token 还在导致守卫再次 getUserInfo” 的窗口
      const hadToken = !!tokenInfo.value

      // 清空用户信息和token
      adminUserInfo.value = null
      tokenInfo.value = null
      localStorage.removeItem('tokenInfo')
      
      // 清除保存的重定向URL
      sessionStorage.removeItem('redirectUrl')

      // 清空菜单数据
      const menuStore = useMenuStore()
      menuStore.clearMenus()

      // 重置动态路由加载状态
      resetDynamicRoutes()

      // 尽力通知后端登出（即便失败也不影响前端清理）
      if (hadToken) {
        await authApi.logout()
      }
    } catch (error) {
      console.error('退出登录失败:', error)
    } finally {
      if (redirect && router.currentRoute.value.path !== '/login') {
        await router.replace('/login')
      }
    }
  }

  // 获取用户信息
  const getUserInfo = async () => {
    try {
      const response = await authApi.getUserInfo()
      adminUserInfo.value = response.adminSessionInfo
      tokenInfo.value = response.tokenInfo
      // 保存token到localStorage
      localStorage.setItem('tokenInfo', JSON.stringify(response.tokenInfo))
      return adminUserInfo.value
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 初始化（从localStorage恢复token）
  const init = () => {
    const savedToken = localStorage.getItem('tokenInfo')
    if (savedToken) {
        tokenInfo.value = JSON.parse(savedToken)
    }
  }

  return {
    adminInfo: adminUserInfo,
    tokenInfo,
    loginByUsername,
    loginByMobile,
    logout,
    getUserInfo,
    init,
  }
})

