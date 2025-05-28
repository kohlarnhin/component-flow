<template>
  <div 
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <span class="text-xl">{{ componentInfo?.icon || '📄' }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">{{ componentInfo?.documentation.title || '组件信息' }}</h2>
              <p class="text-sm text-gray-500">{{ componentInfo?.name }} · {{ componentInfo?.type }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="copyComponentConfig"
              class="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center space-x-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M8 5a2 2 0 012 2v2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v2M8 5a2 2 0 012-2v0a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span>复制配置</span>
            </button>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- 内容 -->
      <div class="flex-1 overflow-y-auto">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">加载组件信息中...</span>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
          <p class="text-gray-600">{{ error }}</p>
        </div>

        <!-- 组件信息内容 -->
        <div v-else-if="componentInfo" class="p-6 space-y-6">
          <!-- 基本信息 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">基本信息</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span class="text-gray-500">组件类型：</span>
                <span class="font-medium text-gray-900">{{ componentInfo.type }}</span>
              </div>
              <div>
                <span class="text-gray-500">分类：</span>
                <span class="font-medium text-gray-900">{{ componentInfo.category }}</span>
              </div>
              <div>
                <span class="text-gray-500">使用次数：</span>
                <span class="font-medium text-gray-900">{{ componentInfo.usage_count }}</span>
              </div>
              <div>
                <span class="text-gray-500">系统组件：</span>
                <span class="font-medium" :class="componentInfo.is_system ? 'text-green-600' : 'text-blue-600'">
                  {{ componentInfo.is_system ? '是' : '否' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 组件描述 -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">组件描述</h3>
            <p class="text-gray-700 leading-relaxed">{{ componentInfo.documentation.description }}</p>
          </div>

          <!-- 使用场景 -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">使用场景</h3>
            <p class="text-gray-700 leading-relaxed">{{ componentInfo.documentation.usage }}</p>
          </div>

          <!-- 配置属性 -->
          <div>
            <h3 class="text-lg font-medium text-gray-900 mb-3">配置属性</h3>
            <div class="overflow-hidden border border-gray-200 rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">属性名</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">类型</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">说明</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="prop in componentInfo.documentation.properties" :key="prop.name">
                    <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ prop.name }}</td>
                    <td class="px-4 py-3 text-sm text-blue-600 font-mono">{{ prop.type }}</td>
                    <td class="px-4 py-3 text-sm text-gray-700">{{ prop.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- 配置示例 -->
          <div v-if="componentInfo.documentation.examples.length > 0">
            <h3 class="text-lg font-medium text-gray-900 mb-3">配置示例</h3>
            <div class="space-y-4">
              <div v-for="example in componentInfo.documentation.examples" :key="example.name" class="border border-gray-200 rounded-lg">
                <div class="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 class="text-sm font-medium text-gray-900">{{ example.name }}</h4>
                </div>
                <div class="p-4">
                  <pre class="text-sm text-gray-800 bg-gray-100 rounded p-3 overflow-x-auto"><code>{{ JSON.stringify(example.config, null, 2) }}</code></pre>
                </div>
              </div>
            </div>
          </div>

          <!-- 当前配置 -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-lg font-medium text-gray-900">当前配置</h3>
              <button
                @click="copyCurrentConfig"
                class="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
              >
                复制当前配置
              </button>
            </div>
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <pre class="text-sm text-gray-800 overflow-x-auto"><code>{{ JSON.stringify(componentInfo.documentation.currentConfig, null, 2) }}</code></pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { componentService } from '@/utils/database'
import { useNotificationStore } from '@/stores/notification.store'
import type { ComponentDocumentation } from '@/types/global.types'

// Props
interface Props {
  visible: boolean
  componentId: string | null
}

const props = defineProps<Props>()
defineEmits<{
  close: []
}>()

// 状态
const componentInfo = ref<ComponentDocumentation | null>(null)
const loading = ref(false)
const error = ref('')
const notificationStore = useNotificationStore()

// 监听弹窗显示状态
watch(() => [props.visible, props.componentId], ([visible, componentId]) => {
  if (visible && componentId && typeof componentId === 'string') {
    loadComponentInfo(componentId)
  } else {
    componentInfo.value = null
    error.value = ''
  }
})

// 加载组件信息
async function loadComponentInfo(componentId: string) {
  loading.value = true
  error.value = ''
  
  try {
    const info = await componentService.getComponentInfo(componentId)
    if (info) {
      componentInfo.value = info
    } else {
      error.value = '组件信息不存在'
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载组件信息失败'
    console.error('加载组件信息失败:', err)
  } finally {
    loading.value = false
  }
}

// 复制组件配置
async function copyComponentConfig() {
  if (!componentInfo.value) return
  
  try {
    const config = JSON.stringify(componentInfo.value.config, null, 2)
    await navigator.clipboard.writeText(config)
    notificationStore.success('组件配置已复制到剪贴板')
  } catch (error) {
    notificationStore.error('复制失败', '请手动复制配置内容')
  }
}

// 复制当前配置
async function copyCurrentConfig() {
  if (!componentInfo.value) return
  
  try {
    const config = JSON.stringify(componentInfo.value.documentation.currentConfig, null, 2)
    await navigator.clipboard.writeText(config)
    notificationStore.success('当前配置已复制到剪贴板')
  } catch (error) {
    notificationStore.error('复制失败', '请手动复制配置内容')
  }
}
</script> 