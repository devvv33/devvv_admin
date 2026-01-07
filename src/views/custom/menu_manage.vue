<template>
  <div class="menu-manage-container">
    <el-row :gutter="10" class="menu-manage-row">
      <!-- 左侧：菜单树 -->
      <el-col :span="5" class="menu-tree-col">
        <el-card class="menu-tree-card">
          <template #header>
            <div class="card-header">
              <span>菜单树</span>
              <el-button type="primary" @click="handleAddRoot">
                <el-icon><Plus /></el-icon>
                新增根节点
              </el-button>
            </div>
          </template>
          <el-tree
            ref="treeRef"
            :data="menuTree"
            :props="{ label: 'menuName', children: 'children' }"
            node-key="id"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <template #default="{ data }">
              <div class="tree-node">
                <span class="node-label">
                  <IconDisplay v-if="data.icon" :icon="data.icon" :size="14" class="node-icon" />
                  {{ data.menuName }}
                </span>
                <span class="node-actions">
                  <el-button
                    link
                    size="small"
                    type="primary"
                    @click.stop="handleAddChild(data)"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-button>
                  <el-button
                    link
                    size="small"
                    type="danger"
                    @click.stop="handleDelete(data)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧：配置表单 -->
      <el-col :span="19" class="menu-form-col">
        <el-card class="menu-form-card">
          <template #header>
            <div class="card-header">
              <span>{{ currentMenu ? '编辑菜单' : '新增菜单' }}</span>
            </div>
          </template>
          <el-form
            v-if="formData"
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            class="menu-form"
          >
            <!-- 基础信息 -->
            <el-divider content-position="left">基础信息</el-divider>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="formData.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
              <el-select v-model="formData.menuType" placeholder="请选择菜单类型" @change="handleTypeChange">
                <el-option label="模块" value="MODULE" />
                <el-option label="目录" value="DIRECTORY" />
                <el-option label="页面" value="PAGE" />
                <el-option label="按钮" value="BUTTON" />
              </el-select>
            </el-form-item>
            <el-form-item label="父级菜单" prop="parentId">
              <el-tree-select
                v-model="formData.parentId"
                :data="parentMenuOptions"
                :props="{ label: 'menuName', value: 'id', children: 'children' }"
                disabled
                placeholder="请选择父级菜单"
                check-strictly
                :render-after-expand="false"
                style="width: 100%"
              />
            </el-form-item>
            <el-form-item label="图标">
              <div style="display: flex; gap: 10px; align-items: center;">
                <el-input
                  v-model="formData.icon"
                  placeholder="请输入图标名称或选择图标"
                  style="flex: 1"
                  readonly
                />
                <el-button @click="showIconSelector = true">选择图标</el-button>
                <IconDisplay v-if="formData.icon" :icon="formData.icon" :key="formData.icon"  :size="20" />
              </div>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input-number v-model="formData.sort" :min="0" />
            </el-form-item>

            <el-form-item>
              <template #label>
                <el-tooltip placement="top" width="500px">
                  <template #content><div style="max-width: 500px;"><pre style="white-space: pre-wrap; word-break: break-all;">
列表: 将被用作查询接口
按钮:将被用作数据提交接口
                  </pre></div></template>
                  <span style="cursor: help;">
                    后台接口
                    <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
                  </span>
                </el-tooltip>
              </template>
              <el-input v-model="formData.apiUrl" placeholder="后台接口地址" />
            </el-form-item>

            <el-form-item label="扩展后台接口" prop="extApiUrl">
              <el-input v-model="formData.extApiUrl" placeholder="扩展鉴权后台接口地址,多个用逗号分割" />
            </el-form-item>

            <el-form-item>
              <template #label>
                <el-tooltip placement="top" width="500px">
                  <template #content>
                    <div style="max-width: 500px;">
                      <pre style="margin: 5px 0; white-space: pre-wrap; word-break: break-all;">
{
  -------------------------- 列表配置 --------------------------
  "rowKey": "id",           // 列表中的唯一键;构建树列表时必须要此配置
  "defaultExpandAll": true, // 是否默认全部展开
  "pagination": false,      // 不使用分页
  "maxColumnButtons": 3,    // 行按钮-最多显示几个
  -------------------------- 按钮配置 --------------------------
  "buttonType":"primary",       // 按钮样式: primary,success,info,warning,danger
  "message": "你确定要删除用户吗?",
  "modalWidth": "600px",
}
                      </pre>
                    </div>
                  </template>
                  <span style="cursor: help;">
                    额外配置
                    <el-icon style="margin-left: 4px;"><QuestionFilled /></el-icon>
                  </span>
                </el-tooltip>
              </template>
              <el-input
                  v-model="formData.extra"
                  type="textarea"
                  :rows="3"
                  placeholder='请输入JSON格式的额外配置，如：{"rowKey":"id"}'
              />
            </el-form-item>

            <!-- 页面配置（仅页面类型显示） -->
            <template v-if="formData.menuType === 'PAGE'">
              <el-divider content-position="left">页面配置</el-divider>
              <el-form-item label="页面类型" prop="pageType">
                <el-select v-model="formData.pageType" placeholder="请选择页面类型" @change="handlePageTypeChange">
                  <el-option label="列表页面" value="LIST" />
                  <el-option label="自定义页面" value="CUSTOM" />
                  <el-option label="外部页面" value="OUTER_LINK" />
                </el-select>
              </el-form-item>
              <el-form-item label="页面路由" prop="routePath">
                <el-input v-model="formData.routePath" placeholder="请输入路由路径，如：/user/list" />
              </el-form-item>
              <template v-if="formData.pageType === 'CUSTOM'">
                <el-form-item label="自定义组件" prop="customComponent">
                  <el-input v-model="formData.customComponent" placeholder="自定义组件名，需要在 src/views/custom/ 路径下" />
                </el-form-item>
              </template>


              <!-- 列表页面配置 -->
              <template v-if="formData.pageType === 'LIST'">
                <el-divider content-position="left">列表页面配置</el-divider>

                <!-- 查询字段 -->
                <el-form-item label="查询字段">
                  <FieldConfigTable v-model="formData.searchFieldList" field-type="search" />
                </el-form-item>
                <!-- 列表字段 -->
                <el-form-item label="列表字段">
                  <FieldConfigTable v-model="formData.columnFieldList" field-type="column" />
                </el-form-item>
              </template>
            </template>

            <!-- 按钮配置（仅按钮类型显示） -->
            <template v-if="formData.menuType === 'BUTTON'">
              <el-divider content-position="left">按钮配置</el-divider>
              <el-form-item label="按钮位置" prop="buttonPosition">
                <el-select v-model="formData.buttonPosition" placeholder="请选择按钮位置">
                  <el-option label="行级按钮" value="ROW" />
                  <el-option label="底部按钮" value="FOOTER" />
                </el-select>
              </el-form-item>
              <el-form-item label="操作类型" prop="buttonAction">
                <el-select v-model="formData.buttonAction" placeholder="请选择操作类型" @change="handleActionTypeChange">
                  <el-option label="弹窗表单" value="MODAL_FORM" />
                  <el-option label="弹窗列表" value="MODAL_LIST" />
                  <el-option label="确认框" value="CONFIRM" />
                  <el-option label="导出(带查询参数)" value="EXPORT" />
                  <el-option label="下载文件" value="DOWNLOAD" />
                  <el-option label="打开新页面" value="PAGE" />
                </el-select>
              </el-form-item>
              <el-form-item v-if="'ROW' === formData.buttonPosition && ['MODAL_FORM','MODAL_LIST'].includes(formData.buttonAction)" label="回显前处理脚本">
                <el-input
                  v-model="formData.beforeShowScript"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入JavaScript代码，用于在回显前处理表单数据; 参数:[row, request]   在添加下级菜单时,回填父级ID"
                />
              </el-form-item>
              <el-form-item v-if="['MODAL_FORM', 'CONFIRM'].includes(formData.buttonAction)" label="提交前处理脚本">
                <el-input
                  v-model="formData.beforeSubmitScript"
                  type="textarea"
                  :rows="3"
                  placeholder="请输入JavaScript代码，用于在提交前处理表单数据; 参数:[formData, request]"
                />
              </el-form-item>
              <!-- 弹窗表单字段 -->
              <el-form-item v-if="formData.buttonAction === 'MODAL_FORM'" label="表单字段">
                <FieldConfigTable v-model="formData.formFieldList" field-type="form" />
              </el-form-item>

              <!-- 弹窗列表配置 -->
              <template v-if="formData.buttonAction === 'MODAL_LIST'">
                <el-divider content-position="left">弹窗列表配置</el-divider>
                <el-form-item label="查询字段">
                  <FieldConfigTable v-model="formData.searchFieldList" field-type="search" />
                </el-form-item>
                <el-form-item label="列表字段">
                  <FieldConfigTable v-model="formData.columnFieldList" field-type="column" />
                </el-form-item>
              </template>
            </template>

            <!-- 提交按钮 -->
            <el-form-item class="menu-form-actions">
              <el-button type="primary" :loading="submitLoading" @click="handleSubmit">保存</el-button>
              <el-button @click="handleReset">重置</el-button>
              <el-button type="success" @click="handleExportConfig">导出配置</el-button>
              <el-button type="warning" @click="handleImportConfig">导入配置</el-button>
            </el-form-item>
          </el-form>
          <el-empty v-else description="请选择菜单节点进行编辑" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 图标选择器弹窗 -->
    <IconSelector
      v-model="showIconSelector"
      :current-icon="formData?.icon"
      @select="handleIconSelect"
    />

    <!-- 导入配置弹窗 -->
    <el-dialog v-model="showImportDialog" title="导入配置" width="600px" :close-on-click-modal="false">
      <el-input v-model="importJsonText" type="textarea" :rows="15" placeholder="请粘贴菜单配置JSON字符串"/>
      <template #footer>
        <el-button @click="showImportDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmImport">确认导入</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {ElMessage, ElMessageBox, type FormInstance, type FormRules} from 'element-plus'
import {Delete, Plus, QuestionFilled} from '@element-plus/icons-vue'
import {useMenuStore} from '@/stores/menu_store'
import {menuApi} from '@/api/menu'
import type {MenuItem} from '@/types/menu'
import {ButtonActionType, ButtonPosition, MenuType, PageType} from '@/types/menu'
import IconSelector from '@/components/IconSelector.vue'
import IconDisplay from '@/components/IconDisplay.vue'
import FieldConfigTable from '@/components/FieldConfigTable.vue'

const menuStore = useMenuStore()

const treeRef = ref()
const formRef = ref<FormInstance>()
const currentMenu = ref<MenuItem | null>(null)
const menuTree = ref<MenuItem[]>([])
const submitLoading = ref(false)


// ------------------------- 图标选择器 开始 -------------------------
// 图标选择器相关
const showIconSelector = ref(false)

// 处理图标选择
const handleIconSelect = (selection: { type: string; name: string; content?: string }) => {
  if (formData.value) {
    // 根据图标类型设置不同的格式
    if (selection.type === 'element') {
      formData.value.icon = selection.name
    } else if (selection.type === 'iconify') {
      formData.value.icon = `iconify:${selection.name}`
    } else if (selection.type === 'custom') {
      formData.value.icon = `custom:${selection.name}`
    }
  }
}
// ------------------------- 图标选择器 结束 -------------------------

// ------------------------- 导入导出配置 开始 -------------------------
// 导入配置弹窗
const showImportDialog = ref(false)
const importJsonText = ref('')

// 导出配置到剪贴板
const handleExportConfig = async () => {
  if (!formData.value) {
    ElMessage.warning('请先选择或创建一个菜单')
    return
  }

  try {
    // 排除关键字段：id, parentId, idPath, children, _id
    const { id, parentId, idPath, children, ...exportFields } = formData.value
    
    // 处理数组字段，移除内部的 _id
    const exportData = {
      ...exportFields,
      columnFieldList: removeIdFromList(exportFields.columnFieldList || []),
      formFieldList: removeIdFromList(exportFields.formFieldList || []),
      searchFieldList: removeIdFromList(exportFields.searchFieldList || []),
    }

    // 复制到剪贴板
    if (navigator.clipboard) {
      const jsonString = JSON.stringify(exportData, null, 2)
      await navigator.clipboard.writeText(jsonString);
      ElMessage.success('配置已复制到剪贴板')
    } else {
      console.log(`导出菜单配置(${formData.value.menuName}):\n`, JSON.stringify(exportData));
      ElMessage.warning('复制到剪贴板失败, 已打印到浏览器控制台, 请按F12打开浏览器控制台手动复制');
    }

  } catch (error: any) {
    ElMessage.error(error.message || '导出配置失败')
    console.error('导出配置失败:', error)
  }
}

// 导入配置
const handleImportConfig = () => {
  if (!formData.value) {
    ElMessage.warning('请先选择或创建一个菜单')
    return
  }
  importJsonText.value = ''
  showImportDialog.value = true
}

// 确认导入
const confirmImport = () => {
  if (!importJsonText.value.trim()) {
    ElMessage.warning('请输入配置JSON')
    return
  }

  try {
    const importData = JSON.parse(importJsonText.value)

    // 排除关键字段：id, parentId, idPath, children
    const { id, parentId, idPath, children, ...importFields } = importData

    // 处理数组字段，添加 _id 用于拖拽排序
    const processedFields = {
      ...importFields,
      columnFieldList: addIdToList(importFields.columnFieldList || []),
      formFieldList: addIdToList(importFields.formFieldList || []),
      searchFieldList: addIdToList(importFields.searchFieldList || []),
    }

    // 应用导入的数据到表单（保留 id、parentId 等关键字段）
    if (formData.value) {
      formData.value = {
        id: formData.value.id,              // 保留原有 id
        parentId: formData.value.parentId,  // 保留原有 parentId
        ...processedFields                  // 应用导入的所有其他字段
      }
    }

    showImportDialog.value = false
    ElMessage.success('配置导入成功')
  } catch (error: any) {
    ElMessage.error('JSON格式错误，请检查输入')
    console.error('导入配置失败:', error)
  }
}
// ------------------------- 导入导出配置 结束 -------------------------

// 辅助函数：移除数组中每个对象的 _id 字段
const removeIdFromList = (list: any[]) => {
  if (!Array.isArray(list)) return list
  return list.map((item: any) => {
    const { _id, ...rest } = item
    return rest
  })
}

// 辅助函数：为数组中每个对象添加唯一ID
const addIdToList = (list: any[]) => {
  if (!Array.isArray(list)) return []
  return list.map((item: any) => ({
    ...item,
    _id: Date.now() + Math.random()
  }))
}

// 加载菜单树数据
const loadAllMenuTree = async () => {
  menuTree.value = await menuApi.getAllMenuTree()
}

// 父级菜单选项（用于树形选择器）
const parentMenuOptions = computed(() => {
  // 排除当前菜单及其子菜单，避免循环引用
  const excludeCodes = currentMenu.value ? [currentMenu.value.id] : []
  const filterMenus = (menus: MenuItem[]): MenuItem[] => {
    return menus
      .filter(menu => !excludeCodes.includes(menu.id))
      .map(menu => ({
        ...menu,
        children: menu.children ? filterMenus(menu.children) : undefined,
      }))
  }
  return filterMenus(menuTree.value)
})


// 表单数据
const formData = ref<any>(null)

// 初始化表单数据
const initFormData = (menu?: MenuItem) => {
  if (menu) {
    formData.value = {
      id: menu.id,
      parentId: menu.parentId,
      menuName: menu.menuName,
      menuType: menu.menuType,
      icon: menu.icon || '',
      sort: menu.sort,
      routePath: menu.routePath || '',
      pageType: menu.pageType || '',
      apiUrl: menu.apiUrl || '',
      extApiUrl: menu.extApiUrl || '',
      extra: menu.extra || '',
      customComponent: menu.customComponent || '',
      buttonPosition: menu.buttonPosition || ButtonPosition.FOOTER,
      buttonAction: menu.buttonAction || ButtonActionType.MODAL_FORM,
      beforeShowScript: menu.beforeShowScript || '',
      beforeSubmitScript: menu.beforeSubmitScript || '',
      searchFieldList: addIdToList(menu.searchFieldList || []),
      columnFieldList: addIdToList(menu.columnFieldList || []),
      formFieldList: addIdToList(menu.formFieldList || []),
    }
  } else {
    const maxSort = Math.max(...menuTree.value.map(item => item.sort));
    // 新增模式：使用默认值
    formData.value = {
      parentId: 0,                // 默认顶层菜单
      menuType: MenuType.MODULE,  // 默认是模块
      sort: maxSort + 1,
      searchFieldList: [],
      columnFieldList: [],
      formFieldList: [],
    }
  }
}

// 表单验证规则
const formRules: FormRules = {
  parentId: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
  menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  menuType: [{ required: true, message: '请选择菜单类型', trigger: 'change' }],
  pageType: [{ required: true, message: '请选择页面类型', trigger: 'change' }],
  routePath: [
    {
      required: true,
      message: '请输入路由路径',
      trigger: 'blur',
      validator: (_rule, value, callback) => {
        if (formData.value?.menuType === MenuType.PAGE && !value) {
          callback(new Error('页面类型必须填写路由路径'))
        } else {
          callback()
        }
      },
    },
  ],
  buttonPosition: [
    {
      required: true,
      message: '请选择按钮位置',
      trigger: 'change',
      validator: (_rule, value, callback) => {
        if (formData.value?.menuType === MenuType.BUTTON && !value) {
          callback(new Error('按钮类型必须选择按钮位置'))
        } else {
          callback()
        }
      },
    },
  ],
  buttonAction: [
    {
      required: true,
      message: '请选择操作类型',
      trigger: 'change',
      validator: (_rule, value, callback) => {
        if (formData.value?.menuType === MenuType.BUTTON && !value) {
          callback(new Error('按钮类型必须选择操作类型'))
        } else {
          callback()
        }
      },
    },
  ],
}

// 处理节点点击
const handleNodeClick = (data: MenuItem) => {
  currentMenu.value = data
  initFormData(data)
  // 设置树节点为选中状态
  treeRef.value?.setCurrentKey(data.id)
}

// 处理新增根节点
const handleAddRoot = () => {
  currentMenu.value = null
  initFormData()
}

// 处理新增子节点
const handleAddChild = (parent: MenuItem) => {
  currentMenu.value = null
  initFormData()
  if (formData.value) {
    formData.value.parentId = parent.id
    // 序号自动+1
    formData.value.sort = parent.children && parent.children.length > 0 ? Math.max(...parent.children.map(item => item.sort)) + 1 : 1;
    // 根据父节点类型设置子节点类型
    if (parent.menuType === MenuType.MODULE) {
      formData.value.menuType = MenuType.DIRECTORY
    } else if (parent.menuType === MenuType.DIRECTORY) {
      formData.value.menuType = MenuType.PAGE
    } else if (parent.menuType === MenuType.PAGE) {
      formData.value.menuType = MenuType.BUTTON
    } else if (parent.menuType === MenuType.BUTTON) {
      formData.value.menuType = MenuType.BUTTON
    }
  }
}

// 处理删除
const handleDelete = async (menu: MenuItem) => {
  try {
    await ElMessageBox.confirm(`确定要删除菜单"${menu.menuName}"吗？`, '提示', {type: 'warning'})
    await menuApi.deleteMenu(menu.id)
    ElMessage.success('删除成功')
    // 重新加载菜单
    await loadAllMenuTree()
    await menuStore.loadMenus()
    // 清空表单
    currentMenu.value = null
    formData.value = null
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '删除失败')
    }
  }
}

// 处理类型变化
const handleTypeChange = () => {
  // 类型变化时，重置相关字段
  if (formData.value) {
    if (formData.value.menuType !== MenuType.PAGE) {
      formData.value.routePath = ''
      formData.value.pageType = ''
      formData.value.columnFieldList = []
      formData.value.searchFieldList = []
    }
    if (formData.value.menuType !== MenuType.BUTTON) {
      formData.value.buttonPosition = ''
      formData.value.buttonAction = ''
      formData.value.beforeShowScript = ''
      formData.value.beforeSubmitScript = ''
      formData.value.formFieldList = []
    }
  }
}

// 处理页面类型变化
const handlePageTypeChange = () => {
  if (formData.value) {
    if (formData.value.pageType !== PageType.LIST) {
      formData.value.columnFieldList = []
      formData.value.searchFieldList = []
    }
  }
}

// 处理操作类型变化
const handleActionTypeChange = () => {
  // 操作类型变化时，重置相关字段
}


// 处理提交
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (valid && formData.value) {
      try {
        submitLoading.value = true
        // 构建菜单数据
        const menuData: any = {
          id: formData.value.id,
          parentId: formData.value.parentId,
          menuName: formData.value.menuName,
          menuType: formData.value.menuType,
          icon: formData.value.icon || null,
          sort: formData.value.sort,
          routePath: formData.value.routePath || null,
          pageType: formData.value.pageType || null,
          apiUrl: formData.value.apiUrl || null,
          extApiUrl: formData.value.extApiUrl || null,
          extra: formData.value.extra || null,
          customComponent: formData.value.customComponent || null,
          buttonPosition: formData.value.buttonPosition || null,
          buttonAction: formData.value.buttonAction || null,
          beforeShowScript: formData.value.beforeShowScript || null,
          beforeSubmitScript: formData.value.beforeSubmitScript || null,
          columnFieldList: removeIdFromList(formData.value.columnFieldList),
          formFieldList: removeIdFromList(formData.value.formFieldList),
          searchFieldList: removeIdFromList(formData.value.searchFieldList),
        }

        const savedMenu = currentMenu.value ? await menuApi.updateMenu(menuData) : await menuApi.createMenu(menuData);
        ElMessage.success('保存成功')
        // 重新加载菜单
        await loadAllMenuTree()
        await menuStore.loadMenus()

        // 如果是新增，选中新创建的节点
        if (!currentMenu.value && savedMenu) {
          // 从树数据中查找新节点
          const findNode = (nodes: MenuItem[]): MenuItem | null => {
            for (const node of nodes) {
              if (node.id === savedMenu.id) return node
              if (node.children) {
                const found = findNode(node.children)
                if (found) return found
              }
            }
            return null
          }
          const newNode = findNode(menuTree.value)
          if (newNode) {
            handleNodeClick(newNode)
          }
        }
      } catch (error: any) {
        ElMessage.error(error.message || '保存失败')
      } finally {
        submitLoading.value = false
      }
    }
  })
}

// 处理重置
const handleReset = () => {
  if (currentMenu.value) {
    initFormData(currentMenu.value)
  } else {
    initFormData()
  }
}

// 初始化：加载菜单数据
onMounted(async () => {
  await loadAllMenuTree()
})
</script>

<style scoped lang="scss">
.menu-manage-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .menu-manage-row {
    flex: 1;
    min-height: 0;
    height: 100%;
    display: flex;
    overflow: hidden;

    .menu-tree-col,
    .menu-form-col {
      height: 100%;
      display: flex;
      flex-direction: column;
      min-height: 0;
      overflow: hidden;

      .menu-tree-card,
      .menu-form-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;

        :deep(.el-card__header) {
          flex-shrink: 0;
        }

        :deep(.el-card__body) {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          min-height: 0;
          padding-bottom: 0;
        }
      }
    }

    // 左侧菜单树隐藏滚动条但保留滚动功能
    .menu-tree-col {
      .menu-tree-card {
        :deep(.el-card__body) {
          padding: 20px 10px 0px 10px;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */

          &::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
          }
        }
      }
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .tree-node {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex: 1;
    padding-right: 8px;

    .node-label {
      display: flex;
      align-items: center;
      gap: 4px;

      .node-icon {
        font-size: 14px;
      }
    }

    .node-actions {
      display: none;
      align-items: center;
    }

    &:hover .node-actions {
      display: flex;
    }
  }

  .menu-form {
    .el-divider {
      margin: 20px 0;
    }

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

    /* 表单内容很长、在 el-card__body 内部滚动时，让底部按钮始终可见 */
    .menu-form-actions {
      position: sticky;
      bottom: 0;
      z-index: 10;
      padding: 12px 0;

      /* 覆盖滚动内容，避免按钮贴底时和内容视觉混在一起 */
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(6px);
      border-top: 1px solid #ebeef5;
    }
  }
}
</style>

