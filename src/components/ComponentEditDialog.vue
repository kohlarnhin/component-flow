<template>
  <div 
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ComponentIcon :type="component?.config.type || 'text-input'" class="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">编辑组件</h3>
              <p class="text-sm text-gray-500">修改组件配置并保存</p>
            </div>
          </div>
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

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto">
        <div v-if="component" class="p-6">
          <!-- 基本信息 -->
          <div class="mb-6">
            <h4 class="text-sm font-medium text-gray-900 mb-3">基本信息</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">组件类型</label>
                <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  {{ getComponentTypeName(component.config.type) }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">组件ID</label>
                <div class="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 font-mono">
                  {{ component.id }}
                </div>
              </div>
            </div>
          </div>

          <!-- 配置表单 -->
          <div class="space-y-4">
            <!-- 通用配置 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">组件标签</label>
              <input
                v-model="formData.label"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="请输入组件标签"
              />
            </div>

            <!-- 输入组件配置 -->
            <template v-if="isInputComponent">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">占位符</label>
                <input
                  v-model="formData.placeholder"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入占位符文本"
                />
              </div>

              <div v-if="component.config.type !== 'boolean-select'" class="grid grid-cols-2 gap-4">
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="formData.required"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">必填项</span>
                  </label>
                </div>
                <div>
                  <label class="flex items-center">
                    <input
                      v-model="formData.disabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">禁用</span>
                  </label>
                </div>
              </div>

              <!-- 移除最大长度限制配置 -->

              <div v-if="component.config.type === 'boolean-select'">
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">是的标签</label>
                    <input
                      v-model="formData.trueLabel"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">否的标签</label>
                    <input
                      v-model="formData.falseLabel"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">未选择标签</label>
                    <input
                      v-model="formData.nullLabel"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div class="mt-2">
                  <label class="flex items-center">
                    <input
                      v-model="formData.allowNull"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">允许未选择</span>
                  </label>
                </div>
              </div>
            </template>

            <!-- 按钮组件配置 -->
            <template v-if="component.config.type === 'button'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">按钮文本</label>
                <input
                  v-model="formData.text"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入按钮文本"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">请求地址</label>
                <input
                  v-model="formData.requestUrl"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入API请求地址"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">请求方法</label>
                  <select
                    v-model="formData.requestMethod"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div>
                  <label class="flex items-center mt-6">
                    <input
                      v-model="formData.disabled"
                      type="checkbox"
                      class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span class="ml-2 text-sm text-gray-700">禁用</span>
                  </label>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">确认文本（可选）</label>
                <input
                  v-model="formData.confirmText"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="点击前的确认提示"
                />
              </div>
            </template>

            <!-- 展示组件配置 -->
            <template v-if="component.config.type === 'data-list' || component.config.type === 'paginated-table'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API地址</label>
                <input
                  v-model="formData.apiUrl"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="请输入数据获取API地址"
                />
              </div>

              <div v-if="component.config.type === 'paginated-table'">
                <label class="block text-sm font-medium text-gray-700 mb-1">页面大小</label>
                <input
                  v-model.number="formData.pageSize"
                  type="number"
                  min="1"
                  max="100"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">列配置（JSON格式）</label>
                <textarea
                  v-model="columnsText"
                  rows="6"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  placeholder='[{"key": "id", "title": "ID", "sortable": true}]'
                ></textarea>
                <p class="mt-1 text-xs text-gray-500">每列包含 key（字段名）、title（显示标题）、sortable（是否可排序）</p>
              </div>
            </template>

            <!-- 响应展示组件配置 -->
            <template v-if="component.config.type === 'response-display'">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">显示格式</label>
                <select
                  v-model="formData.format"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="json">JSON</option>
                  <option value="text">文本</option>
                  <option value="table">表格</option>
                </select>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 底部操作按钮 -->
      <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <div class="flex items-center justify-end space-x-3">
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
          <button
            @click="handleSave"
            :disabled="saving"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            <svg v-if="saving" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>{{ saving ? '保存中...' : '保存' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { CanvasComponent, ComponentConfig } from '@/types/global.types'
import ComponentIcon from '@/components/ComponentIcon.vue'
import { getComponentTypeName } from '@/utils/componentMetadata'

// 组件属性
interface Props {
  visible: boolean
  component: CanvasComponent | null
}

// 事件定义
interface Emits {
  close: []
  save: [component: CanvasComponent, newConfig: ComponentConfig]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 本地状态
const formData = ref<any>({})
const columnsText = ref('')
const saving = ref(false)

// 计算属性
const isInputComponent = computed(() => {
  if (!props.component) return false
  return ['text-input', 'password-input', 'textarea', 'multiline-text', 'boolean-select'].includes(props.component.config.type)
})

// 监听组件变化，更新表单数据
watch(
  () => props.component,
  (newComponent) => {
    if (newComponent) {
      formData.value = { ...newComponent.config }
      
      // 处理列配置
      if ((newComponent.config.type === 'data-list' || newComponent.config.type === 'paginated-table') && 'columns' in newComponent.config) {
        columnsText.value = JSON.stringify(newComponent.config.columns, null, 2)
      } else {
        columnsText.value = ''
      }
    }
  },
  { immediate: true }
)

// 监听列配置文本变化
watch(columnsText, (newText) => {
  if (formData.value.type === 'data-list' || formData.value.type === 'paginated-table') {
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

// 处理保存
async function handleSave() {
  if (!props.component) return
  
  saving.value = true
  
  try {
    // 验证列配置JSON格式
    if ((formData.value.type === 'data-list' || formData.value.type === 'paginated-table') && columnsText.value) {
      try {
        const columns = JSON.parse(columnsText.value)
        if (!Array.isArray(columns)) {
          alert('列配置必须是数组格式')
          return
        }
        formData.value.columns = columns
      } catch (error) {
        alert('列配置JSON格式错误，请检查语法')
        return
      }
    }
    
    emit('save', props.component, formData.value as ComponentConfig)
  } catch (error) {
    console.error('保存组件配置失败:', error)
    alert('保存失败，请重试')
  } finally {
    saving.value = false
  }
}
</script> 