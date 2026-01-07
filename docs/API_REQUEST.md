# 后端接口请求功能使用说明

## 功能概述

本项目实现了完整的后端接口请求功能,支持开发环境和生产环境的加密请求。

## 配置说明

### 环境变量

在项目根目录的 `.env.development` 和 `.env.production` 文件中配置:

```env

# 是否使用加密 (开发环境false, 生产环境true)
VITE_USE_ENCRYPT=false

# 应用版本号
VITE_APP_VERSION=1.0.0
```

### RSA 公钥配置（推荐）

项目从环境变量读取 RSA 公钥（后端提供），用于加密 AES key：

- `VITE_RSA_PUBLIC_KEY`

示例（注意换行可以用 `\n`）：

```env
VITE_RSA_PUBLIC_KEY=-----BEGIN PUBLIC KEY-----\n你的RSA公钥内容\n-----END PUBLIC KEY-----
```

对应实现见：`src/utils/crypto.ts`

## 使用方法

### 1. 基本请求

```typescript
import request from '@/api/request'

// GET请求
const data = await request.get<UserInfo>('/user/info')

// POST请求
const result = await request.post('/user/update', {
  name: '张三',
  age: 25
})

// PUT请求
const result = await request.put('/user/1', userData)

// DELETE请求
const result = await request.delete('/user/1')
```

### 2. 文件上传

```typescript
import request from '@/api/request'

// 创建FormData
const formData = new FormData()
formData.append('file', file)
formData.append('name', 'example')

// 上传文件(带进度)
const result = await request.upload('/upload', formData, (progressEvent) => {
  const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
  console.log(`上传进度: ${progress}%`)
})
```

### 3. 自定义请求头

```typescript
import request from '@/api/request'

const data = await request.get('/api/data', {
  headers: {
    'Custom-Header': 'value'
  }
})
```

## 加密流程说明

### 开发环境 (VITE_USE_ENCRYPT=false)

- 请求头 `x-inf`: 客户端信息(未加密)
- 请求体: 原始JSON数据(未加密)
- 响应体: 原始JSON数据(未加密)

### 生产环境 (VITE_USE_ENCRYPT=true)

#### 请求加密:

1. 生成32位随机AES密钥
2. 收集客户端信息(时间戳、随机数、渠道码等)
3. 使用AES密钥加密客户端信息,设置到请求头 `x-inf`
4. 使用RSA公钥加密AES密钥,设置到请求头 `x-arg`
5. 当Content-Type是`application/json`时,使用AES密钥加密请求体
6. 当Content-Type是`multipart/form-data`时,不加密(文件上传)

#### 响应解密:

1. 检查响应数据是否为JSON格式
2. 如果不是JSON,说明是加密数据,使用AES密钥解密
3. 解密后解析为JSON对象
4. 返回data字段给业务层

## 后端响应格式

```typescript
{
  "code": 200,         // 200表示成功, 其他表示失败
  "msg": "success",    // 消息提示
  "data": {}           // 业务数据(对象/数组/字符串)
}
```

## 文件结构

```
src/
├── api/
│   └── request.ts              # 请求封装主文件
├── utils/
│   ├── crypto.ts               # 加密工具类(AES/RSA)
│   └── client_info_util.ts     # 客户端信息工具类
└── vite-env.d.ts              # 环境变量类型声明
```

## 注意事项

1. **RSA公钥**: 必须从服务端获取真实的公钥并更新到 `crypto.ts` 中
2. **环境配置**: 生产环境必须开启加密 (`VITE_USE_ENCRYPT=true`)
3. **文件上传**: 使用 `multipart/form-data` 时不会加密请求体
4. **错误处理**: 所有请求错误会自动弹出提示,无需手动处理
5. **Token认证**: 如果有token,会自动添加到请求头 `Authorization`

## 示例代码

参考 `src/api/auth.ts` 和 `src/api/menu.ts` 中的使用示例。

## 调试

在开发环境下可以通过浏览器控制台查看:
- 请求头中的 `x-inf` (未加密的客户端信息)
- 请求体(未加密的JSON数据)
- 响应数据(未加密的JSON数据)

在生产环境下所有敏感数据都会被加密传输。

