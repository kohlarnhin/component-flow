<template>
  <div class="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <!-- 简洁头部 -->
    <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">配置管理</h2>
          <p class="text-sm text-gray-500">管理和编辑画布配置</p>
        </div>
      </div>
    </div>

    <!-- 当前状态 -->
    <div class="px-4 pt-4 pb-2 flex-shrink-0">
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900">当前画布</h3>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">组件数量</span>
            <span class="font-medium text-gray-900">{{ canvasStore.components.length }}</span>
          </div>
          <div v-if="canvasStore.selectedComponent" class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">已选中</span>
            <span class="font-medium text-gray-900 truncate">{{ canvasStore.selectedComponent.config.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置编辑器 - 主要区域 -->
    <div class="flex-1 px-4 pb-2 flex flex-col min-h-0">
      <div class="border border-gray-200 rounded-lg flex-1 flex flex-col min-h-0">
        <div class="px-3 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
                <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 class="text-sm font-medium text-gray-900">配置编辑器</h3>
            </div>
            <div class="flex items-center space-x-1">
              <button
                @click="formatConfig"
                class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              >
                格式化
              </button>
              <button
                @click="validateConfig"
                class="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100 transition-colors"
              >
                验证
              </button>
            </div>
          </div>
        </div>
        <div class="p-3 flex-1 flex flex-col min-h-0">
          <textarea
            v-model="configText"
            @input="handleConfigChange"
            placeholder="在此编辑JSON配置，修改将实时同步到画布..."
            class="flex-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            :class="{ 'border-red-300 focus:ring-red-500 focus:border-red-500': hasError }"
          ></textarea>
          <div v-if="errorMessage" class="mt-2 text-xs text-red-600 flex items-center space-x-1 flex-shrink-0">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ errorMessage }}</span>
          </div>
          <div v-if="successMessage" class="mt-2 text-xs text-green-600 flex items-center space-x-1 flex-shrink-0">
            <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>{{ successMessage }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作区域 - 底部 -->
    <div class="border-t border-gray-100 px-4 py-4 pb-6 flex-shrink-0 space-y-4">
      <!-- 文件操作 -->
      <div>
        <div class="flex items-center space-x-2 mb-3">
          <div class="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900">文件操作</h3>
        </div>
        
        <div class="grid grid-cols-4 gap-3">
          <button
            @click="exportConfig"
            :disabled="!canvasStore.hasComponents"
            class="px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            下载文件
          </button>
          <button
            @click="copyConfigToClipboard"
            :disabled="!canvasStore.hasComponents"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            复制配置
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            @change="handleFileImport"
            class="hidden"
          />
          <button
            @click="fileInputRef?.click()"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            选择文件
          </button>
          <button
            @click="pasteFromClipboard"
            class="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            从剪贴板
          </button>
        </div>
      </div>

      <!-- 快速操作 -->
      <div>
        <div class="flex items-center space-x-2 mb-3">
          <div class="w-5 h-5 bg-orange-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900">快速操作</h3>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <button
            @click="clearCanvas"
            class="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
            <span>清空画布</span>
          </button>
          <button
            @click="showExampleSelector = true"
            class="flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <span>加载示例</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ confirmDialog.title }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ confirmDialog.message }}</p>
            </div>
          </div>
          <div class="flex justify-end space-x-3">
            <button
              @click="handleConfirmCancel"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              取消
            </button>
            <button
              @click="handleConfirmOk"
              class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              确定
            </button>
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas.store'
import { useNotificationStore } from '@/stores/notification.store'
import { createComponentConfig } from '@/components/userComponents/templates/componentTemplates'
import { createExampleConfig } from './exampleConfigs'
import ExampleSelector from './ExampleSelector.vue'

// 状态管理
const canvasStore = useCanvasStore()
const notificationStore = useNotificationStore()

// 响应式数据
const configText = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const hasError = ref(false)
const fileInputRef = ref<HTMLInputElement>()

// 确认对话框
const showConfirmDialog = ref(false)
const confirmDialog = ref({
  title: '',
  message: '',
  onConfirm: () => {}
})

// 监听画布变化，更新配置文本
let isUserEditing = false

// 初始化配置文本
function initConfigText() {
  if (canvasStore.hasComponents) {
    const config = canvasStore.exportConfig()
    configText.value = JSON.stringify(config, null, 2)
  } else {
    configText.value = '{\n  "components": []\n}'
  }
}

watch(
  () => canvasStore.components,
  () => {
    if (!hasError.value && !isUserEditing) {
      initConfigText()
    }
  },
  { deep: true }
)

// 确认对话框方法
function showConfirm(title: string, message: string, onConfirm: () => void) {
  confirmDialog.value = { title, message, onConfirm }
  showConfirmDialog.value = true
}

function handleConfirmOk() {
  confirmDialog.value.onConfirm()
  showConfirmDialog.value = false
}

function handleConfirmCancel() {
  showConfirmDialog.value = false
}

// 处理配置变化
function handleConfigChange() {
  clearMessages()
  isUserEditing = true
  
  if (!configText.value.trim()) {
    isUserEditing = false
    return
  }

  try {
    const config = JSON.parse(configText.value)
    
    // 验证配置格式
    if (!config.components || !Array.isArray(config.components)) {
      throw new Error('配置格式不正确：缺少components数组')
    }

    // 实时更新画布
    canvasStore.importConfig(config)
    hasError.value = false
    showSuccess('配置已同步到画布')
    
    // 延迟重置编辑状态，避免立即触发watch
    setTimeout(() => {
      isUserEditing = false
    }, 100)
    
  } catch (error) {
    hasError.value = true
    errorMessage.value = error instanceof Error ? error.message : '配置格式错误'
    isUserEditing = false
  }
}

// 格式化配置
function formatConfig() {
  try {
    const config = JSON.parse(configText.value)
    configText.value = JSON.stringify(config, null, 2)
    clearMessages()
    notificationStore.success('配置已格式化')
  } catch (error) {
    notificationStore.error('格式化失败', '配置格式错误')
  }
}

// 验证配置
function validateConfig() {
  try {
    const config = JSON.parse(configText.value)
    
    if (!config.components || !Array.isArray(config.components)) {
      throw new Error('缺少components数组')
    }

    // 验证每个组件
    config.components.forEach((comp: any, index: number) => {
      if (!comp.id || !comp.config) {
        throw new Error(`组件 ${index + 1} 格式不正确`)
      }
    })

    clearMessages()
    notificationStore.success('配置验证通过')
    
  } catch (error) {
    notificationStore.error('配置验证失败', error instanceof Error ? error.message : '未知错误')
  }
}

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
  
  notificationStore.success('配置文件已下载')
}

// 复制配置到剪贴板
async function copyConfigToClipboard() {
  if (!canvasStore.hasComponents) return
  
  try {
    const config = canvasStore.exportConfig()
    const configJson = JSON.stringify(config, null, 2)
    await navigator.clipboard.writeText(configJson)
    notificationStore.success('配置已复制到剪贴板')
  } catch (error) {
    notificationStore.error('复制失败', '请手动复制配置内容')
  }
}

// 从剪贴板粘贴
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    if (text.trim()) {
      configText.value = text
      handleConfigChange()
    }
  } catch (error) {
    notificationStore.error('粘贴失败', '无法从剪贴板读取内容')
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
      configText.value = content
      handleConfigChange()
    } catch (error) {
      notificationStore.error('文件读取失败', '请检查文件格式')
    }
  }
  reader.readAsText(file)
  
  // 清空文件输入
  target.value = ''
}

// 清空画布
function clearCanvas() {
  if (!canvasStore.hasComponents) return
  
  showConfirm(
    '清空画布',
    '确定要清空画布吗？此操作不可撤销。',
    () => {
      canvasStore.clearCanvas()
      notificationStore.success('画布已清空')
    }
  )
}

// 加载示例选择器
const showExampleSelector = ref(false)

// 消息处理
function showSuccess(message: string) {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

function showError(message: string) {
  errorMessage.value = message
  setTimeout(() => {
    errorMessage.value = ''
  }, 5000)
}

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

// 加载示例配置
function loadExampleConfig(exampleType: 'oauth-login' | 'paginated-table') {
  const doLoad = () => {
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
      
      notificationStore.success(`${exampleNames[exampleType]}已加载`, '示例配置已应用到画布')
      
    } catch (error) {
      console.error('加载示例配置失败:', error)
      notificationStore.error('加载示例配置失败', '请检查系统配置')
      showExampleSelector.value = false
    }
  }
  
  if (canvasStore.hasComponents) {
    showConfirm(
      '加载示例配置',
      '加载示例配置将替换当前画布内容，确定继续吗？',
      doLoad
    )
  } else {
    doLoad()
  }
}
</script> 