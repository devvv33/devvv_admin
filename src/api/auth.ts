import request from './request'
import {LoginByMobileParams, LoginByUsernameParams, LoginResponse} from '@/types/user'

/**
 * 认证相关API
 */
export const authApi = {
  /**
   * 登录-用户名密码登录
   */
  loginByUsername(params: LoginByUsernameParams): Promise<LoginResponse> {
    return request.post('/cmsApi/login/loginByUsername', params)
  },
  /**
   * 登录-手机号登录
   */
  loginByMobile(params: LoginByMobileParams): Promise<LoginResponse> {
    return request.post('/cmsApi/login/loginByMobile', params)
  },

  /**
   * 退出登录
   */
  logout(): Promise<void> {
    return request.post('/cmsApi/login/logout')
  },

  /**
   * 获取用户信息
   */
  getUserInfo(): Promise<LoginResponse> {
    return request.get('/cmsApi/login/loginInfo')
  },
}

