# 代理配置说明

## 配置概述

已完成开发环境和生产环境的接口代理配置。

## 开发环境

### 配置位置
- `vite.config.ts` - Vite 开发服务器代理配置
- `src/api/request.ts` - Axios baseURL 配置

### 工作原理
1. 前端请求发送到：`/api/xxx`
2. Vite 代理将请求转发到：`http://localhost:8888/xxx`
3. 这样浏览器只看到同源请求，避免 CORS 问题

### 示例
```typescript
// 前端代码
request.get('/auth/userInfo')

// 实际请求地址（开发环境）
// 浏览器看到：http://localhost:3000/api/auth/userInfo
// Vite代理转发到：http://localhost:8888/auth/userInfo
```

## 生产环境

### 配置位置
- `src/api/request.ts` - Axios baseURL 配置为 `/api`

### 工作原理
1. 打包后的应用部署到服务器
2. Nginx 配置代理规则，将 `/api/*` 转发到后端服务
3. 前端请求相对路径 `/api/xxx`，由 Nginx 转发

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态资源
    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api/ {
        proxy_pass http://backend-server:8888/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 环境变量

可以创建以下文件来管理不同环境的配置：

### `.env.development` (开发环境)
```env
VITE_USE_ENCRYPT=false
VITE_APP_VERSION=1.0.0
```

### `.env.production` (生产环境)
```env
VITE_USE_ENCRYPT=true
VITE_APP_VERSION=1.0.0
```

## 启动项目

### 开发环境
```bash
pnpm install
pnpm dev
```
访问：http://localhost:3000

### 生产环境构建
```bash
pnpm build
```
输出目录：`dist/`

## 注意事项

1. **开发环境**：确保后端服务运行在 `http://localhost:8888`
2. **生产环境**：确保 Nginx 正确配置了 `/api` 代理规则
3. **跨域问题**：通过代理方式，前后端同源，避免浏览器 CORS 限制
4. **加密功能**：生产环境建议开启 `VITE_USE_ENCRYPT=true`

## 测试方法

### 开发环境测试
1. 启动后端服务（端口 8888）
2. 启动前端开发服务器：`pnpm dev`
3. 打开浏览器访问 http://localhost:3000
4. 查看 Network 面板，请求应该发送到 `/api/*`

### 生产环境测试
1. 构建项目：`pnpm build`
2. 部署 dist 目录到服务器
3. 配置 Nginx 代理规则
4. 访问域名测试功能

