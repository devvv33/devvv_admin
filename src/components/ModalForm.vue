<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="computedWidth"
    class="modal-form"
    @close="handleClose"
  >
    <DynamicForm
      ref="dynamicFormRef"
      v-model="localFormData"
      :fields="fieldsWithRules"
      label-width="100px"
    />
    <template #footer>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { PageField } from '@/types/menu'
import DynamicForm from './DynamicForm.vue'

interface Props {
  modelValue: boolean
  title: string
  fields: PageField[]
  formData: Record<string, any>
  width?: string
  loading: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: '600px',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [data: Record<string, any>]
}>()

const dynamicFormRef = ref()
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

// 表单数据（深拷贝，避免直接修改props）
const localFormData = ref<Record<string, any>>({})

// 监听props.formData变化，更新本地表单数据
watch(
  () => props.formData,
  (newData) => {
    localFormData.value = { ...newData }
  },
  { immediate: true, deep: true }
)

// 为字段添加验证规则（通过 extra 配置）
const fieldsWithRules = computed(() => {
  return props.fields.map(field => {
    if (field.required && field.extra) {
      try {
        const extra = JSON.parse(field.extra)
        // 如果已经有 rules，则不修改
        if (!extra.rules) {
          extra.rules = [
            { required: true, message: `请输入${field.fieldLabel}`, trigger: ['input', 'change', 'blur'] }
          ]
          return {
            ...field,
            extra: JSON.stringify(extra)
          }
        }
      } catch {
        // 解析失败，返回原字段
      }
    }
    return field
  })
})

// 处理提交
const handleSubmit = async () => {
  const formRef = dynamicFormRef.value?.formRef
  if (!formRef) {
    const submitData = prepareSubmitData()
    emit('submit', submitData)
    return
  }

  await formRef.validate((valid: boolean) => {
    if (valid) {
      const submitData = prepareSubmitData()
      emit('submit', submitData)
    }
  })
}

// 准备提交数据（如果有文件字段则返回 FormData，否则返回普通对象）
const prepareSubmitData = (): FormData | Record<string, any> => {
  // 检查是否有文件字段
  const hasFiles = dynamicFormRef.value?.hasFileFields?.()
  
  if (hasFiles) {
    // 有文件字段，返回 FormData
    return dynamicFormRef.value.getFormData()
  } else {
    // 没有文件字段，返回普通对象
    return { ...localFormData.value }
  }
}

// 处理关闭
const handleClose = () => {
  dialogVisible.value = false
  const formRef = dynamicFormRef.value?.formRef
  formRef?.resetFields()
}
</script>

<style lang="scss">
.modal-form {
  .el-dialog__body {
    padding: 10px;
    max-height: 80vh;
    overflow-y: auto;
  }
}
</style>

