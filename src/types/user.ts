import {EnableStatus} from "@/types/sys_type.ts";

/**
 * 后台用户信息
 */
export interface AdminUserInfo {
    /** 用户ID */
    adminId: string
    /** 用户名 */
    username: string
    /** 昵称 */
    nickname: string
    /** 手机号 */
    mobile: string
    /** 头像 */
    avatar?: string
    /** 状态 */
    status: EnableStatus
    /** 角色列表 */
    roleList: Role[]

    departmentId: number
}

export interface Role {
    /** 角色ID */
    id: number
    /** 角色code */
    roleCode: string
    /** 角色名称 */
    roleName: string
}

/**
 * Token信息
 */
export interface TokenInfo {
    /** token参数key */
    tokenName: string
    /** token值 */
    tokenValue: string
    /** 登录类型 */
    loginId: string
    /** 登录ID */
    loginType: string
}

/**
 * 登录请求参数
 */
export interface LoginByUsernameParams {
  username: string
  password: string
}
export interface LoginByMobileParams {
  mobile: string
  code: string
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  tokenInfo: TokenInfo
  adminSessionInfo: AdminUserInfo
}

