/**
 * Mock 数据存储服务
 * 管理本地存储中的 mock 数据
 */

import {
  defaultAdminList,
  defaultRoleList,
  defaultDeptList,
  defaultMenuList,
  defaultEnumOptions,
  defaultRoleMenus
} from './mockData'

const STORAGE_KEYS = {
  ADMIN_LIST: 'mock_admin_list',
  ROLE_LIST: 'mock_role_list',
  DEPT_LIST: 'mock_dept_list',
  MENU_LIST: 'mock_menu_list',
  ENUM_OPTIONS: 'mock_enum_options',
  ROLE_MENUS: 'mock_role_menus',
  CURRENT_TOKEN: 'mock_current_token',
  INITIALIZED: 'mock_initialized'
}

/**
 * 检查是否已初始化，如果没有则初始化默认数据
 */
export function ensureInitialized(): void {
  const initialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED)
  if (!initialized) {
    initMockData()
  }
}

/**
 * 初始化 mock 数据到本地存储
 */
export function initMockData(): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_LIST, JSON.stringify(defaultAdminList))
  localStorage.setItem(STORAGE_KEYS.ROLE_LIST, JSON.stringify(defaultRoleList))
  localStorage.setItem(STORAGE_KEYS.DEPT_LIST, JSON.stringify(defaultDeptList))
  localStorage.setItem(STORAGE_KEYS.MENU_LIST, JSON.stringify(defaultMenuList))
  localStorage.setItem(STORAGE_KEYS.ENUM_OPTIONS, JSON.stringify(defaultEnumOptions))
  localStorage.setItem(STORAGE_KEYS.ROLE_MENUS, JSON.stringify(defaultRoleMenus))
  localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true')
  console.log('[Mock] 数据已初始化')
}

/**
 * 重置所有 mock 数据为默认值
 */
export function resetMockData(): void {
  localStorage.removeItem(STORAGE_KEYS.INITIALIZED)
  initMockData()
}

/**
 * 获取管理员列表
 */
export function getAdminList(): any[] {
  ensureInitialized()
  const data = localStorage.getItem(STORAGE_KEYS.ADMIN_LIST)
  return data ? JSON.parse(data) : []
}

/**
 * 保存管理员列表
 */
export function saveAdminList(list: any[]): void {
  localStorage.setItem(STORAGE_KEYS.ADMIN_LIST, JSON.stringify(list))
}

/**
 * 获取角色列表
 */
export function getRoleList(): any[] {
  ensureInitialized()
  const data = localStorage.getItem(STORAGE_KEYS.ROLE_LIST)
  return data ? JSON.parse(data) : []
}

/**
 * 保存角色列表
 */
export function saveRoleList(list: any[]): void {
  localStorage.setItem(STORAGE_KEYS.ROLE_LIST, JSON.stringify(list))
}

/**
 * 获取部门列表
 */
export function getDeptList(): any[] {
  ensureInitialized()
  const data = localStorage.getItem(STORAGE_KEYS.DEPT_LIST)
  return data ? JSON.parse(data) : []
}

/**
 * 保存部门列表
 */
export function saveDeptList(list: any[]): void {
  localStorage.setItem(STORAGE_KEYS.DEPT_LIST, JSON.stringify(list))
}

/**
 * 获取菜单列表 (扁平结构)
 */
export function getMenuList(): any[] {
  ensureInitialized()
  const data = localStorage.getItem(STORAGE_KEYS.MENU_LIST)
  return data ? JSON.parse(data) : []
}

/**
 * 保存菜单列表
 */
export function saveMenuList(list: any[]): void {
  localStorage.setItem(STORAGE_KEYS.MENU_LIST, JSON.stringify(list))
}

/**
 * 获取枚举选项
 */
export function getEnumOptions(): Record<string, { label: string; value: string }[]> {
  ensureInitialized()
  const data = localStorage.getItem(STORAGE_KEYS.ENUM_OPTIONS)
  return data ? JSON.parse(data) : {}
}

/**
 * 获取角色菜单关联
 */
export function getRoleMenus(): Record<string, string[]> {
  ensureInitialized()
  const data = localStorage.getItem(STORAGE_KEYS.ROLE_MENUS)
  return data ? JSON.parse(data) : {}
}

/**
 * 保存角色菜单关联
 */
export function saveRoleMenus(roleMenus: Record<string, string[]>): void {
  localStorage.setItem(STORAGE_KEYS.ROLE_MENUS, JSON.stringify(roleMenus))
}

/**
 * 获取当前登录token
 */
export function getCurrentToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_TOKEN)
}

/**
 * 保存当前登录token
 */
export function saveCurrentToken(token: string | null): void {
  if (token) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_TOKEN, token)
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_TOKEN)
  }
}

/**
 * 将扁平菜单列表构建为树形结构
 */
export function buildMenuTree(menuList: any[], parentId: string = "0"): any[] {
  const result: any[] = []
  
  // 先按 sort 排序
  const sortedList = [...menuList].sort((a, b) => (a.sort || 0) - (b.sort || 0))
  
  for (const menu of sortedList) {
    if (menu.parentId === parentId) {
      const children = buildMenuTree(menuList, menu.id)
      const menuItem = { ...menu }
      if (children.length > 0) {
        menuItem.children = children
      } else {
        menuItem.children = []
      }
      result.push(menuItem)
    }
  }
  
  return result
}

/**
 * 将扁平部门列表构建为树形结构
 */
export function buildDeptTree(deptList: any[], parentId: string = "0"): any[] {
  const result: any[] = []
  
  // 先按 sort 排序
  const sortedList = [...deptList].sort((a, b) => (a.sort || 0) - (b.sort || 0))
  
  for (const dept of sortedList) {
    if (dept.parentId === parentId) {
      const children = buildDeptTree(deptList, dept.id)
      const deptItem = { ...dept }
      if (children.length > 0) {
        deptItem.children = children
      } else {
        deptItem.children = []
      }
      result.push(deptItem)
    }
  }
  
  return result
}

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9)
}

/**
 * 生成Token
 */
export function generateToken(): string {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
}

/**
 * 获取当前时间字符串
 */
export function getCurrentTime(): string {
  const now = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}
