/**
 * extra 字段解析工具
 * 用于解析菜单、字段等配置中的 extra JSON 字段
 */

/**
 * 解析 extra 字段中的指定属性
 * @param extra - extra JSON 字符串
 * @param key - 要获取的属性名
 * @param defaultValue - 默认值
 * @returns 解析后的值或默认值
 */
export function parseExtraField<T = any>(
  extra: string | undefined,
  key: string,
  defaultValue?: T
): T | undefined {
  if (!extra) {
    return defaultValue
  }
  
  try {
    const parsed = JSON.parse(extra)
    // 如果key存在且不为undefined，返回该值，否则返回默认值
    return key in parsed && parsed[key] !== undefined ? parsed[key] : defaultValue
  } catch {
    return defaultValue
  }
}

/**
 * 解析 extra 字段为完整的对象
 * @param extra - extra JSON 字符串
 * @returns 解析后的对象或空对象
 */
export function parseExtra(extra: string | undefined): Record<string, any> {
  if (!extra) {
    return {}
  }
  
  try {
    return JSON.parse(extra)
  } catch {
    return {}
  }
}

/**
 * 从 extra 中获取布尔值（支持字符串 'true'/'false'）
 * @param extra - extra JSON 字符串
 * @param key - 要获取的属性名
 * @param defaultValue - 默认值
 * @returns 布尔值
 */
export function parseExtraBoolean(
  extra: string | undefined,
  key: string,
  defaultValue: boolean = false
): boolean {
  const value = parseExtraField(extra, key, defaultValue)
  if (typeof value === 'boolean') {
    return value
  }
  if (typeof value === 'string') {
    return value === 'true'
  }
  return defaultValue
}

/**
 * 从 extra 中获取数字值
 * @param extra - extra JSON 字符串
 * @param key - 要获取的属性名
 * @param defaultValue - 默认值
 * @returns 数字值
 */
export function parseExtraNumber(
  extra: string | undefined,
  key: string,
  defaultValue: number = 0
): number {
  const value = parseExtraField(extra, key, defaultValue)
  const num = Number(value)
  return isNaN(num) ? defaultValue : num
}

/**
 * 从 extra 中获取字符串值
 * @param extra - extra JSON 字符串
 * @param key - 要获取的属性名
 * @param defaultValue - 默认值
 * @returns 字符串值
 */
export function parseExtraString(
  extra: string | undefined,
  key: string,
  defaultValue: string = ''
): string {
  const value = parseExtraField(extra, key, defaultValue)
  return value != null ? String(value) : defaultValue
}

