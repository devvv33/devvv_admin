import { defineConfig, loadEnv, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import archiver from 'archiver'
import fs from 'node:fs'
import { dirname, resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(rootDir, 'dist')

function zipBuildOutputPlugin(): Plugin {
  return {
    name: 'zip-build-output',
    apply: 'build',
    async closeBundle() {
      const zipPath = resolve(rootDir, `${basename(outDir)}.zip`)

      if (fs.existsSync(zipPath)) {
        fs.unlinkSync(zipPath)
      }

      await new Promise<void>((resolvePromise, reject) => {
        const output = fs.createWriteStream(zipPath)
        const archive = archiver('zip', { zlib: { level: 9 } })

        output.on('close', () => resolvePromise())
        output.on('error', (err) => reject(err))

        archive.on('warning', (err: any) => {
          // 例如：缺失文件等非致命告警
          if (err?.code === 'ENOENT') console.warn(err)
          else reject(err)
        })
        archive.on('error', (err) => reject(err))

        archive.pipe(output)
        archive.directory(outDir, false)
        archive.finalize()
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, rootDir, '')
  
  return {
    base: env.VITE_BASE_URL || '/',
    plugins: [vue(), zipBuildOutputPlugin()],
    resolve: {
      alias: {
        '@': resolve(rootDir, 'src'),
      },
    },
    build: {
      // 指定输出目录
      outDir,
      emptyOutDir: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: {
        // 代理所有 /api 开头的请求到后端服务器
        '/cmsApi': {
          target: 'http://localhost:8801',
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/cmsFile': {
          target: 'http://localhost:8801',
          changeOrigin: true,
        },
      },
    },
  }
})
