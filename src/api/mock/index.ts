/**
 * Mock 系统入口
 */

export { handleMockRequest, hasMockHandler } from './mockHandlers'
export { ensureInitialized, resetMockData } from './mockStorage'

// 是否启用 Mock
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

console.log(`[Mock] Mock 模式: ${USE_MOCK ? '已启用' : '已禁用'}`)
