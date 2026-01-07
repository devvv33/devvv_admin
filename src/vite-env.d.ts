/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'element-plus/dist/locale/zh-cn.mjs' {
  import type { Locale } from 'element-plus'
  const zhCn: Locale
  export default zhCn
}

interface ImportMetaEnv {
  readonly VITE_USE_MOCK: string
  readonly VITE_USE_ENCRYPT: string
  readonly VITE_RSA_PUBLIC_KEY: string
  readonly VITE_APP_VERSION: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
