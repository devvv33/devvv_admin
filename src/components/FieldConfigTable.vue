<template>
  <div class="field-config-table">
    <el-button type="primary" size="small" @click="handleAdd">添加{{ fieldTypeLabel }}</el-button>
    <el-table ref="tableRef" :data="modelValue" border row-key="_id" style="margin-top: 10px">
      <!-- 拖拽列 -->
      <el-table-column label="拖拽" width="60" align="center">
        <template #default>
          <el-icon class="drag-handle" style="cursor: move; font-size: 16px;">
            <Rank />
          </el-icon>
        </template>
      </el-table-column>
      
      <!-- 通用列：字段名 -->
      <el-table-column prop="fieldKey" label="字段名" width="120">
        <template #default="{ row }">
          <el-input v-model="row.fieldKey" placeholder="字段名" size="small" />
        </template>
      </el-table-column>
      
      <!-- 通用列：标签 -->
      <el-table-column prop="fieldLabel" :label="fieldType === 'column' ? '列标题' : '标签'" width="120">
        <template #default="{ row }">
          <el-input v-model="row.fieldLabel" placeholder="标签" size="small" />
        </template>
      </el-table-column>
      
      <!-- 列表字段特有：宽度 -->
      <el-table-column v-if="fieldType === 'column'" prop="width" label="宽度" width="100">
        <template #default="{ row }">
          <el-input v-model="row.width" placeholder="宽度" size="small" />
        </template>
      </el-table-column>
      
      <!-- 查询/表单字段：输入类型 -->
      <el-table-column v-if="fieldType === 'search' || fieldType === 'form'" prop="inputType" label="类型" width="120">
        <template #default="{ row }">
          <el-select v-model="row.inputType" placeholder="类型" size="small">
            <template v-if="fieldType === 'search'">
              <el-option label="输入框" value="input" />
              <el-option label="下拉框" value="select" />
              <el-option label="日期" value="date" />
              <el-option label="日期范围" value="dateRange" />
            </template>
            <template v-else>
              <el-option label="输入框" value="input" />
              <el-option label="文本域" value="textarea" />
              <el-option label="数字输入框" value="number" />
              <el-option label="下拉框" value="select" />
              <el-option label="树型下拉框" value="treeSelect" />
              <el-option label="日期" value="date" />
              <el-option label="日期范围" value="dateRange" />
              <el-option label="文件上传" value="upload" />
              <el-option label="文件下载" value="download" />
            </template>
          </el-select>
        </template>
      </el-table-column>
      
      <!-- 列表字段特有：展示类型 -->
      <el-table-column v-if="fieldType === 'column'" prop="showType" label="展示类型" width="120">
        <template #default="{ row }">
          <el-select v-model="row.showType" placeholder="展示类型" size="small">
            <el-option label="文本" value="TEXT" />
            <el-option label="TAG标签" value="TAG" />
            <el-option label="图片" value="IMAGE" />
            <el-option label="视频" value="VIDEO" />
            <el-option label="音频" value="AUDIO" />
            <el-option label="链接" value="LINK" />
          </el-select>
        </template>
      </el-table-column>
      
      <!-- 列表字段特有：格式化JS -->
      <el-table-column v-if="fieldType === 'column'" prop="formatScript" label="格式化JS">
        <template #default="{ row }">
          <el-input v-model="row.formatScript" placeholder="格式化JS代码; 参数:[value,row]" size="small" />
        </template>
      </el-table-column>
      
      <!-- 查询/表单字段：必填 -->
      <el-table-column v-if="fieldType === 'search' || fieldType === 'form'" prop="required" label="必填" width="80">
        <template #default="{ row }">
          <el-switch v-model="row.required" size="small" />
        </template>
      </el-table-column>
      
      <!-- 额外配置 -->
      <el-table-column prop="extra">
        <template #header>
          <el-tooltip placement="top" width="500px">
            <template #content>
              <div style="max-width: 500px;">
                <div>额外配置示例（JSON格式）：</div>
                <pre style="white-space: pre-wrap; word-break: break-all;">{{ extraTooltipContent }}</pre>
              </div>
            </template>
            <span style="cursor: help;">
              额外配置
              <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
            </span>
          </el-tooltip>
        </template>
        <template #default="{ row }">
          <el-input v-model="row.extra" placeholder="JSON格式" size="small" />
        </template>
      </el-table-column>
      
      <!-- 操作列 -->
      <el-table-column label="操作" width="80">
        <template #default="{ $index }">
          <el-button link type="danger" size="small" @click="handleRemove($index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { Rank, QuestionFilled } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'

type FieldType = 'search' | 'column' | 'form'

const props = defineProps<{
  modelValue: any[]
  fieldType: FieldType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
}>()

const tableRef = ref()
const sortableInstance = ref<Sortable | null>(null)

const fieldTypeLabel = computed(() => {
  const map: Record<FieldType, string> = {
    search: '查询字段',
    column: '列表字段',
    form: '表单字段'
  }
  return map[props.fieldType]
})

// 根据字段类型返回不同的额外配置提示
const extraTooltipContent = computed(() => {
  if (props.fieldType === 'column') {
    return `{
  // ---------- TAG配置 ----------
  "tagEffect": "light",   // 标签样式: dark/light/plain
  "tagMap": {             // 文案样式映射: primary/success/info/warning/danger
    "正常": "success",
    "禁用": "danger"
  }
}`
  }
  if (props.fieldType === 'search') {
    return `{
  "placeholder": "提示信息",
  "options": [{"label": "选项1", "value": "1"}]
}`
  }
  // form
  return `{
  "placeholder": "提示信息",
  "defaultValue": "默认值",
  "disabled": false,
  "readonly": false,
  "multiple": false,
  // ----- 下拉框/树形下拉框 -----
  "localOptions": [{"label": "正常", "value": "Enable"}],
  "enumOptions": "com.xxx.enums.EnableStatus",
  "queryUrl": "/api/dept/tree",
  "props": { "value": "id", "label": "name", "children": "children" },
  "checkStrictly": true,
  "showCheckbox": true,
  "collapseTags": false,
  // ----- 文件上传配置 -----
  "accept": "image/*",
  "limit": 1,
  "maxSize": 5
}`
})

// 添加字段
const handleAdd = () => {
  const newField: any = {
    _id: Date.now() + Math.random(),
    fieldKey: '',
    fieldLabel: '',
    extra: ''
  }
  
  if (props.fieldType === 'column') {
    newField.width = ''
    newField.showType = 'TEXT'
    newField.formatScript = ''
  } else {
    newField.required = false
    newField.inputType = 'input'
  }
  
  emit('update:modelValue', [...props.modelValue, newField])
  nextTick(() => initSortable())
}

// 删除字段
const handleRemove = (index: number) => {
  const list = [...props.modelValue]
  list.splice(index, 1)
  emit('update:modelValue', list)
}

// 初始化拖拽
const initSortable = () => {
  if (!tableRef.value) return
  
  // 销毁旧实例
  if (sortableInstance.value) {
    sortableInstance.value.destroy()
    sortableInstance.value = null
  }
  
  const tbody = tableRef.value.$el.querySelector('.el-table__body-wrapper tbody')
  if (!tbody) return
  
  sortableInstance.value = Sortable.create(tbody, {
    animation: 150,
    handle: '.drag-handle',
    onEnd: (evt: any) => {
      const { oldIndex, newIndex } = evt
      if (oldIndex !== undefined && newIndex !== undefined && oldIndex !== newIndex) {
        const list = [...props.modelValue]
        const item = list[oldIndex]
        list.splice(oldIndex, 1)
        list.splice(newIndex, 0, item)
        emit('update:modelValue', list)
      }
    }
  })
}

// 监听数据变化，重新初始化拖拽
watch(() => props.modelValue, () => {
  nextTick(() => {
    if (props.modelValue && props.modelValue.length > 0) {
      initSortable()
    }
  })
}, { deep: true })

// 组件挂载时初始化
onMounted(() => {
  if (props.modelValue && props.modelValue.length > 0) {
    nextTick(() => initSortable())
  }
})
</script>

<style scoped lang="scss">
.field-config-table {
  width: 100%;
  
  /* 拖拽手柄样式 */
  .drag-handle {
    cursor: move;
    color: #909399;
    transition: color 0.3s;

    &:hover {
      color: #409eff;
    }
  }

  /* 拖拽时的样式 */
  :deep(.sortable-ghost) {
    opacity: 0.4;
    background: #f5f7fa;
  }
}
</style>
