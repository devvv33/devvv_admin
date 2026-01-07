import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/cms_user_store'
import { AESCrypto, RSACrypto } from '@/utils/crypto'
import { getClientInfo, clientInfoToString } from '@/utils/client_info_util'
import { router } from '@/router'
import { USE_MOCK, handleMockRequest, hasMockHandler } from './mock'

// 是否使用加密(生产环境必须使用)
const USE_ENCRYPT = import.meta.env.VITE_USE_ENCRYPT === 'true'
// 应用版本号
const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

/**
 * 后端响应数据格式
 */
export interface ApiResponse<T = any> {
  code: number      // 200表示成功, 其他表示失败
  msg: string       // 错误信息
  data: T          // 返回的数据
}

/**
 * 创建axios实例
 */
const service: AxiosInstance = axios.create({
  timeout: 60000,
})

/**
 * 请求拦截器
 */
service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const userStore = useUserStore()
    
    // 添加token到请求头
    if (userStore.tokenInfo && config.headers) {
      config.headers[userStore.tokenInfo.tokenName] = userStore.tokenInfo.tokenValue
    }

    // 如果启用加密
    if (USE_ENCRYPT) {
      // 生成AES密钥
      const aesKey = AESCrypto.generateKey()
      
      // 获取客户端信息
      const clientInfo = getClientInfo(APP_VERSION)
      const clientInfoStr = clientInfoToString(clientInfo)
      
      // 加密客户端信息并设置到请求头 x-inf
      const encryptedClientInfo = AESCrypto.encrypt(clientInfoStr, aesKey)
      config.headers['x-inf'] = encryptedClientInfo;
      
      // 使用RSA公钥加密AES密钥并设置到请求头 x-arg
      const encryptedAesKey = RSACrypto.encrypt(aesKey)
      config.headers['x-arg'] = clientInfo.i + encryptedAesKey
      
      // 加密请求体
      if (config.data && !(config.data instanceof FormData)) {
        // 默认就是 JSON，加密处理
        const jsonData = typeof config.data === 'string' ? config.data : JSON.stringify(config.data)
        const encryptedData = AESCrypto.encrypt(jsonData, aesKey)
        config.data = encryptedData
        config.headers['Content-Type']= 'application/json'
      }
      
      // multipart/form-data不加密
      
      // 将AES密钥存储到config中,用于响应解密
      (config as any)._aesKey = aesKey
    } else {
      // 开发环境不加密,但仍然需要设置客户端信息(未加密)
      const clientInfo = getClientInfo(APP_VERSION)
      const clientInfoStr = clientInfoToString(clientInfo)
      config.headers['x-inf'] = clientInfoStr
    }

    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
service.interceptors.response.use(async (response: AxiosResponse) => {
    // 如果是 blob 类型，直接返回整个 response（包含 headers 和 data）
    if (response.config.responseType === 'blob') {
      return response
    }

    let respBody = response.data

    // 如果启用加密,需要解密响应数据
    if (USE_ENCRYPT && response.config.headers['x-arg']) {
      const aesKey = (response.config as any)._aesKey

      if (aesKey && typeof respBody === 'string') {
        try {
          // 尝试解析为JSON,如果失败说明是加密的数据
          respBody = JSON.parse(respBody)
        } catch {
          // 不是JSON,说明是加密的数据,需要解密
          try {
            const decryptedData = AESCrypto.decrypt(respBody, aesKey)
            respBody = JSON.parse(decryptedData)
          } catch (error) {
            console.error('解密响应数据失败:', respBody, error)
            ElMessage.error('数据解密失败')
            throw {response, respBody}
          }
        }
      }
    }

    // 如果返回的状态码不是200,则认为是错误
    if (respBody?.code !== 200) {
        if (respBody?.code === 401) {
            // token过期,跳转到登录页
            const userStore = useUserStore()
            const currentRoute = router.currentRoute.value
            // 先执行logout清理状态
            await userStore.logout()
            // 保存当前URL，以便重新登录后返回
            if (currentRoute.path !== '/login') {
              sessionStorage.setItem('redirectUrl', currentRoute.fullPath)
            }
            ElMessage.error('登录已过期,请重新登录')
        } else {
            ElMessage.error(respBody?.msg || '请求失败')
        }
        return Promise.reject(respBody)
    }

    // 返回data字段
    return respBody.data
  },
  (error) => {
      console.log('网络错误:', error)
      if (error.response?.status != 200){
          ElMessage.error('网络错误, 请稍后再试')
      }
    return Promise.reject(error)
  }
)

/**
 * 尝试使用 Mock 处理请求
 * @param url API路径
 * @param data 请求数据
 * @returns 如果Mock处理了请求返回Promise，否则返回null
 */
function tryMockRequest<T>(url: string, data?: any): Promise<T> | null {
  if (USE_MOCK && hasMockHandler(url)) {
    return new Promise((resolve, reject) => {
      // 模拟网络延迟
      setTimeout(() => {
        const response = handleMockRequest(url, data)
        if (response) {
          if (response.code === 200) {
            resolve(response.data as T)
          } else {
            ElMessage.error(response.msg || '请求失败')
            reject(response)
          }
        } else {
          reject(new Error('Mock handler returned null'))
        }
      }, 100) // 100ms 延迟模拟网络请求
    })
  }
  return null
}

/**
 * 请求封装(支持模拟数据)
 */
const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const mockResult = tryMockRequest<T>(url, config?.params)
    if (mockResult) return mockResult
    return service.get(url, config)
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const mockResult = tryMockRequest<T>(url, data)
    if (mockResult) return mockResult
    return service.post(url, data, config)
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const mockResult = tryMockRequest<T>(url, data)
    if (mockResult) return mockResult
    return service.put(url, data, config)
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const mockResult = tryMockRequest<T>(url, config?.params)
    if (mockResult) return mockResult
    return service.delete(url, config)
  },

  /**
   * 上传文件
   * @param url 请求地址
   * @param formData FormData对象
   * @param onUploadProgress 上传进度回调
   */
  upload<T = any>(
    url: string,
    formData: FormData,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<T> {
    // 文件上传不使用 Mock
    return service.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    })
  },
}

export default request
export { service }
