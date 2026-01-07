<template>
  <div class="list-content" :class="{ 'mobile': isMobile }">
    <!-- 查询表单 -->
    <div v-if="searchFields.length > 0" class="search-form" :class="{ 'search-collapsed': isMobile && !searchExpanded }">
      <DynamicForm
        ref="searchFormRef"
        v-model="searchForm"
        :fields="searchFields"
        :inline="!isMobile"
        :label-width="isMobile?'90px':'auto'"
        @initialized="handleSearch"
        @submit="handleSearch"
      />
      <div class="search-buttons">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
        <!-- 移动端显示展开/收起按钮（仅当有多个查询条件时显示） -->
        <el-button 
          v-if="isMobile && searchFields.length > 0"
          @click="searchExpanded = !searchExpanded"
          link
        >
          {{ searchExpanded ? '收起' : '展开' }}
          <el-icon :class="{ 'rotate-180': searchExpanded }">
            <ArrowDown />
          </el-icon>
        </el-button>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      height="100%"
      style="width: 100%"
      :row-key="rowKey"
      :default-expand-all="defaultExpandAll"
      show-overflow-tooltip
    >
      <el-table-column v-for="column in columns"
        :key="column.fieldKey"
        :prop="column.fieldKey"
        :label="column.fieldLabel"
        :width="getCalculatedColumnWidth(column.width)"
      >
        <template #default="{ row }">
          <!-- 根据展示类型渲染 -->
           <!-- TAG标签 -->
          <el-tag 
            v-if="column.showType === 'TAG'" 
            :effect="parseExtraString(column.extra, 'tagEffect', 'light')"
            :type="getTagType(formatValue(row[column.fieldKey], row, column.formatScript), column)"
          >
            {{ formatValue(row[column.fieldKey], row, column.formatScript) }}
          </el-tag>

          <!-- 图片 -->
          <template v-else-if="column.showType === 'IMAGE'">
            <template v-if="formatValue(row[column.fieldKey], row, column.formatScript)">
              <el-image 
                v-for="(imgUrl, index) in String(formatValue(row[column.fieldKey], row, column.formatScript)).split(',')" 
                :key="index"
                :src="imgUrl.trim()"
                style="width: 40px; height: 40px; margin-right: 4px"
                fit="contain"
                loading="lazy"
                :preview-src-list="String(formatValue(row[column.fieldKey], row, column.formatScript)).split(',').map(url => url.trim())"
                :initial-index="index"
                :scale="0.8"
                :hide-on-click-modal="true"
                :show-progress="true"
                :preview-teleported="true"
              />
            </template>
          </template>

          <!-- 外链 -->
          <a v-else-if="column.showType === 'LINK'" :href="row[column.fieldKey]" target="_blank">
            {{ formatValue(row[column.fieldKey], row, column.formatScript) }}
          </a>

          <!-- 普通文本 -->
          <span v-else>{{ formatValue(row[column.fieldKey], row, column.formatScript) }}</span>
        </template>
      </el-table-column>
      <!-- 操作列 - 只在有操作按钮时显示 -->
      <el-table-column 
        v-if="rowButtons.length > 0"
        label="操作" 
        :width="columnButtonCfg.columnWidth"
        fixed="right"
        class-name="operation-column"
      >
        <template #default="{ row }">
          <!-- 显示前面的按钮 -->
          <template v-for="button in columnButtonCfg.visibleButtons" :key="button.id">
            <el-tooltip effect="dark" :content="button.menuName" placement="top">
              <el-button
                :type="getButtonType(button)"
                link
                size="large"
                @click="handleRowButtonClick(button, row)"
              >
                <IconDisplay v-if="button.icon" :icon="button.icon" :size="16" />
                {{ !button.icon ? button.menuName : '' }}
              </el-button>
            </el-tooltip>
          </template>
          <!-- 如果有更多按钮，显示下拉菜单 -->
          <el-dropdown 
            v-if="columnButtonCfg.hiddenButtons.length > 0"
            trigger="click" 
            @command="(command: MenuItem) => handleRowButtonClick(command, row)"
          >
            <el-button type="primary" link>
              <el-icon><MoreFilled /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="button in columnButtonCfg.hiddenButtons"
                  :key="button.id"
                  :command="button"
                >
                  <IconDisplay v-if="button.icon" :icon="button.icon" :size="16" style="margin-right: 5px;" />
                  {{ button.menuName }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div v-if="pagination" class="pagination-container">
      <el-pagination
        v-model:current-page="paginationData.pageNum"
        v-model:page-size="paginationData.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="paginationData.total"
        :size="isMobile?'small':'default'"
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 底部按钮 -->
    <div v-if="footerButtons.length > 0" class="footer-buttons">
      <el-button
        v-for="button in footerButtons"
        :key="button.id"
        :type="getButtonType(button)"
        @click="handleFooterButtonClick(button)"
      >
        <IconDisplay v-if="button.icon" :icon="button.icon" :size="16" style="margin-right: 5px;" />
        {{ button.menuName }}
      </el-button>
    </div>

    <!-- 弹窗表单组件 -->
    <ModalForm
      v-if="modalVisible"
      v-model="modalVisible"
      :width="parseExtraString(currentButton?.extra, 'modalWidth', '600px')"
      :title="currentButton?.menuName || ''"
      :fields="currentButton?.formFieldList || []"
      :form-data="modalFormData"
      :loading="modalLoading"
      @submit="handleModalSubmit"
    />

    <!-- 弹窗列表组件 -->
    <ModalList
      v-if="listModalVisible"
      v-model="listModalVisible"
      :title="currentButton?.menuName || ''"
      :width="parseExtraString(currentButton?.extra, 'modalWidth', '80%')"
      :menu-config="currentButton"
      :children-menu="listModalChildrenMenu"
      :row-data="modalFormData"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { MoreFilled, ArrowDown } from '@element-plus/icons-vue'
import type { MenuItem, PageField } from '@/types/menu'
import { ButtonActionType, ButtonPosition, MenuType } from '@/types/menu'
import ModalForm from '@/components/ModalForm.vue'
import ModalList from '@/components/ModalList.vue'
import DynamicForm from '@/components/DynamicForm.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import request from '@/api/request'
import { parseExtraBoolean, parseExtraNumber, parseExtraString, parseExtraField } from '@/utils/parse_extra_util'
import { useMenuStore } from '@/stores/menu_store'

const menuStore = useMenuStore()

// Props：接收菜单配置
const props = defineProps<{
  menuConfig: MenuItem | null
  childrenMenu: MenuItem[] | null
  initialParams?: Record<string, any>
}>()

// 检测是否为移动端
const isMobile = ref(false)
const checkMobile = () => { isMobile.value = window.innerWidth <= 768 }
// 移动端搜索条件展开状态
const searchExpanded = ref(false)

// 表格引用
const tableRef = ref()
// 表格容器宽度
const tableWidth = ref(1000)

// rowKey
const rowKey = computed(() => parseExtraString(props.menuConfig?.extra, 'rowKey', ''))
const defaultExpandAll = computed(() => parseExtraBoolean(props.menuConfig?.extra, 'defaultExpandAll', false))
// 表格列配置
const columns = computed<PageField[]>(() => props.menuConfig?.columnFieldList || [])
// 查询字段配置
const searchFields = computed<PageField[]>(() => props.menuConfig?.searchFieldList || [])
// 是否分页（从extra中解析）
const pagination = computed(() => parseExtraBoolean(props.menuConfig?.extra, 'pagination', true))
// 每页数量（从extra中解析）
const pageSize = computed(() => parseExtraNumber(props.menuConfig?.extra, 'pageSize', 10))
// 查询接口
const queryApi = computed(() => props.menuConfig?.apiUrl || '')

// 查询表单
const searchFormRef = ref()
const searchForm = reactive<Record<string, any>>({})

// 初始化查询表单默认值（从 initialParams 中获取）
const initSearchFormDefaults = () => {
  if (props.initialParams) {
    Object.assign(searchForm, props.initialParams)
  }
}

// 表格数据
const tableData = ref<any[]>([])
const loading = ref(false)

// 分页数据
const paginationData = reactive({
  pageNum: 1,
  pageSize: pageSize.value,
  total: 0,
})

// 行级按钮
const rowButtons = computed(() => {
  return props.childrenMenu?.filter(btn => btn.menuType == MenuType.BUTTON && btn.buttonPosition === ButtonPosition.ROW) || []
})

// 底部按钮
const footerButtons = computed(() => {
  return props.childrenMenu?.filter(btn => btn.menuType == MenuType.BUTTON && btn.buttonPosition === ButtonPosition.FOOTER) || []
})

// 行级按钮- 列配置
const columnButtonCfg = computed<{
  columnWidth: number
  visibleButtons: MenuItem[]
  hiddenButtons: MenuItem[]
}>(() => {
  const buttons = rowButtons.value
  const buttonCount = buttons.length
  
  // 无按钮时直接返回
  if (buttonCount === 0) {
    return { columnWidth: 0, visibleButtons: [], hiddenButtons: [] }
  }

  // 最大显示按钮数（移动端固定为1）
  const maxColumnButtons = isMobile.value ? 1 : parseExtraNumber(props.menuConfig?.extra, 'maxColumnButtons', 3)

  // 可见按钮数量（需要给"更多"按钮预留位置）
  const visibleCount = buttonCount > maxColumnButtons ? maxColumnButtons - 1 : buttonCount
  
  // 计算列宽：每个按钮约42px，最小50px
  const buttonWidth = 42
  const showCount = Math.min(buttonCount, maxColumnButtons)
  const columnWidth = Math.max(showCount * buttonWidth, 50)

  return {
    columnWidth,
    visibleButtons: buttons.slice(0, visibleCount),
    hiddenButtons: buttons.slice(visibleCount)
  }
})

// 计算列的实际宽度（支持百分比）
const getCalculatedColumnWidth = (width: string | number | undefined) => {
  if (!width) return undefined
  
  // 如果是百分比格式，根据表格宽度计算实际像素值
  if (typeof width === 'string' && width.includes('%')) {
    const percentage = parseFloat(width)
    // 总宽 = 表宽-操作列宽度， 最小800px
    const totalWidth = Math.max(800, tableWidth.value - columnButtonCfg.value.columnWidth)
    // 计算百分比对应的像素值
    const calculatedWidth = Math.floor((totalWidth * percentage) / 100)
    // 设置最小宽度 20px
    return Math.max(20, calculatedWidth)
  }
  
  // 固定宽度直接返回（数字或带px的字符串）
  return width
}

// 更新表格宽度
const updateTableWidth = () => {
  nextTick(() => {
    if (tableRef.value?.$el) {
      const width = tableRef.value.$el.clientWidth
      if (width > 0) {
        tableWidth.value = width
      }
    }
  })
}

// 弹窗表单相关
const modalVisible = ref(false)
const currentButton = ref<MenuItem | null>(null)
const modalFormData = ref<Record<string, any>>({})
const modalLoading = ref(false)

// 弹窗列表相关
const listModalVisible = ref(false)
const listModalChildrenMenu = ref<MenuItem[]>([])

// 加载表格数据
const loadTableData = async () => {
  // 如果 menuConfig 还没有传入，静默返回（等待 watch 触发）
  if (!props.menuConfig) {
    return
  }
  
  if (!queryApi.value) {
    ElMessage.warning('未配置查询接口')
    return
  }

  loading.value = true
  try {
    // 构建查询参数
    const params: Record<string, any> = {
      ...(props.initialParams || {}),
      ...searchForm,
    }

    // 如果支持分页,添加分页参数
    if (pagination.value) {
      params.pageNum = paginationData.pageNum
      params.pageSize = paginationData.pageSize
    }

    // 调用查询接口
    const pageData = await request.post(queryApi.value, { ...params })
    if (pagination.value) {
      tableData.value = pageData.list || []
      paginationData.total = Number(pageData.total) || 0
    } else {
      tableData.value = pageData
    }
  } catch (error: any) {
    ElMessage.error(error.message || '加载数据失败')
  } finally {
    loading.value = false
  }
}

// 格式化值
const formatValue = (value: any, row: any, formatScript: any) => {
  if (!formatScript) {
    return value
  }
  try {
    // 执行格式化函数
    const func = new Function('value', 'row', formatScript)
    return func(value, row)
  } catch (error) {
    return value
  }
}


// 获取Tag类型（根据文案匹配样式）
const getTagType = (value: any, column: PageField): string => {
  // 将值转换为字符串进行匹配
  const valueStr = String(value || '')
  
  // 1. 优先使用 extra 中配置的 tagMap
  const tagMap = parseExtraField<Record<string, string>>(column.extra, 'tagMap', {})
  if (tagMap && typeof tagMap === 'object' && Object.keys(tagMap).length > 0) {
    // 完全匹配
    if (tagMap[valueStr]) {
      return tagMap[valueStr]
    }
    // 如果配置了 default，使用 default
    if (tagMap['default']) {
      return tagMap['default']
    }
  }
  
  // 2. 内置常见文案的默认匹配规则
  const builtInMap: Record<string, string> = {
    '正常': 'success',
    '启用': 'success',
    '成功': 'success',
    '已通过': 'success',
    '已完成': 'success',
    '是': 'success',
    
    '禁用': 'danger',
    '异常': 'danger',
    '失败': 'danger',
    '已拒绝': 'danger',
    '错误': 'danger',
    '否': 'danger',
    
    '待审核': 'warning',
    '处理中': 'warning',
    '进行中': 'warning',
    '警告': 'warning',
    
    '草稿': 'info',
    '未开始': 'info',
    '已取消': 'info',
  }
  return builtInMap[valueStr] || ''
}

// 获取按钮类型
const getButtonType = (button: MenuItem): string => {
  let buttonType = parseExtraString(button.extra, 'buttonType', '')
  if (!buttonType && button.menuName.includes('删除')) return 'danger'
  if (!buttonType && button.menuName.includes('添加')) return 'primary'
  if (!buttonType && button.menuName.includes('新增')) return 'primary'
  if (!buttonType && button.menuName.includes('编辑')) return 'primary'
  if (!buttonType && button.menuName.includes('修改')) return 'primary'
  return buttonType || 'default'
}

// 处理查询
const handleSearch = () => {
  paginationData.pageNum = 1
  loadTableData()
}

// 处理重置
const handleReset = () => {
  const formRef = searchFormRef.value?.formRef
  formRef?.resetFields()
  handleSearch()
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  paginationData.pageSize = size
  paginationData.pageNum = 1
  loadTableData()
}

// 处理当前页变化
const handleCurrentChange = (pageNum: number) => {
  paginationData.pageNum = pageNum
  loadTableData()
}

// 处理行按钮点击
const handleRowButtonClick = async (button: MenuItem, row: any) => {
  currentButton.value = button

  // 如果有展示前处理脚本，执行脚本
  let rowTmp = { ...row }
  if (currentButton.value.beforeShowScript) {
    try {
      // 使用 AsyncFunction 构造函数支持 async/await
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const func = new AsyncFunction('row', 'request', currentButton.value.beforeShowScript)
      rowTmp = await func(rowTmp, request)
    } catch (error) {
      console.error('执行展示前脚本失败:', error)
    }
  }
  modalFormData.value = rowTmp

  if (button.buttonAction === ButtonActionType.MODAL_FORM) {
    // 显示弹窗表单
    modalVisible.value = true
  } else if (button.buttonAction === ButtonActionType.MODAL_LIST) {
    // 显示弹窗列表
    listModalChildrenMenu.value = menuStore.listMenuByParentId(button.id) || []
    listModalVisible.value = true
  } else if (button.buttonAction === ButtonActionType.CONFIRM) {
    // 显示确认提示，优先从extra字段中取message字段
    const message = parseExtraString(button.extra, 'message', `确定要${button.menuName}吗？`)
    ElMessageBox.confirm(message, '提示', { type: 'warning' })
      .then(() => {
        handleButtonSubmit(button, row)
      })
      .catch(() => {})
  } else if (button.buttonAction === ButtonActionType.PAGE) {
    // 打开新页面
    if (button.apiUrl) {
      window.open(button.apiUrl, '_blank')
    }
  }
}

// 处理底部按钮点击
const handleFooterButtonClick = (button: MenuItem) => {
  currentButton.value = button
  modalFormData.value = {}

  if (button.buttonAction === ButtonActionType.MODAL_FORM) {
    modalVisible.value = true
  } else if (button.buttonAction === ButtonActionType.MODAL_LIST) {
    // 显示弹窗列表
    listModalChildrenMenu.value = menuStore.listMenuByParentId(button.id) || []
    listModalVisible.value = true
  } else if (button.buttonAction === ButtonActionType.CONFIRM) {
    // 显示确认提示，优先从extra字段中取message字段
    const message = parseExtraString(button.extra, 'message', `确定要${button.menuName}吗？`)
    ElMessageBox.confirm(message, '提示', { type: 'warning' })
      .then(() => {
        handleButtonSubmit(button, {})
      })
      .catch(() => {})
  } else if (button.buttonAction === ButtonActionType.EXPORT) {
    // 如果配置了表单字段，显示弹窗让用户填写额外的导出参数
    if (button.formFieldList && button.formFieldList.length > 0) {
      modalVisible.value = true
    } else {
      // 直接导出
      handleExport(button)
    }
  } else if (button.buttonAction === ButtonActionType.DOWNLOAD) {
    if (button.apiUrl) {
      window.open(button.apiUrl, '_blank')
    }
  } else if (button.buttonAction === ButtonActionType.PAGE) {
    if (button.apiUrl) {
      window.open(button.apiUrl, '_blank')
    }
  }
}

// 处理列表导出
const handleExport = async (button: MenuItem, extraParams?: Record<string, any>) => {
  if (!button.apiUrl) return

  loading.value = true
  try {
    const params = {
      ...(props.initialParams || {}),
      ...searchForm,
      ...(extraParams || {})
    }
    const response = await request.post(button.apiUrl, params, { responseType: 'blob' })

    // 检查响应是否为错误
    if (response.data.type === 'application/json') {
      // 可能是错误响应，尝试解析
      const text = await response.data.text()
      try {
        const errorData = JSON.parse(text)
        ElMessage.error(errorData.msg || '导出失败')
        return
      } catch (e) {}
    }

    // 从响应头获取文件名，如果没有则使用默认文件名
    const contentDisposition = response.headers?.['content-disposition']
    let fileName = '导出文件.xlsx'
    if (contentDisposition) {
      // 尝试解析普通 filename="xxx" 或 filename=xxx 格式
      const normalMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/i)
      if (normalMatch && normalMatch[1]) {
        fileName = decodeURIComponent(normalMatch[1].replace(/['"]/g, ''))
      }
    }

    // 创建 Blob 对象并下载
    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败')
  } finally {
    loading.value = false
  }
}

// 处理弹窗提交
const handleModalSubmit = async (formData: Record<string, any> | FormData) => {
  if (!currentButton.value) return

  // 如果是导出类型，直接调用导出方法
  if (currentButton.value.buttonAction === ButtonActionType.EXPORT) {
    modalVisible.value = false
    const extraParams = formData instanceof FormData ? Object.fromEntries(formData.entries()) : formData
    await handleExport(currentButton.value, extraParams)
    return
  }

  let submitData = formData
  modalLoading.value = true
  try {
    // 如果有提交前处理脚本，执行脚本（仅对非 FormData 执行）
    if (currentButton.value.beforeSubmitScript && !(formData instanceof FormData)) {
      try {
        // 使用 AsyncFunction 构造函数支持 async/await
        const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
        const func = new AsyncFunction('formData', 'request', currentButton.value.beforeSubmitScript)
        submitData = await func(formData, request)
      } catch (error) {
        console.error('执行提交前脚本失败:', error)
      }
    }

    // 调用提交接口
    if (currentButton.value.apiUrl) {
      // 如果是 FormData，使用 upload 方法；否则使用 post 方法
      if (submitData instanceof FormData) {
        await request.upload(currentButton.value.apiUrl, submitData)
      } else {
        await request.post(currentButton.value.apiUrl, submitData)
      }
      ElMessage.success('操作成功')
      modalVisible.value = false
      // 重新加载表格数据
      loadTableData()
    }
  } finally {
    modalLoading.value = false
  }
}

// 处理按钮提交（非弹窗类型）
const handleButtonSubmit = async (button: MenuItem, row?: any) => {
  let submitData = row || {}

  // 如果有提交前处理脚本，执行脚本
  if (button.beforeSubmitScript) {
    try {
      // 使用 AsyncFunction 构造函数支持 async/await
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const func = new AsyncFunction('formData', 'request', button.beforeSubmitScript)
      submitData = await func(submitData, request)
    } catch (error) {
      console.error('执行提交前脚本失败:', error)
      ElMessage.error('执行提交前脚本失败')
      return
    }
  }

  // 调用提交接口
  if (button.apiUrl) {
    await request.post(button.apiUrl, submitData)
    ElMessage.success('操作成功')
    // 重新加载表格数据
    loadTableData()
  } else {
    console.error('未配置提交接口', button)
    ElMessage.error('操作失败,请联系管理员')
  }
}

// 处理窗口大小变化
const handleResize = () => {
  updateTableWidth()
  checkMobile()
}

// 初始化
onMounted(async () => {
  // 初始化查询表单默认值
  initSearchFormDefaults()
  
  // 如果 menuConfig 已经传入，且没有查询条件，则直接触发初始化查询
  // 否则将通过查询表单的 init 触发初始化查询，或者通过 watch 在 menuConfig 变化时触发
  if (props.menuConfig && (!props.menuConfig.searchFieldList || props.menuConfig.searchFieldList.length == 0)) {
    handleSearch()
  }

  // 监听并处理窗口大小变化
  handleResize()
  window.addEventListener('resize', handleResize)
})

// 组件卸载时移除监听
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听菜单配置变化，重新加载数据
watch(() => props.menuConfig, (newVal) => {
  if (newVal) {
    // 重置分页
    paginationData.pageNum = 1
    paginationData.pageSize = pageSize.value
    // 初始化查询表单默认值
    initSearchFormDefaults()
    // 重新加载数据
    if (!newVal.searchFieldList || newVal.searchFieldList.length == 0) {
      handleSearch()
    }
  }
}, { deep: true })

</script>

<style scoped lang="scss">
.list-content {
  // 移动端样式调整
  &.mobile {
    // 移动端搜索表单特殊样式
    .search-form {
      flex-direction: column;
      align-items: stretch !important;

      :deep(.el-form) {
        width: 100%;
        
        .el-form-item {
          width: 100% !important;
          margin-right: 0 !important;
          margin-bottom: 12px !important;
        }
      }

      .search-buttons {
        width: 100%;
        padding-bottom: 0 !important;
        justify-content: flex-start;
      }

      // 收起状态：隐藏查询条件
      &.search-collapsed {
        :deep(.el-form) {
          .el-form-item {
            display: none;
          }
        }
      }
    }
  }

  .search-form {
    margin-bottom: 10px;
    display: flex;
    align-items: flex-end;
    gap: 12px;

    // 让表单占据主要空间
    :deep(.el-form) {
      flex: 1;
      
      // 调整表单项宽度，让一行能显示5个搜索条件
      .el-form-item {
        width: calc(20% - 12px);
        margin-right: 12px;
        margin-bottom: 12px;
        
        .el-form-item__content {
          flex: 1;
          
          .el-input,
          .el-select,
          .el-date-picker {
            width: 100%;
          }
        }
      }
    }

    // 按钮区域保持在同一行，对齐到底部
    .search-buttons {
      flex-shrink: 0;
      display: flex;
      gap: 8px;
      padding-bottom: 12px;

      // 展开/收起图标旋转动画
      .el-icon {
        transition: transform 0.3s ease;
        margin-left: 4px;

        &.rotate-180 {
          transform: rotate(180deg);
        }
      }
    }
  }

  // 表格表头不换行，超出显示省略号
  :deep(.el-table) {
    .el-table__header-wrapper {
      .el-table__header {
        th {
          .cell {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }

  .pagination-container {
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
  }

  .footer-buttons {
    margin-top: 8px;
    display: flex;
    gap: 8px;
  }
}
</style>
