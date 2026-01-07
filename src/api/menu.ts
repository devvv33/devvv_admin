import request from './request'
import type { MenuItem } from '@/types/menu'

/**
 * 菜单相关API
 */
export const menuApi = {
  /**
   * 获取菜单列表
   */
  getUserMenuList(): Promise<MenuItem[]> {
    return request.post('/cmsApi/menu/userMenus')
  },
  getAllMenuTree(): Promise<MenuItem[]> {
    return request.post('/cmsApi/menu/allMenuTree')
  },
  /**
   * 创建菜单
   */
  createMenu(menu: MenuItem): Promise<MenuItem> {
    return request.post('/cmsApi/menu/createMenu', menu)
  },

  /**
   * 修改菜单
   */
  updateMenu(menu: MenuItem): Promise<MenuItem> {
    return request.post('/cmsApi/menu/updateMenu', menu)
  },

  /**
   * 删除菜单
   */
  deleteMenu(id: string): Promise<void> {
    return request.post(`/cmsApi/menu/deleteMenu`,{ id })
  },
}

