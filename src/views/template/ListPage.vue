<template>
  <div class="list-page-container" :class="{ 'mobile': isMobile }">
    <el-card>
      <ListContent
        :menu-config="currentMenu"
        :children-menu="childrenMenu"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/menu_store'
import type { MenuItem } from '@/types/menu'
import ListContent from '@/components/ListContent.vue'

const route = useRoute()
const menuStore = useMenuStore()

// 检测是否为移动端
const isMobile = ref(false)
const checkMobile = () => { isMobile.value = window.innerWidth <= 768 }

// 当前菜单配置
const currentMenu = ref<MenuItem | null>(null)
const childrenMenu = ref<MenuItem[] | null>(null)

// 初始化
onMounted(async () => {
  // 根据路由获取当前菜单
  const menuId = route.name
  if (menuId && typeof menuId === 'string') {
    currentMenu.value = menuStore.getMenuById(menuId) || null
    childrenMenu.value = menuStore.listMenuByParentId(menuId)
  }

  // 监听并处理窗口大小变化
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped lang="scss">
.list-page-container {
  :deep(.el-card__body) {
    padding: 20px 14px;
  }
  // 移动端样式调整
  &.mobile {
    :deep(.el-card__body) {
      padding: 8px;
    }
  }
}
</style>
