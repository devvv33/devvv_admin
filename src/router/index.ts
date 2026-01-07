import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/cms_user_store'
import { useMenuStore } from '@/stores/menu_store'
import { RouteUtils } from '@/utils/route_util'
import type { MenuItem } from '@/types/menu'
import { MenuType, PageType } from '@/types/menu'

// 标记是否已加载动态路由
let dynamicRoutesLoaded = false

/**
 * 静态路由配置
 */
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    name: 'MainLayout',
    component: () => import('@/layouts/MainLayout.vue'),
    redirect: '/home',
    children: [],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
]

/**
 * 创建路由实例
 */
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
})

/**
 * 动态添加路由
 */
export const addDynamicRoutes = async () => {
  // 如果已经加载过，直接返回
  if (dynamicRoutesLoaded) {
    return
  }
  
  const menuStore = useMenuStore()
  if (menuStore.menuList.length === 0) {
    await menuStore.loadMenus()
  }
  
  // 根据菜单生成路由
  const dynamicRoutes = RouteUtils.generateRoutes(menuStore.pageMenus)
  
  // 将动态路由添加到主布局的children中
  // 先查找主布局路由
  const mainLayoutRoute = router.getRoutes().find(r => r.name === 'MainLayout' || r.path === '/')
  if (!mainLayoutRoute) {
    console.error('找不到主布局路由，无法添加动态路由')
    return
  }
  
  dynamicRoutes.forEach(route => {
    // 检查路由是否已存在，避免重复添加
    const existingRoute = router.getRoutes().find(r => r.path === route.path && r.name === route.name)
    if (!existingRoute) {
      // 使用主布局路由的name来添加子路由（推荐方式）
      router.addRoute('MainLayout', route)
    }
  })
  
  dynamicRoutesLoaded = true
}

/**
 * 重置动态路由加载状态（用于退出登录时）
 */
export const resetDynamicRoutes = () => {
  dynamicRoutesLoaded = false
}

/**
 * 查找第一个可访问的页面
 */
const findFirstAvailablePage = (menuStore: any): MenuItem | null => {
  const topMenus = menuStore.topMenus
  if (topMenus.length === 0) return null
  
  // 递归查找第一个页面类型的菜单（排除外部链接）
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
  
  // 遍历所有顶级模块，找到第一个可用的页面
  for (const topMenu of topMenus) {
    const children = menuStore.getChildrenMenus(topMenu.id)
    const page = findFirstPage(children)
    if (page) return page
  }
  return null
}

/**
 * 路由守卫
 */
router.beforeEach(async (to, _from, next) => {
  const userStore = useUserStore()

  // 已登录但用户信息未初始化
  // 注意：跳转到登录页时不再拉取用户信息，避免 session 失效导致反复触发 getUserInfo
  if (userStore.tokenInfo && !userStore.adminInfo && to.path !== '/login') {
    try {
      await userStore.getUserInfo()
    } catch {
      // 这里用 next 控制跳转，因此不在 logout 内部再做 redirect，避免重复导航
      await userStore.logout(false)
      // logout之后再保存当前要访问的URL到sessionStorage
      sessionStorage.setItem('redirectUrl', to.fullPath)
      next('/login')
      return
    }
  }

  // 未登录，且目标不是登录页
  if (!userStore.tokenInfo && to.path !== '/login') {
    // 保存当前要访问的URL到sessionStorage
    sessionStorage.setItem('redirectUrl', to.fullPath)
    next('/login')
    return
  }

  // 已登录，确保动态路由只加载一次
  if (userStore.tokenInfo && !dynamicRoutesLoaded) {
    await addDynamicRoutes()
    
    // 如果目标是 /home 且该路由不存在，跳转到第一个有权限的页面
    if (to.path === '/home') {
      if (!router.getRoutes().some(route => route.path === '/home')) {
        const menuStore = useMenuStore()
        const firstPage = findFirstAvailablePage(menuStore)
        if (firstPage?.routePath) {
          next({ path: firstPage.routePath, replace: true })
          return
        }
        // 如果没有找到任何页面，继续访问 /home（会触发404）
      }
    }
    
    next({ path: to.fullPath, replace: true })
    return
  }

  // 已登录访问登录页
  if (to.path === '/login' && userStore.tokenInfo) {
    // 获取登录前保存的URL
    const redirectUrl = sessionStorage.getItem('redirectUrl')
    // 清除保存的URL
    sessionStorage.removeItem('redirectUrl')
    // 重定向到保存的URL，如果没有则跳转到/home
    next(redirectUrl || '/home')
    return
  }

  next()
})


export default router

