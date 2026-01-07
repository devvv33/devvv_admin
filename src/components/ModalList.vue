<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="computedWidth"
    destroy-on-close
    class="modal-list"
    @close="handleClose"
  >
    <!-- 使用 ListContent 组件渲染列表 -->
    <ListContent
      :menu-config="menuConfig"
      :children-menu="childrenMenu"
      :initial-params="rowData"
    />
    <!-- 不需要底部按钮 -->
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type { MenuItem } from '@/types/menu'

// 使用异步组件避免循环依赖
const ListContent = defineAsyncComponent(() => import('./ListContent.vue'))

interface Props {
  modelValue: boolean
  title: string
  width?: string
  menuConfig: MenuItem | null      // 按钮配置（包含 searchFieldList, columnFieldList, apiUrl 等）
  childrenMenu: MenuItem[]         // 按钮的子菜单配置（子级按钮）
  rowData?: Record<string, any>    // 来自父组件的行数据
}

const props = withDefaults(defineProps<Props>(), {
  width: '80%',
  childrenMenu: () => [],
  rowData: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 计算弹窗宽度 - 移动端时不超过屏幕宽度
const computedWidth = computed(() => {
  if (typeof window === 'undefined') return props.width
  if (window.innerWidth <= 768) {
    return '95%'
  }
  return props.width
})

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false
}
</script>

<style lang="scss">
.modal-list {
  .el-dialog__body {
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>
