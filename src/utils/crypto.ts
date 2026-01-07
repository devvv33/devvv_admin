import CryptoJS from 'crypto-js'
import JSEncrypt from 'jsencrypt'

/**
 * AES加密工具类
 */
export class AESCrypto {
  /**
   * 生成32位随机AES密钥
   */
  static generateKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let key = ''
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
  }

  /**
   * AES加密
   * @param data 要加密的数据
   * @param key AES密钥
   * @returns 加密后的Base64字符串
   */
  static encrypt(data: string, key: string): string {
    const encrypted = CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  }

  /**
   * AES解密
   * @param encryptedData 加密的数据
   * @param key AES密钥
   * @returns 解密后的字符串
   */
  static decrypt(encryptedData: string, key: string): string {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, CryptoJS.enc.Utf8.parse(key), {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
  }
}

/**
 * RSA加密工具类
 */
export class RSACrypto {
  // RSA公钥 - 从环境变量中读取
  private static readonly PUBLIC_KEY = import.meta.env.VITE_RSA_PUBLIC_KEY || ''

  /**
   * 使用RSA公钥加密数据
   * @param data 要加密的数据
   * @returns 加密后的Base64字符串
   */
  static encrypt(data: string): string {
    if (!this.PUBLIC_KEY) {
      throw new Error('RSA公钥未配置，请检查环境变量 VITE_RSA_PUBLIC_KEY')
    }
    const jsEncrypt = new JSEncrypt()
    jsEncrypt.setPublicKey(this.PUBLIC_KEY)
    const encrypted = jsEncrypt.encrypt(data)
    if (!encrypted) {
      throw new Error('RSA加密失败')
    }
    return encrypted
  }

  /**
   * 设置RSA公钥
   * @param publicKey RSA公钥
   */
  static setPublicKey(publicKey: string) {
    // 可以通过这个方法动态设置公钥
    Object.defineProperty(this, 'PUBLIC_KEY', {
      value: publicKey,
      writable: true,
      configurable: true,
    })
  }
}

/**
 * 生成32位随机数
 */
export function generateRandomString(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

