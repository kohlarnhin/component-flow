<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">选择示例配置</h2>
          <p class="text-sm text-gray-500 mt-1">选择一个示例配置来快速开始构建</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 内容 -->
      <div class="flex-1 overflow-y-auto p-6">
        <!-- 加载状态 -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">加载示例配置中...</span>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
          <p class="text-gray-600 mb-4">{{ error }}</p>
          <button
            @click="loadExamples"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            重新加载
          </button>
        </div>

        <!-- 示例配置列表 -->
        <div v-else-if="examples.length > 0">
          <!-- 分类过滤 -->
          <div v-if="categories.length > 1" class="mb-6">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="category in categories"
                :key="category"
                @click="selectedCategory = category"
                class="px-3 py-1 text-sm rounded-full transition-colors"
                :class="selectedCategory === category 
                  ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                  : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'"
              >
                {{ getCategoryName(category) }}
              </button>
            </div>
          </div>

          <!-- 示例网格 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div 
              v-for="example in filteredExamples"
              :key="example.id"
              @click="selectExample(example)"
              class="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div class="flex items-start space-x-4">
                <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <span class="text-2xl">{{ example.icon || '📝' }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ example.name }}
                  </h3>
                  <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                    {{ example.description || '暂无描述' }}
                  </p>
                  <div class="mt-4">
                    <div class="text-xs text-gray-500 mb-2">包含组件：</div>
                    <div class="flex flex-wrap gap-2">
                      <span 
                        v-for="componentType in getUniqueComponentTypes(example.components)"
                        :key="componentType"
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        <ComponentIcon :type="componentType" class="w-3 h-3 mr-1" />
                        {{ getComponentTypeName(componentType) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <div class="flex items-center justify-between text-sm">
                  <div class="flex items-center space-x-4">
                    <span class="text-gray-500">组件数量: {{ example.components.length }}个</span>
                    <span v-if="example.isSystem" class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 border border-green-200">
                      系统示例
                    </span>
                  </div>
                  <span class="text-blue-600 font-medium group-hover:text-blue-700">点击选择 →</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">暂无示例配置</h3>
          <p class="text-gray-600">还没有可用的示例配置</p>
        </div>

        <!-- 提示信息 -->
        <div v-if="examples.length > 0" class="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div class="flex items-start space-x-3">
            <div class="w-5 h-5 bg-amber-100 rounded-md flex items-center justify-center mt-0.5">
              <svg class="w-3 h-3 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 class="text-sm font-medium text-amber-800">注意事项</h4>
              <p class="text-sm text-amber-700 mt-1">
                选择示例配置将替换当前画布中的所有组件。如果当前画布有内容，建议先导出备份。
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-500">
            选择一个示例配置开始构建您的应用
          </div>
          <button
            @click="$emit('close')"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ComponentIcon from '@/components/ComponentIcon.vue'
import { exampleService } from '@/utils/database'
import { getComponentTypeName } from '@/utils/componentMetadata'
import type { ExampleConfig, ComponentType } from '@/types/global.types'

// 事件定义
interface Emits {
  close: []
  select: [example: ExampleConfig]
}

const emit = defineEmits<Emits>()

// 状态
const examples = ref<ExampleConfig[]>([])
const loading = ref(false)
const error = ref('')
const selectedCategory = ref('all')

// 计算属性
const categories = computed(() => {
  const cats = ['all', ...new Set(examples.value.map(e => e.category))]
  return cats
})

const filteredExamples = computed(() => {
  if (selectedCategory.value === 'all') {
    return examples.value
  }
  return examples.value.filter(e => e.category === selectedCategory.value)
})

// 方法
async function loadExamples() {
  loading.value = true
  error.value = ''
  
  try {
    examples.value = await exampleService.getAllExamples()
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载示例配置失败'
    console.error('加载示例配置失败:', err)
  } finally {
    loading.value = false
  }
}

function selectExample(example: ExampleConfig) {
  emit('select', example)
}

function getCategoryName(category: string): string {
  const categoryNames: Record<string, string> = {
    all: '全部',
    form: '表单类',
    data: '数据类',
    general: '通用类'
  }
  return categoryNames[category] || category
}

function getUniqueComponentTypes(components: any[]): ComponentType[] {
  const types = new Set<ComponentType>()
  components.forEach(comp => {
    if (comp.config?.type) {
      types.add(comp.config.type)
    }
  })
  return Array.from(types)
}

// 生命周期
onMounted(() => {
  loadExamples()
})
</script> 