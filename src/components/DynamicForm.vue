<template>
  <el-form
    ref="formRef"
    :model="localFormData"
    :rules="formRules"
    :inline="inline"
    :label-width="labelWidth"
    :disabled="disabled"
     @submit.prevent
  >
    <el-form-item
      v-for="field in fields"
      :key="field.fieldKey"
      :label="field.fieldLabel"
      :prop="field.fieldKey"
    >
      <!-- 输入框 -->
      <el-input
        v-if="field.inputType === 'input'"
        v-model="localFormData[field.fieldKey]"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :style="getFieldStyle(field)"
        clearable
        @keyup.enter="handleSubmit"
      />
      <!-- 文本域 -->
      <el-input
        v-else-if="field.inputType === 'textarea'"
        v-model="localFormData[field.fieldKey]"
        type="textarea"
        :rows="4"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :style="getFieldStyle(field)"
        @keyup.enter="handleSubmit"
      />
      <!-- 数字输入框 -->
      <el-input-number
        v-else-if="field.inputType === 'number'"
        v-model="localFormData[field.fieldKey]"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        align="left"
        :style="getFieldStyle(field)"
        @keyup.enter="handleSubmit"
      />
      <!-- 下拉框 -->
      <el-select
        v-else-if="field.inputType === 'select'"
        v-model="localFormData[field.fieldKey]"
        :options="getFieldOptions(field)"
        :props="getFieldProps(field)"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :multiple="getFieldMultiple(field)"
        :style="getFieldStyle(field)"
        clearable
      />
      <!-- 树形选择器 -->
      <el-tree-select
        v-else-if="field.inputType === 'treeSelect'"
        v-model="localFormData[field.fieldKey]"
        :data="getFieldTreeData(field)"
        :props="getFieldProps(field)"
        :node-key="getFieldProps(field).value"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :multiple="getFieldMultiple(field)"
        :check-strictly="getFieldCheckStrictly(field)"
        :show-checkbox="getFieldShowCheckbox(field)"
        :collapse-tags="getFieldCollapseTags(field)"
        :collapse-tags-tooltip="getFieldCollapseTags(field)"
        :render-after-expand="false"
        :style="getFieldStyle(field)"
        clearable
      />
      <!-- 日期选择器 -->
      <el-date-picker
        v-else-if="field.inputType === 'date'"
        v-model="localFormData[field.fieldKey]"
        type="date"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :style="getFieldStyle(field)"
      />
      <!-- 日期时间选择器 -->
      <el-date-picker
        v-else-if="field.inputType === 'datetime'"
        v-model="localFormData[field.fieldKey]"
        type="datetime"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :style="getFieldStyle(field)"
      />
      <!-- 日期范围选择器 -->
      <el-date-picker
        v-else-if="field.inputType === 'dateRange'"
        v-model="localFormData[field.fieldKey]"
        type="daterange"
        :placeholder="getFieldPlaceholder(field)"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
        :style="getFieldStyle(field)"
      />
      <!-- 开关 -->
      <el-switch
        v-else-if="field.inputType === 'switch'"
        v-model="localFormData[field.fieldKey]"
        :disabled="getFieldDisabled(field)"
        :readonly="getFieldReadonly(field)"
      />
      <!-- 文件上传 -->
      <el-upload
        v-else-if="field.inputType === 'upload'"
        v-model:file-list="fileListMap[field.fieldKey]"
        :accept="getFieldAccept(field)"
        :limit="getFieldLimit(field)"
        :multiple="getFieldMultiple(field)"
        :disabled="getFieldDisabled(field)"
        :auto-upload="false"
        :on-change="(_file: any, fileList: any) => handleFileChange(field.fieldKey, fileList)"
        :on-remove="(_file: any, fileList: any) => handleFileRemove(field.fieldKey, fileList)"
        :on-exceed="handleFileExceed"
        :before-upload="(file: any) => beforeFileUpload(field, file)"
        :style="getFieldStyle(field)"
      >
        <template #trigger>
          <el-button type="primary" :disabled="getFieldDisabled(field)">
            选择文件
          </el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            {{ getUploadTip(field) }}
          </div>
        </template>
      </el-upload>
      <!-- 文件下载 -->
      <div v-else-if="field.inputType === 'download'" class="file-download-wrapper">
        <a
          :href="parseExtraString(field.extra, 'fileUrl', '')"
          :download="parseExtraString(field.extra, 'fileName', '下载文件')"
          target="_blank"
          class="file-download-link"
        >
          <el-icon><Download /></el-icon>
          <span>{{ parseExtraString(field.extra, 'fileName', '下载文件') }}</span>
        </a>
      </div>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, computed, type Ref } from 'vue'
import { ElMessage, type FormRules } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import type { PageField } from '@/types/menu'
import { sysApi } from '@/api/sys_api'
import { parseExtraField, parseExtraBoolean, parseExtraString, parseExtra } from '@/utils/parse_extra_util'
import request from "@/api/request.ts";

interface Props {
  fields: PageField[]
  modelValue: Record<string, any>
  inline?: boolean
  labelWidth?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  inline: false,
  labelWidth: '90px',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
  'initialized': []  // 初始化完成事件
  'submit': []  // 表单提交事件（回车触发）
}>()

// 内部表单数据
const localFormData: Ref<Record<string, any>> = ref({})
// 初始化标志，防止重复应用默认值
const isInitialized = ref(false)
// 文件列表映射（每个字段对应一个文件列表）
const fileListMap = ref<Record<string, any[]>>({})


// =================================== 字段校验规则 ===================================
// 表单验证规则
const formRules = computed<FormRules>(() => {
  const rules: FormRules = {}
  props.fields.forEach(field => {
    if (field.required) {
      // 根据不同的输入类型设置不同的提示信息和触发方式
      let message = `请输入${field.fieldLabel}`
      let trigger: string | string[] = ['input', 'change', 'blur']
      rules[field.fieldKey] = [
        { required: true, message, trigger },
      ]
    }
  })
  return rules
})


// ===================================下拉框的处理逻辑 ===================================
// 异步远程请求 获取下拉框的选项
const fieldOptionsMap = ref<Record<string, { label: string; value: any }[]>>({})
// 加载下拉框选项
const loadFieldOptions = async (fields: PageField[]) => {
  for (const field of fields) {
    if (field.inputType === 'select') {
      const extra = parseExtra(field.extra)
      
      // 1. 优先使用本地配置的选项
      if (extra.localOptions) {
        fieldOptionsMap.value[field.fieldKey] = extra.localOptions || []
        continue
      }
      // 2. 使用枚举选项
      if (extra.enumOptions) {
        fieldOptionsMap.value[field.fieldKey] = await sysApi.getEnumOptions(extra.enumOptions)
        continue
      }
      // 3. 如果配置了 url，则通过 url 获取
      if (extra.queryUrl) {
        fieldOptionsMap.value[field.fieldKey] = await request.post(extra.queryUrl, {})
        continue
      }
      // 默认空列表
      if (!fieldOptionsMap.value[field.fieldKey]) {
        fieldOptionsMap.value[field.fieldKey] = []
      }
    }
  }
}
// 获取下拉框选项
const getFieldOptions = (field: PageField): { label: string; value: any }[] => {
  return fieldOptionsMap.value[field.fieldKey] || []
}

// ===================================树形数据的处理逻辑 ===================================
const fieldTreeDataMap = ref<Record<string, any[]>>({})
// 加载树形数据
const loadFieldTreeData = async (fields: PageField[]) => {
  for (const field of fields) {
    if (field.inputType === 'treeSelect') {
      const extra = parseExtra(field.extra)
      // 从查询url获取
      if (extra.queryUrl) {
        fieldTreeDataMap.value[field.fieldKey] = await request.post(extra.queryUrl,{});
        continue
      }
    }
  }
}

// 获取树形数据
const getFieldTreeData = (field: PageField): any[] => {
  return fieldTreeDataMap.value[field.fieldKey] || []
}

// 获取是否严格模式（父子不关联）
const getFieldCheckStrictly = (field: PageField): boolean => {
  return parseExtraBoolean(field.extra, 'checkStrictly', false)
}

// 获取是否显示复选框
const getFieldShowCheckbox = (field: PageField): boolean => {
  return parseExtraBoolean(field.extra, 'showCheckbox', true)
}

// 多选项是否折叠
const getFieldCollapseTags = (field: PageField): boolean => {
  return parseExtraBoolean(field.extra, 'collapseTags', false)
}

// 获取选择器的 props 配置（字段映射）
const getFieldProps = (field: PageField): any => {
  const extra = parseExtra(field.extra)
  // 默认的字段映射
  const defaultProps = {
    value: 'value',
    label: 'label',
    children: 'children',
    disabled: 'disabled'
  }
  // 如果用户配置了自定义的 props，则合并
  return extra.props ? { ...defaultProps, ...extra.props } : defaultProps
}

// =================================== 字段默认值的处理逻辑 ===================================
// 监听 fields 变化，初始化表单数据和加载下拉框选项
watch(
  () => props.fields,
  async (fields) => {
    // 只在第一次初始化时应用默认值
    if (!isInitialized.value) {
      const initialData: Record<string, any> = {}
      
      // 先复制 modelValue 中的值
      Object.assign(initialData, props.modelValue)
      
      // 对于没有值的字段，应用默认值
      fields.forEach(field => {
        if (!(field.fieldKey in initialData)) {
          const defaultValue = parseExtraField(field.extra, 'defaultValue')
          if (defaultValue !== undefined) {
            initialData[field.fieldKey] = defaultValue
          }
        }
      })
      
      localFormData.value = initialData
      isInitialized.value = true
      
      // 同步到父组件
      emit('update:modelValue', { ...localFormData.value })

      // 发送初始化完成事件
      await nextTick()
      emit('initialized')
    }
    
    // 加载下拉框选项（每次 fields 变化都重新加载）
    await loadFieldOptions(fields)
    // 加载树形选择器
    await loadFieldTreeData(fields)
  },
  { immediate: true }
)

// 监听外部 modelValue 变化（避免循环更新）
watch(
  () => props.modelValue,
  (newVal) => {
    // 只有在值真正不同时才更新，避免循环
    if (JSON.stringify(newVal) !== JSON.stringify(localFormData.value)) {
      localFormData.value = { ...newVal }
    }
  },
  { deep: true }
)

// 监听内部数据变化，同步到父组件
watch(
  localFormData,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true }
)



// 获取字段占位符
const getFieldPlaceholder = (field: PageField): string => {
  return parseExtraString(field.extra, 'placeholder', `请输入${field.fieldLabel}`)
}

// 获取字段是否禁用
const getFieldDisabled = (field: PageField): boolean => {
  return parseExtraBoolean(field.extra, 'disabled', false)
}

// 获取字段是否只读
const getFieldReadonly = (field: PageField): boolean => {
  return parseExtraBoolean(field.extra, 'readonly', false)
}

// 获取字段是否多选
const getFieldMultiple = (field: PageField): boolean => {
  return parseExtraBoolean(field.extra, 'multiple', false)
}

// 获取字段样式
const getFieldStyle = (field: PageField): any => {
  // inline 模式下固定宽度，否则 100%
  if (props.inline) {
    if (field.inputType === 'dateRange') {
      return { width: '240px' }
    }
    return { width: '200px' }
  }
  return { width: '100%' }
}

// 处理表单提交（回车触发）
const handleSubmit = () => {
  emit('submit')
}

// =================================== 文件上传相关 ===================================
// 获取文件接受类型
const getFieldAccept = (field: PageField): string => {
  return parseExtraString(field.extra, 'accept', '')
}

// 获取文件上传数量限制
const getFieldLimit = (field: PageField): number => {
  const limit = parseExtraField(field.extra, 'limit')
  return limit !== undefined ? Number(limit) : (getFieldMultiple(field) ? 9999 : 1)
}

// 获取文件最大大小（MB）
const getFieldMaxSize = (field: PageField): number => {
  const maxSize = parseExtraField(field.extra, 'maxSize')
  return maxSize !== undefined ? Number(maxSize) : 10
}

// 获取上传提示文本
const getUploadTip = (field: PageField): string => {
  const accept = getFieldAccept(field)
  const maxSize = getFieldMaxSize(field)
  const limit = getFieldLimit(field)
  const multiple = getFieldMultiple(field)
  
  let tip = ''
  if (accept) {
    tip += `支持 ${accept} 格式`
  }
  if (maxSize) {
    tip += (tip ? '，' : '') + `单个文件不超过 ${maxSize}MB`
  }
  if (multiple && limit && limit !== 9999) {
    tip += (tip ? '，' : '') + `最多上传 ${limit} 个文件`
  }
  return tip || '请选择要上传的文件'
}

// 文件变化时
const handleFileChange = (fieldKey: string, fileList: any[]) => {
  fileListMap.value[fieldKey] = fileList
  // 将文件对象存储到表单数据中（用于后续表单验证）
  localFormData.value[fieldKey] = fileList.length > 0 ? fileList : undefined
}

// 文件移除时
const handleFileRemove = (fieldKey: string, fileList: any[]) => {
  fileListMap.value[fieldKey] = fileList
  localFormData.value[fieldKey] = fileList.length > 0 ? fileList : undefined
}

// 文件超出数量限制
const handleFileExceed = () => {
  ElMessage.warning('文件数量超出限制')
}

// 文件上传前的校验
const beforeFileUpload = (field: PageField, file: any): boolean => {
  const maxSize = getFieldMaxSize(field)
  const fileSizeMB = file.size / 1024 / 1024
  
  if (maxSize && fileSizeMB > maxSize) {
    ElMessage.error(`文件大小不能超过 ${maxSize}MB`)
    return false
  }
  
  return true
}

// 检查是否有文件字段
const hasFileFields = (): boolean => {
  return props.fields.some(field => field.inputType === 'upload')
}

// 获取包含文件的 FormData
const getFormData = (): FormData => {
  const formData = new FormData()
  
  // 遍历所有字段
  props.fields.forEach(field => {
    const fieldKey = field.fieldKey
    const value = localFormData.value[fieldKey]
    
    if (field.inputType === 'upload') {
      // 文件字段：添加文件到 FormData
      const fileList = fileListMap.value[fieldKey] || []
      fileList.forEach((fileItem: any) => {
        if (fileItem.raw) {
          // multiple 为 true 时，使用 fieldKey[] 作为 key
          const key = getFieldMultiple(field) ? `${fieldKey}[]` : fieldKey
          formData.append(key, fileItem.raw)
        }
      })
    } else if (value !== undefined && value !== null) {
      // 非文件字段：转换为字符串添加到 FormData
      if (Array.isArray(value)) {
        // 数组类型（如日期范围、多选等）
        // formData.append(fieldKey, JSON.stringify(value))
        value.forEach((item: any) => formData.append(fieldKey, String(item)))
      } else if (typeof value === 'object') {
        // 对象类型
        formData.append(fieldKey, JSON.stringify(value))
      } else {
        // 基本类型
        formData.append(fieldKey, String(value))
      }
    }
  })
  
  return formData
}

// 暴露 formRef 给父组件（用于表单验证等）
const formRef = ref()
defineExpose({
  formRef,
  // 暴露验证方法
  validate: () => formRef.value?.validate(),
  validateField: (prop: string) => formRef.value?.validateField(prop),
  resetFields: () => formRef.value?.resetFields(),
  clearValidate: () => formRef.value?.clearValidate(),
  // 暴露文件相关方法
  hasFileFields,
  getFormData,
})
</script>

<style scoped lang="scss">
// 文件下载样式
.file-download-wrapper {
  display: flex;
  align-items: center;
  
  .file-download-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: var(--el-color-primary);
    text-decoration: none;
    cursor: pointer;
    transition: color 0.3s;
    
    &:hover {
      color: var(--el-color-primary-light-3);
    }
    
    .el-icon {
      font-size: 16px;
    }
  }
}
</style>

