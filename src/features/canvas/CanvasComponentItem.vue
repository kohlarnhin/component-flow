<template>
  <div 
    class="border rounded-lg p-3 cursor-pointer transition-all"
    :class="[
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : 'border-gray-200 bg-white hover:border-gray-300'
    ]"
    @click="$emit('select')"
  >
    <div class="flex items-center justify-between">
      <!-- 组件信息 -->
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
          <ComponentIcon 
            :type="component.config.type" 
            class="w-5 h-5 text-gray-600"
          />
        </div>
        <div>
          <div class="font-medium text-gray-900">{{ component.config.label }}</div>
          <div class="text-sm text-gray-500">{{ getComponentTypeName(component.config.type) }}</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center space-x-1">
        <!-- 上移按钮 -->
        <button
          v-if="index > 0"
          @click.stop="$emit('move-up')"
          class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          title="上移"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
        
        <!-- 下移按钮 -->
        <button
          @click.stop="$emit('move-down')"
          class="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
          title="下移"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        
        <!-- 删除按钮 -->
        <button
          @click.stop="handleDelete"
          class="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
          title="删除"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 组件配置摘要 -->
    <div v-if="isSelected" class="mt-3 pt-3 border-t border-gray-200">
      <div class="text-xs text-gray-500 space-y-1">
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

  <!-- 删除确认对话框 -->
  <div v-if="showDeleteDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">删除组件</h3>
            <p class="text-sm text-gray-500 mt-1">确定要删除"{{ component.config.label }}"组件吗？此操作不可撤销。</p>
          </div>
        </div>
        <div class="flex justify-end space-x-3">
          <button
            @click="showDeleteDialog = false"
            class="btn-secondary"
          >
            取消
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CanvasComponent, ComponentType } from '@/types/global.types'
import { useNotificationStore } from '@/stores/notification.store'
import ComponentIcon from '@/components/ComponentIcon.vue'
import { getComponentTypeName } from '@/utils/componentMetadata'

// 组件属性
interface Props {
  component: CanvasComponent
  index: number
  isSelected: boolean
}

// 事件定义
interface Emits {
  select: []
  delete: []
  'move-up': []
  'move-down': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态管理
const notificationStore = useNotificationStore()

// 删除确认对话框状态
const showDeleteDialog = ref(false)



// 处理删除
function handleDelete() {
  showDeleteDialog.value = true
}

// 确认删除
function confirmDelete() {
  showDeleteDialog.value = false
  emit('delete')
  notificationStore.success('组件已删除', `已删除"${props.component.config.label}"组件`)
}
</script> 