<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 max-h-[85vh] overflow-hidden flex flex-col">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">我的页面</h2>
        <div class="flex items-center space-x-3">
          <span class="text-sm text-gray-500">共 {{ pagesStore.pagesCount }} 个页面</span>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
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
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                    {{ getComponentIcon(component.config.type) }}
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
                  @click.stop="loadPageToCanvas(page)"
                  class="text-sm text-blue-600 hover:text-blue-700"
                >
                  加载到画布
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
                @click="loadPageToCanvas(selectedPage)"
                class="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
              >
                加载到画布
              </button>
              <button
                @click="previewPage(selectedPage)"
                class="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              >
                预览页面
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
                    <span class="text-gray-500">页面ID：</span>
                    <span class="text-gray-900 font-mono text-xs">{{ selectedPage.id }}</span>
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
                    class="border border-gray-200 rounded-lg p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center space-x-3">
                        <span class="text-lg">{{ getComponentIcon(component.config.type) }}</span>
                        <div>
                          <div class="font-medium text-gray-900">{{ component.config.label }}</div>
                          <div class="text-sm text-gray-500">{{ getComponentTypeName(component.config.type) }}</div>
                        </div>
                      </div>
                      <div class="text-sm text-gray-500">
                        顺序: {{ index + 1 }}
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { usePagesStore } from '@/stores/pages.store'
import { useCanvasStore } from '@/stores/canvas.store'
import { usePreviewStore } from '@/stores/preview.store'
import type { SavedPage, ComponentType } from '@/types/global.types'

// 事件定义
interface Emits {
  close: []
}

defineEmits<Emits>()

// 状态管理
const pagesStore = usePagesStore()
const canvasStore = useCanvasStore()
const previewStore = usePreviewStore()

// 选中的页面
const selectedPage = ref<SavedPage | null>(null)

// 查看页面详情
function viewPage(page: SavedPage) {
  selectedPage.value = page
}

// 加载页面到画布
function loadPageToCanvas(page: SavedPage) {
  if (confirm(`确定要加载页面"${page.name}"到画布吗？当前画布内容将被替换。`)) {
    canvasStore.loadComponents(page.components)
    alert('页面已加载到画布！')
  }
}

// 预览页面
function previewPage(page: SavedPage) {
  // 保存当前画布状态
  const originalComponents = [...canvasStore.components]
  
  // 临时加载页面到画布
  canvasStore.loadComponents(page.components)
  
  // 打开预览
  previewStore.openPreview()
  
  // 监听预览关闭事件，恢复原来的画布内容
  const unwatch = watch(() => previewStore.isPreviewVisible, (isVisible) => {
    if (!isVisible) {
      // 预览关闭时恢复原来的画布内容
      canvasStore.loadComponents(originalComponents)
      unwatch() // 取消监听
    }
  })
}

// 复制页面
function duplicatePage(page: SavedPage) {
  const newPageId = pagesStore.duplicatePage(page.id)
  if (newPageId) {
    alert('页面复制成功！')
  } else {
    alert('页面复制失败！')
  }
}

// 删除页面
function deletePage(page: SavedPage) {
  if (confirm(`确定要删除页面"${page.name}"吗？此操作不可撤销。`)) {
    pagesStore.deletePage(page.id)
    if (selectedPage.value?.id === page.id) {
      selectedPage.value = null
    }
    alert('页面已删除！')
  }
}

// 获取组件图标
function getComponentIcon(type: ComponentType): string {
  const iconMap: Record<ComponentType, string> = {
    'text-input': '📝',
    'password-input': '🔒',
    'textarea': '📄',
    'button': '🔘',
    'data-list': '📊',
    'response-display': '📺'
  }
  return iconMap[type] || '❓'
}

// 获取组件类型名称
function getComponentTypeName(type: ComponentType): string {
  const nameMap: Record<ComponentType, string> = {
    'text-input': '文本输入',
    'password-input': '密码输入',
    'textarea': '文本域',
    'button': '按钮',
    'data-list': '数据列表',
    'response-display': '响应展示'
  }
  return nameMap[type] || '未知组件'
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return '今天'
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString()
  }
}

// 格式化日期时间
function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString()
}
</script> 