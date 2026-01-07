<template>
  <el-container class="main-layout">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <div class="header-left">
        <!-- 移动端菜单按钮 -->
        <el-button 
          class="mobile-menu-toggle" 
          text 
          @click="toggleMobileMenu"
        >
          <el-icon :size="24"><Expand /></el-icon>
        </el-button>
        <div class="logo">
          <span class="logo-text">DevvvAdmin</span>
        </div>
        <!-- 顶部菜单 -->
        <el-menu
          mode="horizontal"
          :default-active="activeTopMenu"
          class="top-menu"
          @select="handleTopMenuSelect"
        >
          <el-menu-item
            v-for="menu in topMenus"
            :key="menu.id"
            :index="menu.id"
          >
            <IconDisplay v-if="menu.icon" :icon="menu.icon" :size="16" />
            <span>{{ menu.menuName }}</span>
          </el-menu-item>
        </el-menu>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand" popper-class="user-dropdown-popper" placement="bottom-start">
          <span class="user-info">
            <el-avatar :size="32" :src="userStore.adminInfo?.avatar">
              {{ userStore.adminInfo?.nickname?.[0] || 'U' }}
            </el-avatar>
            <div class="user-details">
              <span class="username">{{ userStore.adminInfo?.nickname || '用户' }}</span>
              <span class="user-role" v-if="userStore.adminInfo?.roleList && userStore.adminInfo.roleList.length > 0">
                {{ userStore.adminInfo.roleList[0].roleName }}
              </span>
            </div>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-menu" style="padding: 0">
              <!-- 用户信息头部 -->
              <div class="dropdown-user-header">
                <el-avatar :size="40" :src="userStore.adminInfo?.avatar">
                  {{ userStore.adminInfo?.nickname?.[0] || 'U' }}
                </el-avatar>
                <div class="dropdown-user-info">
                  <div class="dropdown-username">{{ userStore.adminInfo?.nickname || '用户' }}</div>
                  <div class="dropdown-account">{{ userStore.adminInfo?.username }}</div>
                  <div class="dropdown-id">ID: {{ userStore.adminInfo?.adminId }}</div>
                </div>
              </div>

              <!-- 角色列表 -->
              <el-divider style="margin: 2px 0" />
              <div class="dropdown-roles">
                <div class="dropdown-roles-title">角色权限</div>
                <div class="role-tags">
                  <el-tag
                    v-for="role in userStore.adminInfo?.roleList"
                    :key="role.id"
                    size="small"
                    effect="plain"
                    type="info"
                  >
                    {{ role.roleName }}
                  </el-tag>
                </div>
              </div>

              <!-- 操作按钮 -->
              <el-divider style="margin: 2px 0" />
              <el-dropdown-item command="logout" class="logout-item">
                <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"/>
                </svg>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container class="body-container">
      <!-- 移动端遮罩层 -->
      <div
        v-if="mobileMenuVisible"
        class="mobile-menu-mask"
        @click="closeMobileMenu"
      ></div>

      <!-- 左侧菜单 -->
      <el-aside :width="sidebarWidth" :class="['sidebar', { 'mobile-visible': mobileMenuVisible }]">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          :collapse="sidebarCollapsed && !isMobile"
          @select="handleMenuSelect"
        >
          <!-- 移动端显示完整树形结构 -->
          <template v-if="isMobile">
            <template v-for="topMenu in topMenus" :key="topMenu.id">
              <el-sub-menu v-if="topMenu.menuType === 'MODULE'" :index="topMenu.id">
                <template #title>
                  <IconDisplay v-if="topMenu.icon" :icon="topMenu.icon" :size="16" />
                  <span>{{ topMenu.menuName }}</span>
                </template>
                <template v-for="menu in getChildrenMenus(topMenu.id)" :key="menu.id">
                  <!-- 渲染子菜单 -->
                  <template v-if="menu.menuType === 'DIRECTORY'">
                    <el-sub-menu :index="menu.id">
                      <template #title>
                        <IconDisplay v-if="menu.icon" :icon="menu.icon" :size="16" />
                        <span>{{ menu.menuName }}</span>
                      </template>
                      <template v-for="child in menu.children" :key="child.id">
                        <el-menu-item v-if="child.menuType === 'PAGE'" :index="child.routePath || child.id">
                          <IconDisplay v-if="child.icon" :icon="child.icon" :size="16" />
                          <span>{{ child.menuName }}</span>
                        </el-menu-item>
                        <el-sub-menu v-else-if="child.menuType === 'DIRECTORY'" :index="child.id">
                          <template #title>
                            <IconDisplay v-if="child.icon" :icon="child.icon" :size="16" />
                            <span>{{ child.menuName }}</span>
                          </template>
                          <template v-for="page in child.children" :key="page.id">
                            <el-menu-item v-if="page.menuType === 'PAGE'" :index="page.routePath || page.id">
                              <IconDisplay v-if="page.icon" :icon="page.icon" :size="16" />
                              <span>{{ page.menuName }}</span>
                            </el-menu-item>
                          </template>
                        </el-sub-menu>
                      </template>
                    </el-sub-menu>
                  </template>
                  <el-menu-item v-else-if="menu.menuType === 'PAGE'" :index="menu.routePath || menu.id">
                    <IconDisplay v-if="menu.icon" :icon="menu.icon" :size="16" />
                    <span>{{ menu.menuName }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
            </template>
          </template>
          
          <!-- PC端显示当前顶部菜单的子菜单 -->
          <template v-else>
            <template v-for="menu in currentSideMenus" :key="menu.id">
              <!-- 目录类型：可展开的文件夹 -->
              <el-sub-menu v-if="menu.menuType === 'DIRECTORY'" :index="menu.id">
                <template #title>
                  <IconDisplay v-if="menu.icon" :icon="menu.icon" :size="16" />
                  <span>{{ menu.menuName }}</span>
                </template>
                <!-- 递归渲染子菜单 -->
                <template v-for="child in menu.children" :key="child.id">
                  <el-menu-item v-if="child.menuType === 'PAGE'" :index="child.routePath || child.id">
                    <IconDisplay v-if="child.icon" :icon="child.icon" :size="16" />
                    <span>{{ child.menuName }}</span>
                  </el-menu-item>
                  <!-- 如果子菜单也是目录，继续递归 -->
                  <el-sub-menu v-else-if="child.menuType === 'DIRECTORY'" :index="child.id">
                    <template #title>
                      <IconDisplay v-if="child.icon" :icon="child.icon" :size="16" />
                      <span>{{ child.menuName }}</span>
                    </template>
                    <template v-for="page in child.children" :key="page.id">
                      <el-menu-item
                        v-if="page.menuType === 'PAGE'"
                        :index="page.routePath || page.id"
                      >
                        <IconDisplay v-if="page.icon" :icon="page.icon" :size="16" />
                        <span>{{ page.menuName }}</span>
                      </el-menu-item>
                    </template>
                  </el-sub-menu>
                </template>
              </el-sub-menu>
              <!-- 页面类型：直接可点击的菜单项 -->
              <el-menu-item v-else-if="menu.menuType === 'PAGE'" :index="menu.routePath || menu.id">
                <IconDisplay v-if="menu.icon" :icon="menu.icon" :size="16" />
                <span>{{ menu.menuName }}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" :key="route.name" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/cms_user_store'
import { useMenuStore } from '@/stores/menu_store'
import { ArrowDown, Expand } from '@element-plus/icons-vue'
import type { MenuItem } from '@/types/menu'
import { MenuType, PageType } from '@/types/menu'
import IconDisplay from '@/components/IconDisplay.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const menuStore = useMenuStore()

// 检测是否为移动端
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  // 移动端时，菜单默认收起
  if (isMobile.value) {
    mobileMenuVisible.value = false
  }
}

// 移动端菜单显示状态
const mobileMenuVisible = ref(false)
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}
const closeMobileMenu = () => {
  mobileMenuVisible.value = false
}

// 侧边栏是否折叠
const sidebarCollapsed = ref(false)
// 侧边栏宽度
const sidebarWidth = computed(() => {
  if (isMobile.value) {
    return '250px'
  }
  return sidebarCollapsed.value ? '64px' : '200px'
})

// 当前激活的顶部菜单
const activeTopMenu = ref('')
// 当前激活的侧边菜单
const activeMenu = ref('')

// 顶部菜单列表
const topMenus = computed(() => menuStore.topMenus)

// 当前显示的侧边菜单（根据激活的顶部菜单获取）
const currentSideMenus = computed(() => {
  if (!activeTopMenu.value) {
    // 如果没有激活的顶部菜单，返回第一个模块的子菜单
    if (topMenus.value.length > 0) {
      return menuStore.getChildrenMenus(topMenus.value[0].id)
    }
    return []
  }
  return menuStore.getChildrenMenus(activeTopMenu.value)
})

// 获取子菜单（用于移动端完整树形结构）
const getChildrenMenus = (parentId: string) => {
  return menuStore.getChildrenMenus(parentId)
}

// 监听路由变化，更新激活的菜单
watch(
  () => route.path,
  (path: string) => {
    activeMenu.value = path

    // 根据路径找到对应的菜单，确定激活的顶部菜单
    const menu = menuStore.getMenuByPath(path)
    if (menu) {
      // 向上查找模块类型的父菜单
      let current: MenuItem | undefined = menu
      while (current) {
        if (current.menuType === MenuType.MODULE) {
          activeTopMenu.value = current.id
          break
        }
        if (current.parentId) {
          current = menuStore.getMenuById(current.parentId)
        } else {
          break
        }
      }
    }
  },
  { immediate: true }
)

// 处理顶部菜单选择
const handleTopMenuSelect = async (key: string) => {
  activeTopMenu.value = key
  // 确保菜单已加载
  if (menuStore.menuList.length === 0) {
    await menuStore.loadMenus()
  }
  // 切换到该模块下的第一个页面
  const children = menuStore.getChildrenMenus(key)
  const firstPage = findFirstPage(children)
  if (firstPage?.routePath) {
    // 检查路由是否存在，如果不存在则先加载动态路由
    const routeExists = router.getRoutes().some(route => route.path === firstPage.routePath)
    if (!routeExists) {
      // 动态路由还没加载，先加载路由
      const { addDynamicRoutes } = await import('@/router')
      await addDynamicRoutes()
    }
    // 使用 replace 避免在历史记录中留下无效的路由
    router.push(firstPage.routePath).catch((err) => {
      // 如果路由不存在，跳转到首页
      console.error('路由跳转失败:', err)
      router.push('/home')
    })
  } else {
    // 如果没有找到页面，跳转到首页
    router.push('/home')
  }
}

// 处理侧边菜单选择
const handleMenuSelect = async (key: string) => {
  // 移动端选择菜单后关闭菜单
  if (isMobile.value) {
    closeMobileMenu()
  }

  // 查找对应的菜单项
  const menu = menuStore.getMenuByPath(key)

  // 如果是外部链接类型，直接在新窗口打开
  if (menu?.pageType === PageType.OUTER_LINK && menu.routePath) {
    window.open(menu.routePath, '_blank')
    return
  }

  // 检查路由是否存在，如果不存在则先加载动态路由
  const routeExists = router.getRoutes().some(route => route.path === key)
  if (!routeExists && key.startsWith('/')) {
    // 动态路由还没加载，先加载路由
    const { addDynamicRoutes } = await import('@/router')
    await addDynamicRoutes()
  }
  router.push(key).catch((err) => {
    // 如果路由不存在，跳转到首页
    console.error('路由跳转失败:', err)
    router.push('/home')
  })
}

// 查找第一个页面类型的菜单（排除外部链接）
const findFirstPage = (menus: MenuItem[]): MenuItem | null => {
  for (const menu of menus) {
    if (menu.menuType === MenuType.PAGE && menu.pageType !== PageType.OUTER_LINK) {
      return menu
    }
    if (menu.children && menu.children.length > 0) {
      const found = findFirstPage(menu.children)
      if (found) return found
    }
  }
  return null
}

// 处理用户下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    userStore.logout()
  }
}

// 初始化：加载菜单并设置默认激活的顶部菜单
onMounted(async () => {
  // 确保菜单已加载
  if (menuStore.menuList.length === 0) {
    await menuStore.loadMenus()
  }
  // 确保动态路由已加载
  const { addDynamicRoutes } = await import('@/router')
  await addDynamicRoutes()

  // 设置默认激活的顶部菜单
  if (topMenus.value.length > 0 && !activeTopMenu.value) {
    activeTopMenu.value = topMenus.value[0].id
  }

  // 检查是否为移动端
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

:global(.user-dropdown-popper) {
  border-radius: 10px;
  overflow: hidden;
}

// 移动端菜单按钮 - 默认隐藏
.mobile-menu-toggle {
  display: none;
  color: #fff;
  margin-right: 12px;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

// 移动端遮罩层
.mobile-menu-mask {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  
  @media (max-width: 768px) {
    display: block;
  }
}

.header {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  background: linear-gradient(135deg, #6366f1 0%, #3b82f6 100%);
  border-bottom: none;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0 12px;
    height: 56px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  }

  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 40px;

    @media (max-width: 768px) {
      gap: 0;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 10px;

      .logo-text {
        font-size: 22px;
        font-weight: 700;
        color: #fff;
        text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        letter-spacing: 0.5px;
        background: linear-gradient(135deg, #fff 0%, rgba(255, 255, 255, 0.9) 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;

        @media (max-width: 768px) {
          font-size: 18px;
        }
      }
    }

    .top-menu {
      border-bottom: none;
      flex: 1;
      background: transparent;
      height: 64px;

      @media (max-width: 768px) {
        display: none;
      }

      // 顶部菜单项样式
      :deep(.el-menu-item) {
        color: rgba(255, 255, 255, 0.9);
        border-bottom: 2px solid transparent;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        margin: 0 4px;
        border-radius: 8px 8px 0 0;
        height: 64px;
        line-height: 64px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.12) !important;
          color: #fff;
          border-bottom-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        // 选中状态
        &.is-active {
          background-color: rgba(255, 255, 255, 0.18) !important;
          color: #fff !important;
          border-bottom-color: #fff;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .el-icon {
          margin-right: 6px;
        }
      }
    }
  }

  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 24px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      outline: none;

      @media (max-width: 768px) {
        padding: 6px 10px;
        gap: 8px;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
        transform: translateY(-1px);
      }

      &:focus-visible {
        outline: 2px solid rgba(255, 255, 255, 0.5);
        outline-offset: 2px;
      }

      .user-details {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;

        @media (max-width: 768px) {
          display: none;
        }
      }

      .username {
        font-size: 14px;
        color: #fff;
        font-weight: 600;
        letter-spacing: 0.3px;
        line-height: 1.2;
      }

      .user-role {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.85);
        font-weight: 500;
        line-height: 1;
        padding: 2px 8px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 10px;
      }

      .el-icon {
        color: #fff;
        transition: transform 0.25s;

        @media (max-width: 768px) {
          display: none;
        }
      }

      &:hover .el-icon {
        transform: rotate(180deg);
      }
    }
  }
}

/* header 下方的容器 */
.body-container {
  flex: 1;
  min-height: 0;
  position: relative;
}

/* 左侧 */
.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  overflow-y: auto;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.03);

  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 3px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #94a3b8;
    }
  }

  // 移动端样式
  @media (max-width: 768px) {
    position: fixed;
    top: 56px;
    left: -250px;
    bottom: 0;
    z-index: 100;
    transition: left 0.3s ease;

    &.mobile-visible {
      left: 0;
    }
  }

  .sidebar-menu {
    border-right: none;
    background: #ffffff;
    padding: 12px 0;

    // 一级菜单项
    :deep(.el-menu-item) {
      margin: 2px 12px;
      border-radius: 10px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      color: #475569;
      font-weight: 500;
      font-size: 14px;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 70%;
        background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
        border-radius: 0 4px 4px 0;
        transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      }

      &:hover {
        background-color: #f1f5f9 !important;
        color: #3b82f6;
        transform: translateX(2px);

        &::before {
          width: 3px;
        }
      }

      // 选中状态
      &.is-active {
        background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
        color: #1e40af !important;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(59, 130, 246, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8);
        border: 1px solid #bfdbfe;

        &::before {
          width: 4px;
        }

        .el-icon {
          color: #3b82f6;
        }
      }

      .el-icon {
        color: #94a3b8;
        transition: all 0.25s;
        font-size: 18px;
      }

      &:hover .el-icon {
        color: #3b82f6;
        transform: scale(1.1);
      }
    }

    // 子菜单标题
    :deep(.el-sub-menu__title) {
      margin: 2px 12px;
      border-radius: 10px;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      color: #475569;
      font-weight: 600;
      font-size: 14px;

      &:hover {
        background-color: #f1f5f9 !important;
        color: #3b82f6;
        transform: translateX(2px);

        .el-icon {
          color: #3b82f6;
        }
      }

      .el-icon {
        color: #94a3b8;
        transition: all 0.25s;
      }
    }

    // 子菜单容器
    :deep(.el-sub-menu) {
      .el-menu {
        background-color: #f8fafc;
        border-radius: 0 0 10px 10px;
        padding: 4px 0;
        margin-top: 2px;

        .el-menu-item {
          margin: 2px 12px 2px 20px;
          padding-left: 48px !important;
          background-color: transparent;
          position: relative;
          font-size: 13px;

          &::after {
            content: '';
            position: absolute;
            left: 32px;
            top: 50%;
            transform: translateY(-50%);
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #cbd5e1;
            transition: all 0.25s;
          }

          &:hover {
            background-color: #ffffff !important;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

            &::after {
              background-color: #60a5fa;
              transform: translateY(-50%) scale(1.3);
            }
          }

          &.is-active {
            background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%) !important;
            color: #1e40af !important;
            font-weight: 600;
            border: 1px solid #bfdbfe;

            &::after {
              background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
              transform: translateY(-50%) scale(1.4);
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
            }
          }
        }

        // 三级子菜单
        .el-sub-menu {
          .el-sub-menu__title {
            padding-left: 48px !important;
            background-color: transparent;
            font-size: 13px;

            &:hover {
              background-color: #ffffff !important;
            }
          }

          .el-menu-item {
            padding-left: 68px !important;
            background-color: transparent;

            &::after {
              left: 52px;
            }

            &:hover {
              background-color: #ffffff !important;
            }
          }
        }
      }

      // 展开的子菜单
      &.is-opened {
        > .el-sub-menu__title {
          background-color: #f1f5f9;
          color: #3b82f6;
          font-weight: 600;

          .el-icon {
            color: #3b82f6;
          }
        }
      }
    }
  }
}

/* 右侧 */
.main-content {
  min-height: 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  padding: 10px 0px 0px 10px !important;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);

  @media (max-width: 768px) {
    padding: 0 !important;
  }

  /* 自定义滚动条 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;

  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #94a3b8;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease-out, transform 0.25s ease-out;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* 用户下拉菜单样式 */
.dropdown-user-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  margin: 0;
  background: linear-gradient(135deg, #6366f1 0%, #6366f1 100%);

  .dropdown-user-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;

    .dropdown-username {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      line-height: 1.2;
    }

    .dropdown-account {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.75);
      line-height: 1.2;
    }

    .dropdown-id {
      font-size: 11px;
      color: rgba(255, 255, 255, 0.65);
      line-height: 1.2;
      font-family: 'Consolas', 'Monaco', monospace;
    }
  }
}

.dropdown-roles {
  padding: 8px 20px;

  .dropdown-roles-title {
    font-size: 12px;
    font-weight: 600;
    color: #64748b;
    margin-bottom: 10px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }

  .role-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;

    .el-tag {
      border-radius: 6px;
      font-weight: 500;
      font-size: 13px;
      padding: 4px 8px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border-color: #bfdbfe;
      color: #1e40af;
    }
  }
}

:deep(.el-dropdown-menu__item) {
  &.logout-item {
    color: #ef4444;
    font-weight: 500;
    margin: 4px 12px 12px;
    padding: 10px 14px;
    border-radius: 8px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 10px;

    &:hover {
      background: #fef2f2 !important;
      color: #dc2626 !important;
    }

    .logout-icon {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
    }
  }
}

.el-divider {
  margin: 10px 0;
  border-color: #e2e8f0;
}
</style>

