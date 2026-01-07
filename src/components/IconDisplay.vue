<template>
  <span class="icon-display">
    <!-- Element Plus 图标 -->
    <el-icon v-if="iconType === 'element' && iconName" :size="size" :color="color">
      <component :is="iconName" />
    </el-icon>
    
    <!-- Iconify 图标 - 用 el-icon 包裹以保持样式一致 -->
    <el-icon v-else-if="iconType === 'iconify' && iconName" :size="size" :color="color">
      <Icon
        :icon="iconName"
        :width="size"
        :height="size"
      />
    </el-icon>
    
    <!-- 默认占位符 -->
    <el-icon v-else :size="size" :color="color">
      <component :is="'Document'" />
    </el-icon>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

interface Props {
  // 图标值，格式：
  // - Element Plus: 直接图标名，如 "User"
  // - Iconify: 带前缀，如 "mdi:home" 或完整的 "iconify:mdi:home"
  icon?: string
  size?: number
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  size: 16,
  color: undefined
})

// 解析图标类型和名称
const { iconType, iconName } = computed(() => {
  if (!props.icon) {
    return { iconType: '', iconName: ''}
  }

  // 检查是否是 Iconify 格式（包含冒号）
  if (props.icon.includes(':')) {
    
    // Iconify 格式：iconify:mdi:home 或 mdi:home
    const iconifyName = props.icon.startsWith('iconify:') 
      ? props.icon.replace('iconify:', '') 
      : props.icon
    
    return { iconType: 'iconify', iconName: iconifyName }
  }

  // Element Plus 图标
  if (Object.keys(ElementPlusIconsVue).includes(props.icon)) {
    return { iconType: 'element', iconName: props.icon }
  }

  // 未知类型
  return { iconType: '', iconName: '' }
}).value

</script>

<style scoped lang="scss">
.icon-display {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  // 确保所有图标容器的样式统一
  :deep(.el-icon) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}
</style>

