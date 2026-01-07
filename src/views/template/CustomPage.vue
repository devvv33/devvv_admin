<template>
  <div class="custom-page-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ currentMenu?.menuName || '自定义页面' }}</span>
        </div>
      </template>
      <div class="page-content">
        <el-alert
          v-if="!pageComponent"
          title="提示"
          type="info"
          :closable="false"
          show-icon
        >
          <template #default>
            <p>当前页面为自定义页面，页面Code: {{ currentMenu?.customComponent || '未配置' }}</p>
            <p>请在 <code>src/views/custom/</code> 目录下创建对应的页面组件</p>
          </template>
        </el-alert>
        <component v-else :is="pageComponent" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu_store'
import type { MenuItem } from '@/types/menu'

const route = useRoute()
const menuStore = useMenuStore()

// 当前菜单
const currentMenu = ref<MenuItem | null>(null)
// 页面组件
const pageComponent = shallowRef<any>(null)

// 加载页面组件
const loadPageComponent = async () => {
  if (!currentMenu.value?.customComponent) {
    return
  }

  try {
    // 动态导入自定义页面组件
    const component = await import(`@/views/custom/${currentMenu.value.customComponent}.vue`)
    pageComponent.value = component.default
  } catch (error) {
    console.error('加载自定义页面组件失败:', error)
    pageComponent.value = null
  }
}

// 初始化
onMounted(async () => {
  // 根据路由获取当前菜单
  const menuId = route.name
  if (menuId && typeof menuId === 'string') {
    currentMenu.value = menuStore.getMenuById(menuId) || null
    await loadPageComponent()
  }
})
</script>

<style scoped lang="scss">
.custom-page-container {
  .card-header {
    font-size: 16px;
    font-weight: bold;
  }

  .page-content {
    min-height: 400px;

    code {
      background: #f5f7fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
  }
}
</style>

