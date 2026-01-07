/**
 * 客户端信息工具类
 */

/**
 * 客户端信息接口
 */
export interface ClientInfo {
  t: number      // 客户端时间戳,毫秒
  n: string      // 32位随机数
  c: string      // 渠道码,当前固定为'WEB'
  i: string      // 客户端类型,当前固定为"CM"
  v: string      // 客户端版本号
  nt?: string    // 网络类型
  os?: string    // 操作系统
  ov?: string    // 操作系统版本号
  di?: string    // 自定义设备id
}

/**
 * 获取网络类型
 */
function getNetworkType(): string {
  // 检测网络类型
  if ('connection' in navigator) {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection
    if (connection) {
      const effectiveType = connection.effectiveType
      if (effectiveType) {
        return effectiveType.toUpperCase() // '2g', '3g', '4g' 等
      }
    }
  }
  // 默认返回 wifi (浏览器环境一般是wifi或网线)
  return 'WIFI'
}

/**
 * 获取操作系统信息
 */
function getOSInfo(): { os: string; ov: string } {
  const userAgent = navigator.userAgent
  let os = 'Unknown'
  let ov = ''

  if (userAgent.indexOf('Win') !== -1) {
    os = 'Windows'
    // 尝试获取Windows版本
    if (userAgent.indexOf('Windows NT 10.0') !== -1) ov = '10'
    else if (userAgent.indexOf('Windows NT 6.3') !== -1) ov = '8.1'
    else if (userAgent.indexOf('Windows NT 6.2') !== -1) ov = '8'
    else if (userAgent.indexOf('Windows NT 6.1') !== -1) ov = '7'
  } else if (userAgent.indexOf('Mac') !== -1) {
    os = 'MacOS'
    // 尝试获取MacOS版本
    const match = userAgent.match(/Mac OS X (\d+[._]\d+[._]\d+)/)
    if (match) ov = match[1].replace(/_/g, '.')
  } else if (userAgent.indexOf('Linux') !== -1) {
    os = 'Linux'
  } else if (userAgent.indexOf('Android') !== -1) {
    os = 'Android'
    // 尝试获取Android版本
    const match = userAgent.match(/Android (\d+\.?\d*)/)
    if (match) ov = match[1]
  } else if (userAgent.indexOf('iOS') !== -1 || userAgent.indexOf('iPhone') !== -1 || userAgent.indexOf('iPad') !== -1) {
    os = 'iOS'
    // 尝试获取iOS版本
    const match = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/)
    if (match) ov = `${match[1]}.${match[2]}${match[3] ? '.' + match[3] : ''}`
  }

  return { os, ov }
}

/**
 * 获取或创建设备ID
 */
function getDeviceId(): string {
  const key = 'cms_device_id'
  let deviceId = localStorage.getItem(key)
  
  if (!deviceId) {
    // 生成32位随机设备ID
    deviceId = generateRandomId(32)
    localStorage.setItem(key, deviceId)
  }
  
  return deviceId
}

/**
 * 生成随机ID
 */
function generateRandomId(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * 生成32位随机数
 */
function generateNonce(): string {
  return generateRandomId(32)
}

/**
 * 获取客户端信息
 */
export function getClientInfo(version: string = '1.0.0'): ClientInfo {
  const { os, ov } = getOSInfo()
  
  return {
    t: Date.now(),
    n: generateNonce(),
    c: 'WEB',
    i: 'CM',
    v: version,
    nt: getNetworkType(),
    os,
    ov,
    di: getDeviceId(),
  }
}

/**
 * 将客户端信息转换为字符串 (key1=value1&key2=value2格式)
 */
export function clientInfoToString(info: ClientInfo): string {
  const params: string[] = []
  
  // 按照顺序添加参数
  params.push(`t=${info.t}`)
  params.push(`n=${info.n}`)
  params.push(`c=${info.c}`)
  params.push(`i=${info.i}`)
  params.push(`v=${info.v}`)
  
  if (info.nt) params.push(`nt=${info.nt}`)
  if (info.os) params.push(`os=${info.os}`)
  if (info.ov) params.push(`ov=${info.ov}`)
  if (info.di) params.push(`di=${info.di}`)
  
  return params.join('&')
}

