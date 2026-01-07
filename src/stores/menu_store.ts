import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from '@/types/menu'
import { MenuType } from '@/types/menu'
import { menuApi } from '@/api/menu'

/**
 * 菜单状态管理
 */
export const useMenuStore = defineStore('menu', () => {
  // 所有菜单数据（扁平结构）
  const menuList = ref<MenuItem[]>([])
  
  // 加载菜单数据
  const loadMenus = async () => {
    try {
      const data = await menuApi.getUserMenuList()
      menuList.value = data
    } catch (error) {
      console.error('加载菜单失败:', error)
    }
  }

  // 构建菜单树结构
  const buildMenuTree = (items: MenuItem[], parentId: string | null = null): MenuItem[] => {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: buildMenuTree(items, item.id),
      }))
      .sort((a, b) => a.sort - b.sort)
  }

  // 顶级模块菜单（用于顶部导航）
  const topMenus = computed(() => {
    return buildMenuTree(menuList.value, '0').filter(
      item => item.menuType === MenuType.MODULE
    )
  })

  // 获取所有页面类型的菜单（用于路由生成）
  const pageMenus = computed(() => {
    return menuList.value.filter(item => item.menuType === MenuType.PAGE)
  })
  // 根据父级id获取子菜单（用于左侧菜单）
  const getChildrenMenus = (id: string): MenuItem[] => {
    return buildMenuTree(menuList.value, id)
  }

  // 根据id获取菜单项
  const getMenuById = (id: string): MenuItem | undefined => {
    return menuList.value.find(item => item.id === id)
  }

  // 根据路径获取菜单项
  const getMenuByPath = (path: string): MenuItem | undefined => {
    return menuList.value.find(item => item.routePath === path)
  }
  const listMenuByParentId = (parentId: string): MenuItem[] => {
    return menuList.value.filter(item => item.parentId === parentId);
  }

  // 清空菜单数据
  const clearMenus = () => {
    menuList.value = []
  }

  return {
    menuList,
    topMenus,
    pageMenus,
    loadMenus,
    clearMenus,
    getChildrenMenus,
    getMenuById,
    getMenuByPath,
    listMenuByParentId,
  }
})

