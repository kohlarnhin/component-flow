<template>
  <div
    class="p-3 border border-gray-200 rounded-lg cursor-move hover:border-blue-300 hover:shadow-md transition-all bg-white hover:bg-blue-50 group"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="flex items-center space-x-3">
      <!-- SVG图标 -->
      <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <ComponentIcon 
          :type="type" 
          class="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors" 
        />
      </div>
      
      <div class="flex-1">
        <div class="font-medium text-gray-900 group-hover:text-blue-900 transition-colors" v-html="name"></div>
        <div class="text-xs text-gray-500 group-hover:text-blue-600 transition-colors" v-html="description"></div>
      </div>
      
      <!-- 拖拽指示器 -->
      <div class="opacity-0 group-hover:opacity-100 transition-opacity">
        <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ComponentType } from '@/types/global.types'
import ComponentIcon from '@/components/ComponentIcon.vue'

// 组件属性
interface Props {
  type: ComponentType
  name: string
  icon: string
  description: string
}

const props = defineProps<Props>()

// 处理拖拽开始
function handleDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: props.type
    }))
    event.dataTransfer.effectAllowed = 'copy'
  }
}
</script> 