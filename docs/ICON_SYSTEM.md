# 图标系统使用说明

## 概述

项目已集成增强版图标系统，支持三种图标来源：
1. **Element Plus 图标** - 内置图标库
2. **Iconify** - 在线图标库（超过150,000个图标）

## 功能特性

### 1. 多图标库支持
- **Element Plus**: 项目内置的 Element Plus 官方图标
- **Iconify**: 包含 Material Design、Font Awesome、Bootstrap Icons 等主流图标库

### 2. 在线搜索
- 支持通过关键词在 Iconify 中搜索图标
- 可按图标集筛选（Material Design, Font Awesome 等）
- 实时预览图标效果

## 组件使用

### IconSelector 图标选择器

在表单中选择图标：

```vue
<template>
  <IconSelector
    v-model="showIconSelector"
    :current-icon="formData.icon"
    @select="handleIconSelect"
  />
</template>

<script setup>
import { ref } from 'vue'

const showIconSelector = ref(false)
const formData = ref({ icon: '' })

const handleIconSelect = (selection) => {
  // selection 结构: { type: 'element'|'iconify', name: string, content?: string }
  
  if (selection.type === 'element') {
    formData.value.icon = selection.name  // 例如: "User"
  } else if (selection.type === 'iconify') {
    formData.value.icon = `iconify:${selection.name}`  // 例如: "iconify:mdi:home"
  }
}
</script>
```

#### Props
- `modelValue` (Boolean): 控制对话框显示/隐藏
- `currentIcon` (String, 可选): 当前已选择的图标，用于高亮显示

#### Events
- `update:modelValue`: 对话框状态变化时触发
- `select`: 选择图标时触发，返回 `{ type, name, content? }` 对象

### IconDisplay 图标显示组件

显示任意类型的图标：

```vue
<template>
  <!-- Element Plus 图标 -->
  <IconDisplay icon="User" :size="24" color="#409eff" />
  
  <!-- Iconify 图标 -->
  <IconDisplay icon="iconify:mdi:home" :size="24" />
</template>

<script setup>
import IconDisplay from '@/components/IconDisplay.vue'
</script>
```

#### Props
- `icon` (String): 图标标识符
  - Element Plus: 直接使用图标名，如 `"User"`
  - Iconify: 使用 `iconify:` 前缀，如 `"iconify:mdi:home"`
- `size` (Number, 默认: 16): 图标大小（像素）
- `color` (String, 可选): 图标颜色

## 图标格式说明

### Element Plus 图标
存储格式：直接使用图标名
```
"User"
"Setting"
"Document"
```

### Iconify 图标
存储格式：`iconify:` + 图标集前缀 + `:` + 图标名
```
"iconify:mdi:home"
"iconify:fa:user"
"iconify:bi:heart"
```

常用图标集：
- `mdi` - Material Design Icons
- `fa` - Font Awesome
- `bi` - Bootstrap Icons
- `ant-design` - Ant Design Icons
- `carbon` - Carbon Design System
- `lucide` - Lucide Icons

## 在菜单管理中使用

在菜单管理页面，点击"选择图标"按钮：

1. **选择 Element Plus 图标**
   - 切换到"Element Plus"标签页
   - 搜索或滚动查找图标
   - 点击图标选择

2. **搜索 Iconify 图标**
   - 切换到"Iconify (在线搜索)"标签页
   - 输入关键词（如 "home", "user", "settings"）
   - 点击"搜索"按钮
   - 或者点击常用图标集快速查看
   - 选择喜欢的图标

## 注意事项

1. **网络连接**: Iconify 图标需要网络连接才能搜索和显示
2**性能**: Iconify 图标首次加载可能较慢，后续会被缓存

## API 参考

### Iconify API
本项目使用 Iconify 的公共 API：
- 搜索图标: `https://api.iconify.design/search?query={keyword}`
- 获取图标集: `https://api.iconify.design/collection?prefix={collection}`

更多信息：https://iconify.design/docs/api/

## 示例

### 完整的表单示例

```vue
<template>
  <el-form :model="form">
    <el-form-item label="图标">
      <div style="display: flex; gap: 10px; align-items: center;">
        <el-input
          v-model="form.icon"
          placeholder="请选择图标"
          style="flex: 1"
          readonly
        />
        <el-button @click="showIconSelector = true">选择图标</el-button>
        <IconDisplay v-if="form.icon" :icon="form.icon" :size="20" />
      </div>
    </el-form-item>
  </el-form>

  <IconSelector
    v-model="showIconSelector"
    :current-icon="form.icon"
    @select="handleIconSelect"
  />
</template>

<script setup>
import { ref } from 'vue'
import IconSelector from '@/components/IconSelector.vue'
import IconDisplay from '@/components/IconDisplay.vue'

const showIconSelector = ref(false)
const form = ref({ icon: '' })

const handleIconSelect = (selection) => {
  if (selection.type === 'element') {
    form.value.icon = selection.name
  } else if (selection.type === 'iconify') {
    form.value.icon = `iconify:${selection.name}`
  }
}
</script>
```

## 故障排除

### Iconify 图标无法显示
1. 检查网络连接
2. 确认图标名称格式正确（带 `iconify:` 前缀）
3. 查看浏览器控制台是否有错误

### Element Plus 图标不显示
- 确认图标名称在 Element Plus 图标库中存在
- 检查是否正确导入了 Element Plus 图标库

