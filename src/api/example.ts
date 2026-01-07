import request from './request'

/**
 * 示例API - 展示如何使用请求封装
 */

// ==================== 基本请求示例 ====================

/**
 * 获取用户列表
 */
export function getUserList(params?: { page?: number; size?: number }) {
  return request.get('/user/list', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: string) {
  return request.get(`/user/${id}`)
}

/**
 * 创建用户
 */
export function createUser(data: { name: string; email: string; phone: string }) {
  return request.post('/user/create', data)
}

/**
 * 更新用户
 */
export function updateUser(id: string, data: any) {
  return request.put(`/user/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: string) {
  return request.delete(`/user/${id}`)
}

// ==================== 文件上传示例 ====================

/**
 * 上传单个文件
 */
export function uploadFile(file: File, onProgress?: (progress: number) => void) {
  const formData = new FormData()
  formData.append('file', file)
  
  return request.upload('/file/upload', formData, (progressEvent: any) => {
    if (onProgress && progressEvent.total) {
      const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      onProgress(progress)
    }
  })
}

/**
 * 上传多个文件
 */
export function uploadMultipleFiles(files: File[]) {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('files', file)
  })
  
  return request.upload('/file/upload-multiple', formData)
}

/**
 * 上传文件并附带其他数据
 */
export function uploadFileWithData(file: File, data: { title: string; description: string }) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('title', data.title)
  formData.append('description', data.description)
  
  return request.upload('/file/upload-with-data', formData)
}

// ==================== 复杂请求示例 ====================

/**
 * 批量操作
 */
export function batchOperation(data: { action: string; ids: string[] }) {
  return request.post('/batch/operation', data)
}

/**
 * 导出数据(返回文件流)
 */
export function exportData(params: any) {
  return request.get('/data/export', {
    params,
    responseType: 'blob', // 接收文件流
  })
}

/**
 * 获取数据并设置自定义请求头
 */
export function getDataWithCustomHeaders(params: any) {
  return request.get('/data/custom', {
    params,
    headers: {
      'X-Custom-Header': 'custom-value',
    },
  })
}

// ==================== 使用示例 ====================

/**
 * 在Vue组件中使用示例:
 * 
 * <script setup lang="ts">
 * import { ref } from 'vue'
 * import { getUserList, createUser, uploadFile } from '@/api/example'
 * 
 * const users = ref([])
 * const loading = ref(false)
 * 
 * // 获取用户列表
 * async function fetchUsers() {
 *   loading.value = true
 *   try {
 *     users.value = await getUserList({ page: 1, size: 10 })
 *   } catch (error) {
 *     console.error('获取用户列表失败:', error)
 *   } finally {
 *     loading.value = false
 *   }
 * }
 * 
 * // 创建用户
 * async function handleCreateUser() {
 *   try {
 *     await createUser({
 *       name: '张三',
 *       email: 'zhangsan@example.com',
 *       phone: '13800138000'
 *     })
 *     // 创建成功,刷新列表
 *     fetchUsers()
 *   } catch (error) {
 *     console.error('创建用户失败:', error)
 *   }
 * }
 * 
 * // 上传文件
 * const uploadProgress = ref(0)
 * async function handleUpload(file: File) {
 *   try {
 *     const result = await uploadFile(file, (progress) => {
 *       uploadProgress.value = progress
 *     })
 *     console.log('上传成功:', result)
 *   } catch (error) {
 *     console.error('上传失败:', error)
 *   }
 * }
 * </script>
 */

