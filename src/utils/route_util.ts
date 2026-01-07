import type { RouteRecordRaw } from 'vue-router'
import type { MenuItem } from '@/types/menu'
import { MenuType, PageType } from '@/types/menu'

/**
 * 路由工具类
 */
export class RouteUtils {
  /**
   * 根据菜单列表生成路由配置
   * @param menus 菜单列表
   * @returns 路由配置数组
   */
  static generateRoutes(menus: MenuItem[]): RouteRecordRaw[] {
    const routes: RouteRecordRaw[] = []
    
    // 只处理页面类型的菜单
    const pageMenus = menus.filter(menu => menu.menuType === MenuType.PAGE)
    
    for (const menu of pageMenus) {
      if (!menu.routePath) continue
      
      // 外部链接类型不生成路由，直接在新窗口打开
      if (menu.pageType === PageType.OUTER_LINK) {
        continue
      }
      
      // 根据页面类型设置不同的组件
      let component: (() => Promise<any>) | undefined
      if (menu.pageType === PageType.LIST) {
        // 列表页面使用统一的列表组件
        component = () => import('@/views/template/ListPage.vue')
      } else if (menu.pageType === PageType.CUSTOM) {
        // 自定义页面需要根据code动态加载
        component = () => import(`@/views/custom/${menu.customComponent}.vue`).catch(() => {
          // 如果找不到对应的自定义页面，使用默认的自定义页面组件
          return import('@/views/template/CustomPage.vue')
        })
      } else {
        // 默认使用自定义页面组件
        component = () => import('@/views/template/CustomPage.vue')
      }
      
      const route: RouteRecordRaw = {
        path: menu.routePath,
        name: menu.id,
        component,
        meta: {
          menuId: menu.id,
          title: menu.menuName,
          pageType: menu.pageType,
          customComponent: menu.customComponent,
          requiresAuth: true, // 动态路由都需要认证
        },
      }
      
      routes.push(route)
    }
    
    return routes
  }
}

