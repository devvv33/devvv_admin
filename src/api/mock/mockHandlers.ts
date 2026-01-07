/**
 * Mock API 处理器
 * 根据不同的API路径返回对应的mock数据
 */

import {
  getAdminList,
  saveAdminList,
  getRoleList,
  saveRoleList,
  getDeptList,
  saveDeptList,
  getMenuList,
  saveMenuList,
  getEnumOptions,
  getRoleMenus,
  saveRoleMenus,
  getCurrentToken,
  saveCurrentToken,
  buildMenuTree,
  buildDeptTree,
  generateId,
  generateToken,
  getCurrentTime
} from './mockStorage'

export interface MockResponse {
  code: number
  msg: string
  data: any
}

/**
 * 创建成功响应
 */
function success(data: any): MockResponse {
  return { code: 200, msg: 'success', data }
}

/**
 * 创建错误响应
 */
function error(msg: string, code: number = 500): MockResponse {
  return { code, msg, data: null }
}

/**
 * Mock API 处理器映射
 */
const handlers: Record<string, (data?: any) => MockResponse> = {
  // ==================== 登录相关 ====================
  '/cmsApi/login/loginByUsername': (data: { username: string; password: string }) => {
    const adminList = getAdminList()
    const admin = adminList.find(a => a.username === data.username && a.password === data.password)
    
    if (!admin) {
      return error('用户名或密码错误', 400)
    }
    
    const token = generateToken()
    saveCurrentToken(token)
    
    // 更新最后登录时间
    admin.lastLoginTime = getCurrentTime()
    admin.loginCount = String(parseInt(admin.loginCount || '0') + 1)
    saveAdminList(adminList)
    
    // 返回登录信息（不包含密码）
    const { password: _, ...adminInfo } = admin
    return success({
      adminSessionInfo: adminInfo,
      tokenInfo: {
        isLogin: true,
        loginDeviceType: "DEF",
        loginId: admin.adminId,
        loginType: "admin",
        sessionTimeout: "86400",
        tokenActiveTimeout: "-1",
        tokenName: "cms_token",
        tokenSessionTimeout: "-2",
        tokenTimeout: "86400",
        tokenValue: token
      }
    })
  },

  '/cmsApi/login/loginByMobile': (data: { mobile: string; code: string }) => {
    const adminList = getAdminList()
    const admin = adminList.find(a => a.mobile === data.mobile)
    
    if (!admin) {
      return error('手机号未注册', 400)
    }
    
    // 简单验证码校验（mock中任意验证码都通过）
    if (!data.code || data.code.length !== 6) {
      return error('验证码错误', 400)
    }
    
    const token = generateToken()
    saveCurrentToken(token)
    
    admin.lastLoginTime = getCurrentTime()
    admin.loginCount = String(parseInt(admin.loginCount || '0') + 1)
    saveAdminList(adminList)
    
    const { password: _, ...adminInfo } = admin
    return success({
      adminSessionInfo: adminInfo,
      tokenInfo: {
        isLogin: true,
        loginDeviceType: "DEF",
        loginId: admin.adminId,
        loginType: "admin",
        sessionTimeout: "86400",
        tokenActiveTimeout: "-1",
        tokenName: "cms_token",
        tokenSessionTimeout: "-2",
        tokenTimeout: "86400",
        tokenValue: token
      }
    })
  },

  '/cmsApi/login/logout': () => {
    saveCurrentToken(null)
    return success(null)
  },

  '/cmsApi/login/loginInfo': () => {
    const token = getCurrentToken()
    if (!token) {
      return error('未登录', 401)
    }
    
    // 简单起见，返回第一个管理员的信息
    const adminList = getAdminList()
    if (adminList.length === 0) {
      return error('未找到用户', 401)
    }
    
    const { password: _, ...adminInfo } = adminList[0]
    return success({
      adminSessionInfo: adminInfo,
      tokenInfo: {
        isLogin: true,
        loginDeviceType: "DEF",
        loginId: adminInfo.adminId,
        loginType: "admin",
        sessionTimeout: "86400",
        tokenActiveTimeout: "-1",
        tokenName: "cms_token",
        tokenSessionTimeout: "-2",
        tokenTimeout: "86400",
        tokenValue: token
      }
    })
  },

  // ==================== 菜单相关 ====================
  '/cmsApi/menu/userMenus': () => {
    const menuList = getMenuList()
    // userMenus 返回扁平列表，按 sort 排序
    const sorted = [...menuList].sort((a, b) => (a.sort || 0) - (b.sort || 0))
    return success(sorted)
  },

  '/cmsApi/menu/allMenuTree': () => {
    const menuList = getMenuList()
    // allMenuTree 返回树形结构
    const tree = buildMenuTree(menuList, "0")
    return success(tree)
  },

  '/cmsApi/menu/createMenu': (data: any) => {
    const menuList = getMenuList()
    const newMenu = {
      ...data,
      id: generateId(),
      columnFieldList: data.columnFieldList || [],
      formFieldList: data.formFieldList || [],
      searchFieldList: data.searchFieldList || []
    }
    
    // 生成 idPath
    if (data.parentId === "0") {
      newMenu.idPath = `/${newMenu.id}/`
    } else {
      const parent = menuList.find(m => m.id === data.parentId)
      newMenu.idPath = parent ? `${parent.idPath}${newMenu.id}/` : `/${newMenu.id}/`
    }
    
    menuList.push(newMenu)
    saveMenuList(menuList)
    return success(newMenu)
  },

  '/cmsApi/menu/updateMenu': (data: any) => {
    const menuList = getMenuList()
    const index = menuList.findIndex(m => m.id === data.id)
    if (index === -1) {
      return error('菜单不存在')
    }
    
    menuList[index] = { ...menuList[index], ...data }
    saveMenuList(menuList)
    return success(menuList[index])
  },

  '/cmsApi/menu/deleteMenu': (data: { id: string }) => {
    let menuList = getMenuList()
    
    // 获取所有需要删除的菜单ID（包括子菜单）
    const idsToDelete: string[] = []
    const collectIds = (parentId: string) => {
      menuList.forEach(m => {
        if (m.parentId === parentId) {
          idsToDelete.push(m.id)
          collectIds(m.id)
        }
      })
    }
    idsToDelete.push(data.id)
    collectIds(data.id)
    
    menuList = menuList.filter(m => !idsToDelete.includes(m.id))
    saveMenuList(menuList)
    return success(null)
  },

  // ==================== 角色相关 ====================
  '/cmsApi/role/listRole': () => {
    const roleList = getRoleList()
    return success(roleList)
  },

  '/cmsApi/role/pageListRole': (data: any) => {
    let roleList = getRoleList()
    
    // 筛选
    if (data?.roleCode) {
      roleList = roleList.filter(r => r.roleCode.includes(data.roleCode))
    }
    if (data?.roleName) {
      roleList = roleList.filter(r => r.roleName.includes(data.roleName))
    }
    if (data?.status) {
      roleList = roleList.filter(r => r.status === data.status)
    }
    
    // 分页
    const pageNum = data?.pageNum || 1
    const pageSize = data?.pageSize || 10
    const total = roleList.length
    const start = (pageNum - 1) * pageSize
    const list = roleList.slice(start, start + pageSize)
    
    return success({
      list,
      pageNum,
      pageSize,
      total: String(total),
      totalPage: Math.ceil(total / pageSize)
    })
  },

  '/cmsApi/role/addRole': (data: any) => {
    const roleList = getRoleList()
    const newRole = {
      ...data,
      id: generateId(),
      createTime: getCurrentTime()
    }
    roleList.push(newRole)
    saveRoleList(roleList)
    return success(newRole)
  },

  '/cmsApi/role/editRole': (data: any) => {
    const roleList = getRoleList()
    const index = roleList.findIndex(r => r.id === data.id)
    if (index === -1) {
      return error('角色不存在')
    }
    roleList[index] = { ...roleList[index], ...data }
    saveRoleList(roleList)
    return success(roleList[index])
  },

  '/cmsApi/role/deleteRole': (data: { id: string }) => {
    let roleList = getRoleList()
    roleList = roleList.filter(r => r.id !== data.id)
    saveRoleList(roleList)
    return success(null)
  },

  '/cmsApi/role/roleMenus': (data: { roleId: string }) => {
    const roleMenus = getRoleMenus()
    return success(roleMenus[data.roleId] || [])
  },

  '/cmsApi/role/assignRoleMenu': (data: { roleId: string; menuIds: string[] }) => {
    const roleMenus = getRoleMenus()
    roleMenus[data.roleId] = data.menuIds || []
    saveRoleMenus(roleMenus)
    return success(null)
  },

  // ==================== 部门相关 ====================
  '/cmsApi/dept/treeListDept': () => {
    const deptList = getDeptList()
    const tree = buildDeptTree(deptList, "0")
    return success(tree)
  },

  '/cmsApi/dept/addDept': (data: any) => {
    const deptList = getDeptList()
    const newDept = {
      ...data,
      id: generateId()
    }
    
    // 生成 idPath
    if (data.parentId === "0" || data.parentId === 0) {
      newDept.idPath = `/${newDept.id}/`
    } else {
      const parent = deptList.find(d => d.id === data.parentId)
      newDept.idPath = parent ? `${parent.idPath}${newDept.id}/` : `/${newDept.id}/`
    }
    
    deptList.push(newDept)
    saveDeptList(deptList)
    return success(newDept)
  },

  '/cmsApi/dept/editDept': (data: any) => {
    const deptList = getDeptList()
    const index = deptList.findIndex(d => d.id === data.id)
    if (index === -1) {
      return error('部门不存在')
    }
    deptList[index] = { ...deptList[index], ...data }
    saveDeptList(deptList)
    return success(deptList[index])
  },

  '/cmsApi/dept/deleteDept': (data: { id: string }) => {
    let deptList = getDeptList()
    
    // 获取所有需要删除的部门ID（包括子部门）
    const idsToDelete: string[] = []
    const collectIds = (parentId: string) => {
      deptList.forEach(d => {
        if (d.parentId === parentId) {
          idsToDelete.push(d.id)
          collectIds(d.id)
        }
      })
    }
    idsToDelete.push(data.id)
    collectIds(data.id)
    
    deptList = deptList.filter(d => !idsToDelete.includes(d.id))
    saveDeptList(deptList)
    return success(null)
  },

  // ==================== 用户相关 ====================
  '/cmsApi/admin/pageListAdmin': (data: any) => {
    let adminList = getAdminList()
    const deptList = getDeptList()

    // 筛选
    if (data?.adminId) {
      adminList = adminList.filter(a => a.adminId === data.adminId)
    }
    if (data?.nickname) {
      adminList = adminList.filter(a => a.nickname?.includes(data.nickname))
    }
    if (data?.roleId) {
      adminList = adminList.filter(a => 
        a.roleList?.some((r: any) => r.id === data.roleId)
      )
    }
    
    // 关联部门信息
    adminList = adminList.map(admin => {
      const { password: _, ...adminInfo } = admin
      const dept = deptList.find(d => d.id === admin.departmentId)
      return {
        ...adminInfo,
        department: dept || null
      }
    })
    
    // 分页
    const pageNum = data?.pageNum || 1
    const pageSize = data?.pageSize || 10
    const total = adminList.length
    const start = (pageNum - 1) * pageSize
    const list = adminList.slice(start, start + pageSize)
    
    return success({
      list,
      pageNum,
      pageSize,
      total: String(total),
      totalPage: Math.ceil(total / pageSize)
    })
  },

  '/cmsApi/admin/createAdmin': (data: any) => {
    const adminList = getAdminList()
    const deptList = getDeptList()
    const roleList = getRoleList()
    
    // 检查用户名是否已存在
    if (adminList.some(a => a.username === data.username)) {
      return error('用户名已存在')
    }
    
    // 获取角色信息
    const roles = (data.roleIdList || []).map((roleId: string) => {
      const role = roleList.find(r => r.id === roleId)
      return role ? { id: role.id, roleCode: role.roleCode, roleName: role.roleName, status: role.status } : null
    }).filter(Boolean)
    
    // 获取部门信息
    const dept = deptList.find(d => d.id === data.departmentId)
    
    const newAdmin = {
      adminId: generateId(),
      username: data.username,
      password: data.password,
      nickname: data.nickname,
      mobile: data.mobile || '',
      avatar: '',
      status: data.status || 'Enable',
      departmentId: data.departmentId,
      department: dept || null,
      roleList: roles,
      loginCount: '0',
      lastLoginTime: null
    }
    
    adminList.push(newAdmin)
    saveAdminList(adminList)
    
    const { password: _, ...adminInfo } = newAdmin
    return success(adminInfo)
  },

  '/cmsApi/admin/updateAdmin': (data: any) => {
    const adminList = getAdminList()
    const deptList = getDeptList()
    const roleList = getRoleList()
    
    const index = adminList.findIndex(a => a.adminId === data.adminId)
    if (index === -1) {
      return error('用户不存在')
    }
    
    // 获取角色信息
    let roles = adminList[index].roleList
    if (data.roleIdList) {
      roles = data.roleIdList.map((roleId: string) => {
        const role = roleList.find(r => r.id === roleId)
        return role ? { id: role.id, roleCode: role.roleCode, roleName: role.roleName, status: role.status } : null
      }).filter(Boolean)
    }
    
    // 获取部门信息
    const dept = data.departmentId ? deptList.find(d => d.id === data.departmentId) : adminList[index].department
    
    adminList[index] = {
      ...adminList[index],
      ...data,
      roleList: roles,
      department: dept
    }
    
    saveAdminList(adminList)
    
    const { password: _, ...adminInfo } = adminList[index]
    return success(adminInfo)
  },

  // ==================== 系统相关 ====================
  '/cmsApi/sys/selector/listOptionsByEnum': (data: { className: string }) => {
    const enumOptions = getEnumOptions()
    return success(enumOptions[data.className] || [])
  }
}

/**
 * 处理 Mock 请求
 * @param url API路径
 * @param data 请求数据
 * @returns Mock响应
 */
export function handleMockRequest(url: string, data?: any): MockResponse | null {
  const handler = handlers[url]
  if (handler) {
    console.log(`[Mock] 处理请求: ${url}`, data)
    const response = handler(data)
    console.log(`[Mock] 响应:`, response)
    return response
  }
  return null
}

/**
 * 检查URL是否有对应的Mock处理器
 */
export function hasMockHandler(url: string): boolean {
  return url in handlers
}
