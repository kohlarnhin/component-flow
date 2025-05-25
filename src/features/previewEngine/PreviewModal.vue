<template>
  <div 
    v-if="previewStore.isPreviewVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-7xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
      <!-- 现代化头部 -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">页面预览</h2>
              <p class="text-sm text-gray-500">预览保存的页面效果</p>
            </div>
          </div>
          <div class="flex items-center space-x-3">
            <!-- 画布预览模式的按钮 -->
            <template v-if="isCanvasPreview">
              <button
                v-if="currentPage && currentPage.components.length > 0"
                @click="showSaveDialog = true"
                class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span>保存页面</span>
              </button>
              <button
                v-if="savedPageId"
                @click="openSavedPageInNewTab"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span>在新标签页打开</span>
              </button>
            </template>
            
            <!-- 页面预览模式的按钮 -->
            <template v-else>
              <button
                v-if="currentPageId"
                @click="discardPage"
                class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>废弃页面</span>
              </button>
              <button
                v-if="currentPageId"
                @click="openInNewTab"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
                <span>在新标签页打开</span>
              </button>
            </template>
            
            <!-- 关闭按钮 -->
            <button
              @click="closePreview"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <div class="flex-1 overflow-hidden">
        <!-- 页面内容预览 -->
        <div class="h-full overflow-y-auto bg-gray-50">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="text-center">
              <div class="inline-flex items-center space-x-2 text-gray-500">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>加载页面中...</span>
              </div>
            </div>
          </div>
          
          <div v-else-if="!currentPage" class="flex items-center justify-center h-full">
            <div class="text-center text-gray-500">
              <div class="text-6xl mb-4">😕</div>
              <h3 class="text-lg font-semibold mb-2">页面未找到</h3>
              <p class="text-sm">无法加载预览页面</p>
            </div>
          </div>
          
          <!-- 页面内容渲染 -->
          <div v-else class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- 页面信息 -->
            <div v-if="currentPage.description" class="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h2 class="text-lg font-medium text-gray-900 mb-2">页面说明</h2>
              <p class="text-gray-700">{{ currentPage.description }}</p>
            </div>

            <!-- 组件渲染区域 -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div
                v-for="component in currentPage.components"
                :key="component.id"
                :class="getComponentLayoutClass(component.config.type)"
              >
                <PageRenderer :component="component" />
              </div>
            </div>

            <!-- 页面信息 -->
            <div class="bg-white rounded-lg border border-gray-200 p-6">
              <h3 class="text-lg font-medium text-gray-900 mb-4">页面信息</h3>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span class="text-gray-500">组件数量：</span>
                  <span class="text-gray-900 font-medium">{{ currentPage.components.length }}</span>
                </div>
                <div>
                  <span class="text-gray-500">创建时间：</span>
                  <span class="text-gray-900">{{ formatDate(currentPage.createdAt) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">更新时间：</span>
                  <span class="text-gray-900">{{ formatDate(currentPage.updatedAt) }}</span>
                </div>
                <div>
                  <span class="text-gray-500">页面ID：</span>
                  <span class="text-gray-900 font-mono text-xs">{{ currentPage.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 保存页面对话框 -->
  <SavePageDialog
    :visible="showSaveDialog"
    @close="showSaveDialog = false"
    @save="saveCanvasAsPage"
    @open-in-new-tab="openSavedPageInNewTab"
  />
</template>

<script setup lang="ts">
import { ref, computed, provide, watch } from 'vue'
import { usePreviewStore } from '@/stores/preview.store'
import { usePagesStore } from '@/stores/pages.store'
import { useCanvasStore } from '@/stores/canvas.store'
import { useNotificationStore } from '@/stores/notification.store'
import PageRenderer from '@/components/PageRenderer.vue'
import SavePageDialog from '@/components/SavePageDialog.vue'
import type { SavedPage } from '@/types/global.types'

// 状态管理
const previewStore = usePreviewStore()
const pagesStore = usePagesStore()
const canvasStore = useCanvasStore()
const notificationStore = useNotificationStore()

// 本地状态
const loading = ref(false)
const currentPage = ref<SavedPage | null>(null)
const currentPageId = ref<string | null>(null)
const showSaveDialog = ref(false)
const savedPageId = ref<string | null>(null)

// 提供页面组件列表给子组件使用
const pageComponents = computed(() => currentPage.value?.components || [])
provide('pageComponents', pageComponents)

// 监听预览状态变化
watch(() => previewStore.isPreviewVisible, (visible) => {
  if (!visible) {
    // 预览关闭时清理状态
    currentPage.value = null
    currentPageId.value = null
    showSaveDialog.value = false
    savedPageId.value = null
  }
})

// 预览模式判断
const isCanvasPreview = computed(() => !currentPageId.value)
const isPagePreview = computed(() => !!currentPageId.value)

// 打开预览（由外部调用）
async function openPreview(pageId?: string) {
  currentPageId.value = pageId || null
  previewStore.openPreview()
  
  if (pageId) {
    // 预览已保存页面
    await loadPage(pageId)
  } else {
    // 预览当前画布内容
    await loadCanvasContent()
  }
}

// 加载画布内容
async function loadCanvasContent() {
  loading.value = true
  
  try {
    // 从画布获取当前组件
    const canvasComponents = canvasStore.components
    
    if (canvasComponents.length > 0) {
      // 创建临时页面对象用于预览
      currentPage.value = {
        id: 'canvas-preview',
        name: '画布预览',
        description: '当前画布内容的预览',
        components: [...canvasComponents],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      console.log('🔧 画布预览加载成功，组件数量:', canvasComponents.length)
    } else {
      currentPage.value = null
      console.log('🔧 画布为空，无内容可预览')
    }
  } catch (error) {
    console.error('加载画布内容失败:', error)
    notificationStore.error('加载失败', '无法加载画布内容')
  } finally {
    loading.value = false
  }
}

// 加载页面数据
async function loadPage(pageId: string) {
  loading.value = true
  
  try {
    // 确保页面store已初始化
    await pagesStore.initializePages()
    
    // 获取页面数据
    const page = await pagesStore.getPage(pageId)
    
    if (page) {
      currentPage.value = page
      console.log('🔧 预览页面加载成功，组件数量:', page.components.length)
    } else {
      console.error('预览页面未找到:', pageId)
      notificationStore.error('页面未找到', '无法加载预览页面')
    }
  } catch (error) {
    console.error('加载预览页面失败:', error)
    notificationStore.error('加载失败', '无法加载预览页面')
  } finally {
    loading.value = false
  }
}

// 关闭预览
function closePreview() {
  previewStore.closePreview()
}

// 废弃页面
async function discardPage() {
  if (!currentPageId.value || !currentPage.value) return
  
  const confirmed = confirm(`确定要废弃页面"${currentPage.value.name}"吗？此操作不可撤销。`)
  
  if (confirmed) {
    try {
      await pagesStore.deletePage(currentPageId.value)
      notificationStore.success('页面已废弃', `页面"${currentPage.value.name}"已被删除`)
      closePreview()
    } catch (error) {
      console.error('废弃页面失败:', error)
      notificationStore.error('废弃失败', '无法删除页面，请重试')
    }
  }
}

// 在新标签页打开
function openInNewTab() {
  if (!currentPageId.value) return
  
  const pageUrl = `/page/${currentPageId.value}`
  window.open(pageUrl, '_blank')
  notificationStore.success('页面已在新标签页打开')
}

// 保存当前画布为页面
async function saveCanvasAsPage(pageName: string, pageDescription?: string) {
  if (!currentPage.value || !currentPage.value.components.length) {
    notificationStore.error('保存失败', '没有可保存的内容')
    return
  }

  try {
    const pageId = await pagesStore.savePage(
      pageName,
      currentPage.value.components,
      pageDescription
    )
    
    savedPageId.value = pageId
    notificationStore.success('页面保存成功', `页面"${pageName}"已保存`)
    showSaveDialog.value = false
    
    return pageId
  } catch (error) {
    console.error('保存页面失败:', error)
    notificationStore.error('保存失败', '无法保存页面，请重试')
    throw error
  }
}

// 在新标签页打开已保存的页面
function openSavedPageInNewTab() {
  if (!savedPageId.value) return
  
  const pageUrl = `/page/${savedPageId.value}`
  window.open(pageUrl, '_blank')
  notificationStore.success('页面已在新标签页打开')
}

// 获取组件布局类 - 与独立页面保持一致
function getComponentLayoutClass(type: string): string {
  // 展示类组件占用整行（两列）
  if (type === 'response-display' || type === 'data-list' || type === 'paginated-table') {
    return 'md:col-span-2'
  }
  
  // 按钮组件占用整行
  if (type === 'button') {
    return 'md:col-span-2'
  }
  
  // 文本域占用整行
  if (type === 'textarea') {
    return 'md:col-span-2'
  }
  
  // 参数输入组件占用一列（一行两个）
  // 包括：text-input, password-input, multiline-text, boolean-select
  return 'md:col-span-1'
}

// 格式化日期
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 暴露方法给父组件使用
defineExpose({
  openPreview
})
</script> 