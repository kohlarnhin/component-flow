<template>
  <div class="bg-white rounded-lg shadow-xl w-full overflow-hidden flex flex-col">
    <!-- 头部 -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-900">页面管理</h2>
      <div class="flex items-center space-x-3">
        <span class="text-sm text-gray-500">共 {{ pagesStore.pagesCount }} 个页面</span>
      </div>
    </div>

    <!-- 内容 -->
    <div class="flex-1 overflow-hidden">
      <!-- 页面列表 -->
      <div v-if="!selectedPage" class="h-full overflow-y-auto p-6">
        <!-- 空状态 -->
        <div v-if="pagesStore.pagesCount === 0" class="text-center text-gray-500 py-12">
          <div class="text-4xl mb-4">📄</div>
          <p class="text-lg font-medium mb-2">还没有保存的页面</p>
          <p class="text-sm">在画布中创建组件并预览后，可以保存为页面</p>
        </div>

        <!-- 页面网格 -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="page in pagesStore.savedPages"
            :key="page.id"
            class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
            @click="viewPage(page)"
          >
            <!-- 页面信息 -->
            <div class="mb-3">
              <h3 class="font-medium text-gray-900 mb-1 truncate">{{ page.name }}</h3>
              <p v-if="page.description" class="text-sm text-gray-600 line-clamp-2">{{ page.description }}</p>
            </div>

            <!-- 页面统计 -->
            <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
              <span>{{ page.components.length }} 个组件</span>
              <span>{{ formatDate(page.updatedAt) }}</span>
            </div>

            <!-- 组件预览 -->
            <div class="mb-3">
              <div class="text-xs text-gray-500 mb-1">组件：</div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="component in page.components.slice(0, 6)"
                  :key="component.id"
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                >
                  <ComponentIcon :type="component.config.type" class="w-3 h-3 mr-1" />
                  {{ getComponentTypeName(component.config.type) }}
                </span>
                <span
                  v-if="page.components.length > 6"
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-500"
                >
                  +{{ page.components.length - 6 }}
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center justify-between">
              <button
                @click.stop="accessPage(page)"
                class="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                访问页面
              </button>
              <div class="flex items-center space-x-2">
                <button
                  @click.stop="duplicatePage(page)"
                  class="text-sm text-gray-600 hover:text-gray-700"
                  title="复制页面"
                >
                  📋
                </button>
                <button
                  @click.stop="deletePage(page)"
                  class="text-sm text-red-600 hover:text-red-700"
                  title="删除页面"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 页面详情查看 -->
      <div v-else class="h-full flex flex-col">
        <!-- 详情头部 -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <button
              @click="selectedPage = null"
              class="text-gray-400 hover:text-gray-600"
            >
              ← 返回列表
            </button>
            <h3 class="text-lg font-medium text-gray-900">{{ selectedPage.name }}</h3>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="accessPage(selectedPage)"
              class="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
            >
              访问页面
            </button>
            <button
              @click="copyPageUrl(selectedPage)"
              class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
            >
              复制链接
            </button>
          </div>
        </div>

        <!-- 详情内容 -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="max-w-4xl mx-auto">
            <!-- 页面信息 -->
            <div class="mb-6">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">创建时间：</span>
                  <span class="text-gray-900">{{ formatDateTime(selectedPage.createdAt) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">更新时间：</span>
                  <span class="text-gray-900">{{ formatDateTime(selectedPage.updatedAt) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">组件数量：</span>
                  <span class="text-gray-900">{{ selectedPage.components.length }} 个</span>
                </div>
                <div>
                  <span class="text-gray-500">页面链接：</span>
                  <span class="text-blue-600 font-mono text-xs">/page/{{ selectedPage.id }}</span>
                </div>
              </div>
              <div v-if="selectedPage.description" class="mt-4">
                <span class="text-gray-500 text-sm">描述：</span>
                <p class="text-gray-900 mt-1">{{ selectedPage.description }}</p>
              </div>
            </div>

            <!-- 组件列表 -->
            <div class="mb-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">页面组件</h4>
              <div class="space-y-3">
                <div
                  v-for="(component, index) in selectedPage.components"
                  :key="component.id"
                  class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                      <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ComponentIcon :type="component.config.type" class="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <div class="font-medium text-gray-900">{{ component.config.label }}</div>
                        <div class="text-sm text-gray-500">{{ getComponentTypeName(component.config.type) }}</div>
                      </div>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-sm text-gray-500">顺序: {{ index + 1 }}</span>
                      <button
                        @click="editComponent(component)"
                        class="px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      >
                        编辑
                      </button>
                    </div>
                  </div>
                  
                  <!-- 组件配置摘要 -->
                  <div class="mt-3 text-xs text-gray-500 space-y-1">
                    <div v-if="component.config.placeholder">
                      占位符: {{ component.config.placeholder }}
                    </div>
                    <div v-if="'text' in component.config && component.config.text">
                      按钮文本: {{ component.config.text }}
                    </div>
                    <div v-if="'requestUrl' in component.config && component.config.requestUrl">
                      请求地址: {{ component.config.requestUrl }}
                    </div>
                    <div v-if="'apiUrl' in component.config && component.config.apiUrl">
                      API地址: {{ component.config.apiUrl }}
                    </div>
                    <div v-if="component.config.required">
                      <span class="text-red-500">必填项</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 组件编辑对话框 -->
  <ComponentEditDialog
    :visible="showEditDialog"
    :component="editingComponent"
    @close="closeEditDialog"
    @save="handleSaveComponent"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePagesStore } from '@/stores/pages.store'
import { useNotificationStore } from '@/stores/notification.store'
import ComponentIcon from '@/components/ComponentIcon.vue'
import ComponentEditDialog from '@/components/ComponentEditDialog.vue'
import { getComponentTypeName } from '@/utils/componentMetadata'
import type { SavedPage, CanvasComponent, ComponentConfig } from '@/types/global.types'

// 状态管理
const pagesStore = usePagesStore()
const notificationStore = useNotificationStore()

// 选中的页面
const selectedPage = ref<SavedPage | null>(null)

// 组件编辑对话框状态
const showEditDialog = ref(false)
const editingComponent = ref<CanvasComponent | null>(null)

// 查看页面详情
function viewPage(page: SavedPage) {
  selectedPage.value = page
}

// 访问页面
function accessPage(page: SavedPage) {
  // 直接跳转到页面访问路由
  const pageUrl = `/page/${page.id}`
  window.open(pageUrl, '_blank')
}

// 复制页面链接
async function copyPageUrl(page: SavedPage) {
  try {
    const pageUrl = `${window.location.origin}/page/${page.id}`
    await navigator.clipboard.writeText(pageUrl)
    notificationStore.success('页面链接已复制到剪贴板')
  } catch (error) {
    notificationStore.error('复制失败', '请手动复制页面链接')
  }
}

// 复制页面
async function duplicatePage(page: SavedPage) {
  try {
    const newPageId = await pagesStore.duplicatePage(page.id)
    if (newPageId) {
      notificationStore.success('页面复制成功')
    }
  } catch (error) {
    notificationStore.error('页面复制失败', '请重试')
  }
}

// 删除页面
async function deletePage(page: SavedPage) {
  if (confirm(`确定要删除页面"${page.name}"吗？此操作不可撤销。`)) {
    try {
      await pagesStore.deletePage(page.id)
      if (selectedPage.value?.id === page.id) {
        selectedPage.value = null
      }
      notificationStore.success('页面已删除')
    } catch (error) {
      notificationStore.error('删除页面失败', '请重试')
    }
  }
}

// 编辑组件
function editComponent(component: CanvasComponent) {
  editingComponent.value = component
  showEditDialog.value = true
}

// 关闭编辑对话框
function closeEditDialog() {
  showEditDialog.value = false
  editingComponent.value = null
}

// 保存组件修改
async function handleSaveComponent(component: CanvasComponent, newConfig: ComponentConfig) {
  if (!selectedPage.value) {
    notificationStore.error('保存失败', '没有选中的页面')
    return
  }

  try {
    await pagesStore.updatePageComponent(selectedPage.value.id, component.id, newConfig)
    
    // 更新本地显示的页面数据
    const updatedPage = await pagesStore.getPage(selectedPage.value.id)
    if (updatedPage) {
      selectedPage.value = updatedPage
    }
    
    notificationStore.success('组件已更新', '组件配置保存成功')
    closeEditDialog()
  } catch (error) {
    console.error('保存组件配置失败:', error)
    notificationStore.error('保存失败', '无法保存组件配置，请重试')
  }
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

// 格式化日期时间
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 初始化页面数据
pagesStore.initializePages()
</script> 