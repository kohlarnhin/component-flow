<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-full mx-auto flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">Vue3低代码平台</h1>
          <span class="text-sm text-gray-500">简洁实用的可视化应用构建工具</span>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            @click="openPageManagerInNewTab"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            我的页面 ({{ pagesStore.pagesCount }})
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-4 py-6 2xl:max-w-full 2xl:px-8">
      <div class="grid grid-cols-5 gap-4 h-[calc(100vh-120px)] xl:gap-6">
        <!-- 组件库 -->
        <div class="col-span-1">
          <ComponentLibrary />
        </div>
        
        <!-- 画布区域 -->
        <div class="col-span-2">
          <Canvas @open-preview="handleOpenPreview" />
        </div>
        
        <!-- 属性面板 -->
        <div class="col-span-1">
          <PropertiesPanel />
        </div>
        
        <!-- 配置管理面板 -->
        <div class="col-span-1">
          <ConfigManagerPanel />
        </div>
      </div>
    </main>

    <!-- 预览模态框 -->
    <PreviewModal ref="previewModalRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePagesStore } from '@/stores/pages.store'
import { useCanvasStore } from '@/stores/canvas.store'
import ComponentLibrary from '@/features/componentLibrary/ComponentLibrary.vue'
import Canvas from '@/features/canvas/Canvas.vue'
import PropertiesPanel from '@/features/propertiesPanel/PropertiesPanel.vue'
import PreviewModal from '@/features/previewEngine/PreviewModal.vue'
import ConfigManagerPanel from '@/features/configManager/ConfigManagerPanel.vue'

// 状态管理
const pagesStore = usePagesStore()
const canvasStore = useCanvasStore()

// 预览模态框引用
const previewModalRef = ref<InstanceType<typeof PreviewModal>>()

// 处理打开预览
function handleOpenPreview() {
  previewModalRef.value?.openPreview()
}

// 处理打开页面管理器在新标签页
function openPageManagerInNewTab() {
  // 创建页面管理器的独立页面URL
  const pageManagerUrl = '/page-manager'
  window.open(pageManagerUrl, '_blank')
}

// 监听来自页面管理器的消息
window.addEventListener('message', (event) => {
  if (event.data.type === 'LOAD_PAGE_TO_CANVAS') {
    const page = event.data.page
    if (confirm(`确定要加载页面"${page.name}"到画布吗？当前画布内容将被替换。`)) {
      canvasStore.loadComponents(page.components)
      alert('页面已加载到画布！')
    }
  }
})
</script> 