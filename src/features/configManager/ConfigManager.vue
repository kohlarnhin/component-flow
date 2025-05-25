<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">配置管理</h2>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <!-- 内容 -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-6">
          <!-- 当前配置信息 -->
          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">当前画布配置</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-500">组件数量：</span>
                <span class="text-gray-900">{{ canvasStore.components.length }} 个</span>
              </div>
              <div>
                <span class="text-gray-500">选中组件：</span>
                <span class="text-gray-900">{{ canvasStore.selectedComponent?.config.label || '无' }}</span>
              </div>
            </div>
            <div v-if="canvasStore.hasComponents" class="mt-3">
              <div class="text-sm text-gray-500 mb-2">组件列表：</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="component in canvasStore.components"
                  :key="component.id"
                  class="inline-flex items-center px-2 py-1 rounded text-xs bg-white border text-gray-700"
                >
                  {{ getComponentIcon(component.config.type) }}
                  {{ component.config.label }}
                </span>
              </div>
            </div>
          </div>

          <!-- 导出配置 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">导出配置</h3>
            <p class="text-sm text-gray-600 mb-4">将当前画布配置导出为JSON文件，可用于备份或分享。</p>
            
            <div class="space-y-3">
              <button
                @click="exportConfig"
                :disabled="!canvasStore.hasComponents"
                class="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ canvasStore.hasComponents ? '导出配置文件' : '画布为空，无法导出' }}
              </button>
              
              <button
                @click="copyConfigToClipboard"
                :disabled="!canvasStore.hasComponents"
                class="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                复制配置到剪贴板
              </button>
            </div>
          </div>

          <!-- 导入配置 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">导入配置</h3>
            <p class="text-sm text-gray-600 mb-4">从JSON文件或文本导入配置，将替换当前画布内容。</p>
            
            <div class="space-y-4">
              <!-- 文件上传 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">从文件导入</label>
                <input
                  ref="fileInputRef"
                  type="file"
                  accept=".json"
                  @change="handleFileImport"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <!-- 文本导入 -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">从文本导入</label>
                <textarea
                  v-model="importText"
                  rows="6"
                  placeholder="请粘贴JSON配置文本..."
                  class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                ></textarea>
                <button
                  @click="importFromText"
                  :disabled="!importText.trim()"
                  class="mt-2 w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  导入配置
                </button>
              </div>
            </div>
          </div>

          <!-- 配置预览 -->
          <div v-if="canvasStore.hasComponents" class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">配置预览</h3>
            <div class="bg-gray-50 rounded p-3 max-h-60 overflow-y-auto">
              <pre class="text-xs text-gray-700 whitespace-pre-wrap">{{ formatConfigPreview() }}</pre>
            </div>
          </div>

          <!-- 操作历史 -->
          <div class="border border-gray-200 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-900 mb-3">快速操作</h3>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="clearCanvas"
                class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                清空画布
              </button>
              <button
                @click="showExampleSelector = true"
                class="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                加载示例配置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 示例选择弹窗 -->
  <ExampleSelector
    v-if="showExampleSelector"
    @close="showExampleSelector = false"
    @select="loadExampleConfig"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCanvasStore } from '@/stores/canvas.store'
import { createComponentConfig } from '@/components/userComponents/templates/componentTemplates'
import { createExampleConfig } from './exampleConfigs'
import ExampleSelector from './ExampleSelector.vue'
import type { ComponentType } from '@/types/global.types'

// 事件定义
interface Emits {
  close: []
}

defineEmits<Emits>()

// 状态管理
const canvasStore = useCanvasStore()

// 导入文本
const importText = ref('')

// 文件输入引用
const fileInputRef = ref<HTMLInputElement>()

// 示例选择器显示状态
const showExampleSelector = ref(false)

// 导出配置
function exportConfig() {
  if (!canvasStore.hasComponents) return
  
  const config = canvasStore.exportConfig()
  const configJson = JSON.stringify(config, null, 2)
  
  // 创建下载链接
  const blob = new Blob([configJson], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `lowcode-config-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  alert('配置文件已下载！')
}

// 复制配置到剪贴板
async function copyConfigToClipboard() {
  if (!canvasStore.hasComponents) return
  
  try {
    const config = canvasStore.exportConfig()
    const configJson = JSON.stringify(config, null, 2)
    await navigator.clipboard.writeText(configJson)
    alert('配置已复制到剪贴板！')
  } catch (error) {
    console.error('复制失败:', error)
    alert('复制失败，请手动复制配置内容')
  }
}

// 处理文件导入
function handleFileImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      importConfig(content)
    } catch (error) {
      console.error('文件读取失败:', error)
      alert('文件读取失败，请检查文件格式')
    }
  }
  reader.readAsText(file)
  
  // 清空文件输入
  target.value = ''
}

// 从文本导入
function importFromText() {
  if (!importText.value.trim()) return
  importConfig(importText.value.trim())
}

// 导入配置
function importConfig(configText: string) {
  try {
    const config = JSON.parse(configText)
    
    // 验证配置格式
    if (!config.components || !Array.isArray(config.components)) {
      throw new Error('配置格式不正确：缺少components数组')
    }
    
    // 确认导入
    if (canvasStore.hasComponents) {
      if (!confirm('导入配置将替换当前画布内容，确定继续吗？')) {
        return
      }
    }
    
    // 导入配置
    canvasStore.importConfig(config)
    importText.value = ''
    alert('配置导入成功！')
    
  } catch (error) {
    console.error('配置导入失败:', error)
    alert('配置导入失败：' + (error instanceof Error ? error.message : '格式错误'))
  }
}

// 清空画布
function clearCanvas() {
  if (!canvasStore.hasComponents) return
  
  if (confirm('确定要清空画布吗？此操作不可撤销。')) {
    canvasStore.clearCanvas()
    alert('画布已清空！')
  }
}

// 加载示例配置
function loadExampleConfig(exampleType: 'oauth-login' | 'paginated-table') {
  if (canvasStore.hasComponents) {
    if (!confirm('加载示例配置将替换当前画布内容，确定继续吗？')) {
      showExampleSelector.value = false
      return
    }
  }
  
  try {
    // 获取示例配置
    const exampleComponents = createExampleConfig(exampleType)
    
    // 清空画布并加载示例组件
    canvasStore.clearCanvas()
    exampleComponents.forEach(component => {
      canvasStore.addComponent(component.config)
    })
    
    showExampleSelector.value = false
    
    const exampleNames = {
      'oauth-login': 'OAuth2登录示例',
      'paginated-table': '分页表格示例'
    }
    
    alert(`${exampleNames[exampleType]}已加载！`)
    
  } catch (error) {
    console.error('加载示例配置失败:', error)
    alert('加载示例配置失败')
    showExampleSelector.value = false
  }
}

// 保留原有的loadSampleConfig函数作为备用（可以删除或重命名）
function loadSampleConfig() {
  // 直接调用OAuth登录示例
  loadExampleConfig('oauth-login')
}

// 格式化配置预览
function formatConfigPreview(): string {
  if (!canvasStore.hasComponents) return '画布为空'
  
  const config = canvasStore.exportConfig()
  return JSON.stringify(config, null, 2)
}

// 获取组件图标
function getComponentIcon(type: ComponentType): string {
  const iconMap: Record<ComponentType, string> = {
    'text-input': '📝',
    'password-input': '🔒',
    'textarea': '📄',
    'button': '🔘',
    'data-list': '📊',
    'response-display': '📺',
    'multiline-text': '📝',
    'boolean-select': '☑️',
    'paginated-table': '📋'
  }
  return iconMap[type] || '❓'
}
</script> 