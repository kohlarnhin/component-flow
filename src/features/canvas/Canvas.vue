<template>
  <div class="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <!-- 简洁头部 -->
    <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">画布</h2>
            <p class="text-sm text-gray-500">拖拽组件构建应用界面</p>
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-center space-x-2">
          <button
            v-if="canvasStore.hasComponents"
            @click="openPreview"
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>预览</span>
          </button>
          <button
            v-if="canvasStore.hasComponents"
            @click="clearCanvas"
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>清空</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 操作提示 -->
    <div v-if="!canvasStore.hasComponents" class="px-4 pt-4 pb-2 flex-shrink-0">
      <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-medium text-blue-900">开始构建</h4>
            <p class="text-xs text-blue-700 mt-1">从左侧组件库拖拽组件到画布开始构建应用</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 画布内容区域 - 主要区域 -->
    <div class="flex-1 px-4 pb-2 flex flex-col min-h-0">
      <div 
        class="border border-gray-200 rounded-lg flex-1 flex flex-col min-h-0"
        @drop="handleDrop"
        @dragover.prevent
        @dragenter.prevent
      >
        <div class="px-3 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
              <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">组件列表</h3>
            <div v-if="canvasStore.hasComponents" class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {{ canvasStore.components.length }} 个组件
            </div>
          </div>
        </div>
        
        <div class="p-3 flex-1 overflow-y-auto">
          <!-- 空状态 -->
          <div 
            v-if="!canvasStore.hasComponents"
            class="h-full flex items-center justify-center text-center"
          >
            <div class="text-gray-400">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                </svg>
              </div>
              <h4 class="text-lg font-medium text-gray-700 mb-2">画布为空</h4>
              <p class="text-sm text-gray-500 mb-4">从左侧组件库拖拽组件到这里开始构建</p>
              <div class="inline-flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span>拖拽组件到此区域</span>
              </div>
            </div>
          </div>

          <!-- 组件列表 -->
          <div v-else class="space-y-3">
            <CanvasComponentItem
              v-for="(component, index) in canvasStore.components"
              :key="component.id"
              :component="component"
              :index="index"
              :is-selected="canvasStore.selectedComponentId === component.id"
              @select="canvasStore.selectComponent(component.id)"
              @delete="canvasStore.removeComponent(component.id)"
              @move-up="moveComponent(index, index - 1)"
              @move-down="moveComponent(index, index + 1)"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 操作提示 - 底部 -->
    <div v-if="canvasStore.hasComponents" class="border-t border-gray-100 px-4 py-4 pb-6 flex-shrink-0">
      <div class="bg-green-50 rounded-lg p-3 border border-green-200">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-medium text-green-900">画布就绪</h4>
            <p class="text-xs text-green-700 mt-1">点击组件进行配置，或点击预览查看效果</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasStore } from '@/stores/canvas.store'
import { useNotificationStore } from '@/stores/notification.store'
import { createComponentConfig } from '@/components/userComponents/templates/componentTemplates'
import CanvasComponentItem from './CanvasComponentItem.vue'
import type { ComponentType } from '@/types/global.types'

// 事件定义
interface Emits {
  'open-preview': []
}

const emit = defineEmits<Emits>()

// 状态管理
const canvasStore = useCanvasStore()
const notificationStore = useNotificationStore()

// 处理拖拽放置
function handleDrop(event: DragEvent) {
  event.preventDefault()
  
  try {
    // 尝试解析JSON格式的拖拽数据
    const dragData = event.dataTransfer?.getData('application/json')
    if (dragData) {
      const { type } = JSON.parse(dragData)
      const config = createComponentConfig(type as ComponentType)
      canvasStore.addComponent(config)
      notificationStore.success('组件添加成功', `已添加${config.label}组件`)
      return
    }
    
    // 兼容旧格式
    const componentType = event.dataTransfer?.getData('component-type') as ComponentType
    if (componentType) {
      const config = createComponentConfig(componentType)
      canvasStore.addComponent(config)
      notificationStore.success('组件添加成功', `已添加${config.label}组件`)
    }
  } catch (error) {
    console.error('添加组件失败:', error)
    notificationStore.error('添加组件失败', '请重试拖拽操作')
  }
}

// 移动组件
function moveComponent(fromIndex: number, toIndex: number) {
  canvasStore.moveComponent(fromIndex, toIndex)
  notificationStore.success('组件移动成功')
}

// 清空画布
function clearCanvas() {
  if (canvasStore.hasComponents) {
    if (confirm('确定要清空画布吗？此操作不可撤销。')) {
      canvasStore.clearCanvas()
      notificationStore.success('画布已清空')
    }
  }
}

// 打开预览
function openPreview() {
  emit('open-preview')
}
</script> 