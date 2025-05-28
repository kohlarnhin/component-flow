<template>
  <div 
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70]"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">保存页面</h3>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- 内容 -->
      <div class="px-6 py-4">
        <form @submit.prevent="handleSave">
          <!-- 页面名称 -->
          <div class="mb-4">
            <label for="pageName" class="block text-sm font-medium text-gray-700 mb-2">
              页面名称 <span class="text-red-500">*</span>
            </label>
            <input
              id="pageName"
              v-model="pageName"
              type="text"
              required
              placeholder="请输入页面名称"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              :class="{ 'border-red-500': nameError }"
            />
            <p v-if="nameError" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
          </div>

          <!-- 页面描述 -->
          <div class="mb-6">
            <label for="pageDescription" class="block text-sm font-medium text-gray-700 mb-2">
              页面描述
            </label>
            <textarea
              id="pageDescription"
              v-model="pageDescription"
              rows="3"
              placeholder="请输入页面描述（可选）"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            ></textarea>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="!pageName.trim() || saving"
              class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ saving ? '保存中...' : '保存页面' }}</span>
            </button>
          </div>
        </form>
      </div>

      <!-- 保存成功后的选项 -->
      <div v-if="saveSuccess" class="px-6 py-4 border-t border-gray-200 bg-green-50">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2 text-green-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium">页面保存成功！</span>
          </div>
          <button
            @click="$emit('open-in-new-tab')"
            class="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded hover:bg-green-200 transition-colors"
          >
            在新标签页打开
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 组件属性
interface Props {
  visible: boolean
}

// 事件定义
interface Emits {
  close: []
  save: [pageName: string, pageDescription?: string]
  'open-in-new-tab': []
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地状态
const pageName = ref('')
const pageDescription = ref('')
const nameError = ref('')
const saving = ref(false)
const saveSuccess = ref(false)

// 监听对话框显示状态，重置表单
watch(() => props.visible, (visible) => {
  if (visible) {
    // 对话框打开时重置表单
    pageName.value = ''
    pageDescription.value = ''
    nameError.value = ''
    saving.value = false
    saveSuccess.value = false
  }
})

// 验证页面名称
function validatePageName(): boolean {
  nameError.value = ''
  
  if (!pageName.value.trim()) {
    nameError.value = '页面名称不能为空'
    return false
  }
  
  if (pageName.value.trim().length > 50) {
    nameError.value = '页面名称不能超过50个字符'
    return false
  }
  
  return true
}

// 处理保存
async function handleSave() {
  if (!validatePageName()) {
    return
  }

  saving.value = true
  
  try {
    await emit('save', pageName.value.trim(), pageDescription.value.trim() || undefined)
    saveSuccess.value = true
  } catch (error) {
    console.error('保存页面失败:', error)
  } finally {
    saving.value = false
  }
}
</script> 