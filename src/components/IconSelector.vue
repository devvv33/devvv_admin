<template>
  <el-dialog
    v-model="visible"
    title="选择图标"
    width="900px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="icon-selector">
      <!-- 图标库切换 -->
      <div class="icon-tabs">
        <el-tabs v-model="activeTab" @tab-change="handleTabChange">
          <el-tab-pane label="Element Plus" name="element">
            <template #label>
              <span><el-icon><Grid /></el-icon> Element Plus</span>
            </template>
          </el-tab-pane>
          <el-tab-pane label="Iconify" name="iconify">
            <template #label>
              <span><el-icon><Search /></el-icon> Iconify (在线搜索)</span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- Element Plus 图标 -->
      <div v-show="activeTab === 'element'" class="icon-content">
        <el-input
          v-model="elementSearchText"
          placeholder="搜索 Element Plus 图标"
          clearable
          class="search-input"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <div class="icon-list">
          <div
            v-for="iconName in filteredElementIcons"
            :key="iconName"
            class="icon-item"
            :class="{ active: isIconSelected('element', iconName) }"
            @click="selectIcon('element', iconName)"
          >
            <el-icon style="font-size: 24px">
              <component :is="iconName" />
            </el-icon>
            <span class="icon-name">{{ iconName }}</span>
          </div>
        </div>
      </div>

      <!-- Iconify 图标 -->
      <div v-show="activeTab === 'iconify'" class="icon-content">
        <div class="iconify-search">
          <el-input
            v-model="iconifySearchText"
            placeholder="搜索图标（例如：home, user, settings）"
            clearable
            class="search-input"
            @keyup.enter="searchIconify"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
            <template #append>
              <el-button :loading="iconifyLoading" @click="searchIconify">搜索</el-button>
            </template>
          </el-input>
          
          <!-- 图标集选择 -->
          <div class="icon-collections">
            <span class="label">常用图标集：</span>
            <el-tag
              v-for="collection in popularCollections"
              :key="collection.id"
              :type="selectedCollection === collection.id ? 'primary' : 'info'"
              class="collection-tag"
              @click="selectCollection(collection.id)"
            >
              {{ collection.name }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <div v-loading="iconifyLoading" class="icon-list">
          <el-empty v-if="iconifyIcons.length === 0 && !iconifyLoading" description="搜索图标或选择图标集" />
          <div
            v-for="icon in iconifyIcons"
            :key="icon"
            class="icon-item"
            :class="{ active: isIconSelected('iconify', icon) }"
            @click="selectIcon('iconify', icon)"
          >
            <Icon :icon="icon" width="24" height="24" />
            <span class="icon-name">{{ icon }}</span>
          </div>
        </div>
      </div>

    </div>

    <template #footer>
      <div class="dialog-footer">
        <div class="selected-info">
          <span v-if="currentSelection.type">
            已选择：<el-tag>{{ currentSelection.type }} - {{ currentSelection.name }}</el-tag>
          </span>
        </div>
        <div>
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="confirmSelection">确定</el-button>
        </div>
      </div>
    </template>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { Search, Grid } from '@element-plus/icons-vue'

interface IconSelection {
  type: 'element' | 'iconify' | ''
  name: string
  content?: string  // 用于自定义图标
}

const props = defineProps<{
  modelValue: boolean
  currentIcon?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'select': [selection: IconSelection]
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 当前标签页
const activeTab = ref<'element' | 'iconify'>('element')

// Element Plus 图标
const elementSearchText = ref('')
const allElementIcons = computed(() => Object.keys(ElementPlusIconsVue).sort())
const filteredElementIcons = computed(() => {
  if (!elementSearchText.value) return allElementIcons.value
  const search = elementSearchText.value.toLowerCase()
  return allElementIcons.value.filter(icon => icon.toLowerCase().includes(search))
})

// Iconify 图标
const iconifySearchText = ref('')
const iconifyLoading = ref(false)
const iconifyIcons = ref<string[]>([])
const selectedCollection = ref('')

// 常用图标集
const popularCollections = [
  { id: 'mdi', name: 'Material Design' },
  { id: 'fa', name: 'Font Awesome' },
  { id: 'bi', name: 'Bootstrap Icons' },
  { id: 'ant-design', name: 'Ant Design' },
  { id: 'lucide', name: '简笔画' },
  { id: 'logos', name: 'logos' },
  { id: 'simple-icons', name: 'simple-icons' },
  { id: 'ph', name: 'ph' },
  { id: 'tabler', name: 'tabler' },
]

// 当前选择
const currentSelection = ref<IconSelection>({
  type: '',
  name: ''
})


// 选择图标集
const selectCollection = async (collectionId: string) => {
  selectedCollection.value = collectionId
  iconifyLoading.value = true
  try {
    // 使用 Iconify API 获取图标集中的图标
    const response = await fetch(`https://api.iconify.design/collection?prefix=${collectionId}`)
    const data = await response.json()
    
    if (data.uncategorized) {
      // 只显示前100个图标，避免加载过多
      iconifyIcons.value = data.uncategorized.slice(0, 1000).map((icon: string) => `${collectionId}:${icon}`)
    }
  } catch (error) {
    ElMessage.error('加载图标集失败')
    console.error(error)
  } finally {
    iconifyLoading.value = false
  }
}

// 搜索 Iconify 图标
const searchIconify = async () => {
  if (!iconifySearchText.value.trim()) {
    ElMessage.warning('请输入搜索关键词')
    return
  }

  iconifyLoading.value = true
  try {
    // 使用 Iconify API 搜索图标
    const response = await fetch(`https://api.iconify.design/search?query=${encodeURIComponent(iconifySearchText.value)}&limit=500`)
    const data = await response.json()
    
    if (data.icons && data.icons.length > 0) {
      iconifyIcons.value = data.icons
      ElMessage.success(`找到 ${data.icons.length} 个图标`)
    } else {
      iconifyIcons.value = []
      ElMessage.info('未找到相关图标')
    }
  } catch (error) {
    ElMessage.error('搜索失败，请检查网络连接')
    console.error(error)
  } finally {
    iconifyLoading.value = false
  }
}

// 选择图标
const selectIcon = (type: 'element' | 'iconify' , name: string, content?: string) => {
  currentSelection.value = { type, name, content }
}

// 判断图标是否被选中
const isIconSelected = (type: string, name: string) => {
  return currentSelection.value.type === type && currentSelection.value.name === name
}

// 确认选择
const confirmSelection = () => {
  if (!currentSelection.value.type) {
    ElMessage.warning('请选择一个图标')
    return
  }
  emit('select', currentSelection.value)
  visible.value = false
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
}

// 切换标签页
const handleTabChange = () => {
  // 可以在这里添加切换标签页时的逻辑
}


// 初始化
watch(visible, (val) => {
  if (val) {

    // 如果有传入当前图标，尝试识别并选中
    if (props.currentIcon) {
      if (allElementIcons.value.includes(props.currentIcon)) {
        activeTab.value = 'element'
        currentSelection.value = { type: 'element', name: props.currentIcon }
      } else if (props.currentIcon.includes(':')) {
        activeTab.value = 'iconify'
        currentSelection.value = { type: 'iconify', name: props.currentIcon }
      }
    }
  }
})
</script>

<style scoped lang="scss">
.icon-selector {
  .icon-tabs {
    :deep(.el-tabs__item) {
      font-size: 14px;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }

  .icon-content {
    .search-input {
      margin-bottom: 16px;
    }

    .iconify-search {
      .icon-collections {
        margin-top: 12px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;

        .label {
          font-size: 14px;
          color: #606266;
          margin-right: 8px;
        }

        .collection-tag {
          cursor: pointer;
          transition: all 0.3s;

          &:hover {
            transform: translateY(-2px);
          }
        }
      }
    }


    .icon-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
      gap: 10px;
      max-height: 450px;
      overflow-y: auto;
      padding: 10px;
      border: 1px solid #e4e7ed;
      border-radius: 4px;

      .icon-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 15px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
        background: #fff;

        .icon-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
        }

        .delete-btn {
          position: absolute;
          top: 2px;
          right: 2px;
          opacity: 0;
          transition: opacity 0.3s;
        }

        &:hover {
          border-color: #409eff;
          background: #ecf5ff;
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);

          .delete-btn {
            opacity: 1;
          }
        }

        &.active {
          border-color: #409eff;
          background: #ecf5ff;
          color: #409eff;
          box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.3);
        }

        .icon-name {
          margin-top: 8px;
          font-size: 11px;
          text-align: center;
          word-break: break-all;
          color: #606266;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        &.active .icon-name {
          color: #409eff;
          font-weight: 500;
        }
      }
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .selected-info {
    font-size: 14px;
    color: #606266;
  }
}
</style>

