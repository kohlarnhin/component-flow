<template>
  <div class="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <!-- 属性面板头部 -->
    <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">属性配置</h2>
          <p class="text-sm text-gray-500">配置选中组件的属性</p>
        </div>
      </div>
    </div>

    <!-- 属性配置内容 -->
    <div class="flex-1 overflow-y-auto min-h-0">
      <!-- 未选中组件时的提示 -->
      <div 
        v-if="!canvasStore.selectedComponent"
        class="h-full flex items-center justify-center text-center p-4"
      >
        <div class="text-gray-400">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
            </svg>
          </div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">请选择组件</h4>
          <p class="text-xs text-gray-500">点击画布中的组件即可配置其属性</p>
        </div>
      </div>

      <!-- 组件属性配置表单 -->
      <PropertiesForm 
        v-if="canvasStore.selectedComponent"
        :component="canvasStore.selectedComponent"
        @update="handleUpdateComponent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCanvasStore } from '@/stores/canvas.store'
import PropertiesForm from './PropertiesForm.vue'
import type { ComponentConfig } from '@/types/global.types'

// 状态管理
const canvasStore = useCanvasStore()

// 处理组件更新
function handleUpdateComponent(config: ComponentConfig) {
  if (canvasStore.selectedComponent) {
    canvasStore.updateComponent(canvasStore.selectedComponent.id, config)
  }
}
</script> 