<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← 返回首页
            </router-link>
            <div class="h-6 w-px bg-gray-300"></div>
            <h1 v-if="page" class="text-lg font-semibold text-gray-900">
              {{ page.name }}
            </h1>
            <span v-else class="text-lg text-gray-500">加载中...</span>
          </div>
          
          <div class="flex items-center space-x-3">
            <button
              v-if="page"
              @click="copyPageUrl"
              class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              📋 复制链接
            </button>
            <router-link
              to="/page-manager"
              class="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              页面管理
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 页面内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- 加载状态 -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center space-x-2 text-gray-500">
          <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>加载页面中...</span>
        </div>
      </div>

      <!-- 页面未找到 -->
      <div v-else-if="!page" class="text-center py-12">
        <div class="text-6xl mb-4">😕</div>
        <h2 class="text-2xl font-semibold text-gray-900 mb-2">页面未找到</h2>
        <p class="text-gray-600 mb-6">请检查页面ID是否正确，或者页面可能已被删除。</p>
        <router-link
          to="/page-manager"
          class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
        >
          查看所有页面
        </router-link>
      </div>

      <!-- 页面渲染 -->
      <div v-else class="space-y-6">
        <!-- 页面信息 -->
        <div v-if="page.description" class="bg-white rounded-lg border border-gray-200 p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-2">页面说明</h2>
          <p class="text-gray-700">{{ page.description }}</p>
        </div>

        <!-- 组件渲染区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="component in page.components"
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
              <span class="text-gray-900 font-medium">{{ page.components.length }}</span>
            </div>
            <div>
              <span class="text-gray-500">创建时间：</span>
              <span class="text-gray-900">{{ formatDate(page.createdAt) }}</span>
            </div>
            <div>
              <span class="text-gray-500">更新时间：</span>
              <span class="text-gray-900">{{ formatDate(page.updatedAt) }}</span>
            </div>
            <div>
              <span class="text-gray-500">页面ID：</span>
              <span class="text-gray-900 font-mono text-xs">{{ page.id }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, provide, computed } from 'vue'
import { useRoute } from 'vue-router'
import { usePagesStore } from '@/stores/pages.store'
import { useNotificationStore } from '@/stores/notification.store'
import PageRenderer from '@/components/PageRenderer.vue'
import type { SavedPage } from '@/types/global.types'

const route = useRoute()
const pagesStore = usePagesStore()
const notificationStore = useNotificationStore()

const loading = ref(true)
const page = ref<SavedPage | null>(null)

// 提供页面组件列表给子组件使用
const pageComponents = computed(() => page.value?.components || [])
provide('pageComponents', pageComponents)

// 加载页面数据
async function loadPage() {
  const pageId = route.params.pageId as string
  
  if (!pageId) {
    loading.value = false
    return
  }

  try {
    // 确保页面store已初始化
    await pagesStore.initializePages()
    
    // 使用store的getPage方法获取页面
    const foundPage = await pagesStore.getPage(pageId)
    
    if (foundPage) {
      page.value = foundPage
      console.log('🔧 页面加载成功，组件数量:', foundPage.components.length)
    } else {
      console.error('页面未找到:', pageId)
    }
  } catch (error) {
    console.error('加载页面失败:', error)
  } finally {
    loading.value = false
  }
}

// 复制页面URL
async function copyPageUrl() {
  try {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    notificationStore.success('页面链接已复制到剪贴板')
  } catch (error) {
    notificationStore.error('复制失败', '请手动复制页面链接')
  }
}

// 获取组件布局类 - 与预览弹窗保持一致
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

onMounted(() => {
  loadPage()
})
</script> 