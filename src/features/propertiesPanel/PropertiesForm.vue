<template>
  <div class="flex flex-col">
    <!-- 组件状态 -->
    <div class="px-4 pt-4 pb-2 flex-shrink-0">
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900">组件信息</h3>
        </div>
        <div class="grid grid-cols-1 gap-2 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">类型</span>
            <span class="font-medium text-gray-900">{{ getComponentTypeName(component.config.type) }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">ID</span>
            <span class="font-medium text-gray-900 font-mono text-xs">{{ component.config.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 配置表单 - 主要区域 -->
    <div class="flex-1 px-4 pb-2 overflow-y-auto space-y-4">
      <!-- 基础配置 -->
      <div class="border border-gray-200 rounded-lg">
        <div class="px-3 py-2 border-b border-gray-100 bg-gray-50">
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
              <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">基础配置</h3>
          </div>
        </div>
        <div class="p-3 space-y-3">
          <!-- 显示名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">显示名称</label>
            <input
              v-model="formData.label"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入显示名称"
            />
          </div>

          <!-- 输入组件特有配置 -->
          <template v-if="isInputComponent">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">占位符</label>
              <input
                v-model="formData.placeholder"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入占位符"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">默认值</label>
              <input
                v-model="formData.defaultValue"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入默认值"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">最大长度</label>
              <input
                v-model.number="formData.maxLength"
                type="number"
                min="1"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入最大长度"
              />
            </div>
          </template>

          <!-- 按钮组件特有配置 -->
          <template v-if="component.config.type === 'button'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">按钮文本</label>
              <input
                v-model="formData.text"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入按钮文本"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">确认文本</label>
              <input
                v-model="formData.confirmText"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="点击前的确认提示（可选）"
              />
            </div>
          </template>

          <!-- 数据列表组件特有配置 -->
          <template v-if="component.config.type === 'data-list'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">API地址</label>
              <input
                v-model="formData.apiUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入API地址"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">每页条数</label>
              <input
                v-model.number="formData.pageSize"
                type="number"
                min="1"
                max="100"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入每页显示条数"
              />
            </div>
          </template>

          <!-- 响应展示组件特有配置 -->
          <template v-if="component.config.type === 'response-display'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">显示格式</label>
              <select
                v-model="formData.format"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="json">JSON</option>
                <option value="text">文本</option>
                <option value="table">表格</option>
              </select>
            </div>
          </template>

          <!-- 多行文本输入组件特有配置 -->
          <template v-if="component.config.type === 'multiline-text'">
            <!-- 移除最大行数和分隔符配置，多行文本输入只需要基础配置即可 -->
          </template>

          <!-- 布尔选择器组件特有配置 -->
          <template v-if="component.config.type === 'boolean-select'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">True状态标签</label>
              <input
                v-model="formData.trueLabel"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入True状态的显示文本"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">False状态标签</label>
              <input
                v-model="formData.falseLabel"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入False状态的显示文本"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Null状态标签</label>
              <input
                v-model="formData.nullLabel"
                type="text"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入Null状态的显示文本"
              />
            </div>

            <div class="space-y-2">
              <label class="flex items-center">
                <input
                  v-model="formData.allowNull"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span class="ml-2 text-sm text-gray-700">允许Null值</span>
              </label>
            </div>
          </template>

          <!-- 分页表格组件特有配置 -->
          <template v-if="component.config.type === 'paginated-table'">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">API地址</label>
              <input
                v-model="formData.apiUrl"
                type="url"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入API地址"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">每页条数</label>
              <input
                v-model.number="formData.pageSize"
                type="number"
                min="5"
                max="100"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="请输入每页显示条数"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">表格列配置</label>
              <textarea
                v-model="columnsText"
                rows="8"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                placeholder="请输入列配置JSON，如：
[
  {&quot;key&quot;: &quot;id&quot;, &quot;title&quot;: &quot;ID&quot;, &quot;sortable&quot;: true},
  {&quot;key&quot;: &quot;name&quot;, &quot;title&quot;: &quot;名称&quot;, &quot;sortable&quot;: true}
]"
              ></textarea>
              <p class="text-xs text-gray-500 mt-1">JSON格式的列配置，包含key、title和sortable属性</p>
            </div>
          </template>

          <!-- 状态选项 -->
          <div class="space-y-2">
            <label class="flex items-center">
              <input
                v-model="formData.required"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">必填项</span>
            </label>
            
            <label class="flex items-center">
              <input
                v-model="formData.disabled"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span class="ml-2 text-sm text-gray-700">禁用状态</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 参数配置（输入类组件） -->
      <div v-if="isInputComponent" class="border border-gray-200 rounded-lg">
        <div class="px-3 py-2 border-b border-gray-100 bg-blue-50">
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
              <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">参数配置</h3>
          </div>
        </div>
        <div class="p-3 space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">字段名</label>
            <input
              v-model="formData.parameterConfig.fieldName"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入字段名（如：username 或 user.profile.name）"
            />
            <p class="text-xs text-gray-500 mt-1">用作API请求参数的key，支持嵌套格式如 user.profile.name</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">参数类型</label>
            <select
              v-model="formData.parameterConfig.type"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="none">不作为参数</option>
              <option value="query">URL参数 (GET)</option>
              <option value="json">JSON参数 (POST Body)</option>
              <option value="form">表单参数 (Form Data)</option>
              <option value="path">路径参数 (URL Path)</option>
              <option value="header">请求头参数</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 请求配置（按钮组件） -->
      <div v-if="component.config.type === 'button'" class="border border-gray-200 rounded-lg">
        <div class="px-3 py-2 border-b border-gray-100 bg-green-50">
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 bg-green-100 rounded-md flex items-center justify-center">
              <svg class="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">请求配置</h3>
          </div>
        </div>
        <div class="p-3 space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">请求地址</label>
            <input
              v-model="formData.requestUrl"
              type="url"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入API地址"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">请求方式</label>
            <select
              v-model="formData.requestMethod"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="GET">GET - 获取数据</option>
              <option value="POST">POST - 提交数据</option>
              <option value="PUT">PUT - 更新数据</option>
              <option value="DELETE">DELETE - 删除数据</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- 操作区域 - 底部 -->
    <div class="border-t border-gray-100 px-4 py-3 flex-shrink-0">
      <div class="flex items-center justify-center space-x-2 text-sm text-gray-500">
        <svg class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>配置自动保存</span>
      </div>
      <div class="mt-2 text-center">
        <p class="text-xs text-gray-400">修改配置后将自动保存到组件</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CanvasComponent, ComponentConfig, ComponentType } from '@/types/global.types'
import { useCanvasStore } from '@/stores/canvas.store'
import { useNotificationStore } from '@/stores/notification.store'

// 组件属性
interface Props {
  component: CanvasComponent
}

// 事件定义
interface Emits {
  update: [config: ComponentConfig]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态管理
const canvasStore = useCanvasStore()
const notificationStore = useNotificationStore()

// 表单数据
const formData = ref<any>({})

// 分页表格列配置文本
const columnsText = ref('')

// 计算属性
const isInputComponent = computed(() => {
  return ['text-input', 'password-input', 'textarea', 'multiline-text', 'boolean-select'].includes(props.component.config.type)
})

// 监听组件变化，更新表单数据
watch(
  () => props.component,
  (newComponent) => {
    formData.value = { ...newComponent.config }
    
    // 确保输入组件有参数配置
    if (isInputComponent.value && !formData.value.parameterConfig) {
      formData.value.parameterConfig = {
        type: 'json',
        fieldName: 'field_' + Date.now()
      }
    }
    
    // 处理分页表格的列配置
    if (newComponent.config.type === 'paginated-table' && 'columns' in newComponent.config) {
      columnsText.value = JSON.stringify(newComponent.config.columns, null, 2)
    }
  },
  { immediate: true }
)

// 监听列配置文本变化
watch(columnsText, (newText) => {
  if (formData.value.type === 'paginated-table') {
    try {
      const columns = JSON.parse(newText)
      if (Array.isArray(columns)) {
        formData.value.columns = columns
      }
    } catch (error) {
      // 忽略JSON解析错误，用户可能正在编辑
    }
  }
})

// 自动保存：监听表单数据变化
watch(
  formData,
  (newFormData) => {
    // 防抖处理，避免频繁保存
    clearTimeout(autoSaveTimer.value)
    autoSaveTimer.value = setTimeout(() => {
      handleAutoSave()
    }, 500) // 500ms 延迟保存
  },
  { deep: true }
)

// 自动保存定时器
const autoSaveTimer = ref<number | null>(null)

// 自动保存处理
function handleAutoSave() {
  try {
    emit('update', formData.value as ComponentConfig)
    console.log('🔄 自动保存配置:', formData.value.label || formData.value.type)
  } catch (error) {
    console.error('自动保存失败:', error)
  }
}

// 获取组件类型名称
function getComponentTypeName(type: ComponentType): string {
  const nameMap: Record<ComponentType, string> = {
    'text-input': '文本输入',
    'password-input': '密码输入',
    'textarea': '文本域',
    'button': '按钮',
    'data-list': '数据列表',
    'response-display': '响应展示',
    'multiline-text': '多行文本输入',
    'boolean-select': '是否选择器',
    'paginated-table': '分页表格'
  }
  return nameMap[type] || '未知组件'
}
</script> 