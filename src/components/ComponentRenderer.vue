<template>
  <!-- 组件卡片容器 - 使用与组件库一致的样式 -->
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">
    <!-- 文本输入 -->
    <div v-if="component.config.type === 'text-input'" class="p-4">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">
            {{ component.config.label }}
            <span v-if="component.config.required" class="text-red-500 ml-1">*</span>
          </label>
        </div>
        <input
          type="text"
          :value="getCurrentValue()"
          @input="updateValue(($event.target as HTMLInputElement)?.value)"
          :placeholder="component.config.placeholder"
          :required="component.config.required"
          :disabled="component.config.disabled"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- 密码输入 -->
    <div v-else-if="component.config.type === 'password-input'" class="p-4">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">
            {{ component.config.label }}
            <span v-if="component.config.required" class="text-red-500 ml-1">*</span>
          </label>
        </div>
        <input
          type="password"
          :value="getCurrentValue()"
          @input="updateValue(($event.target as HTMLInputElement)?.value)"
          :placeholder="component.config.placeholder"
          :required="component.config.required"
          :disabled="component.config.disabled"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>

    <!-- 文本域 -->
    <div v-else-if="component.config.type === 'textarea'" class="p-4">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">
            {{ component.config.label }}
            <span v-if="component.config.required" class="text-red-500 ml-1">*</span>
          </label>
        </div>
        <textarea
          :value="getCurrentValue() as string"
          @input="updateValue(($event.target as HTMLTextAreaElement)?.value)"
          :placeholder="component.config.placeholder"
          :required="component.config.required"
          :disabled="component.config.disabled"
          :rows="(component.config as any).rows || 3"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        ></textarea>
      </div>
    </div>

    <!-- 按钮 -->
    <div v-else-if="component.config.type === 'button'" class="p-4">
      <div class="space-y-3">
        <div v-if="component.config.label" class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">
            {{ component.config.label }}
          </label>
        </div>
        <button
          @click="handleButtonClick"
          :disabled="component.config.disabled || isLoading"
          class="btn-primary w-full flex items-center justify-center space-x-2 py-3"
        >
          <span v-if="isLoading" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中...
          </span>
          <span v-else class="flex items-center space-x-2">
            <ComponentIcon :type="component.config.type" class="w-4 h-4" />
            <span>{{ 'text' in component.config ? component.config.text : '发送请求' }}</span>
          </span>
        </button>
        
        <!-- 请求配置预览 -->
        <div v-if="hasRequestConfig()" class="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
          <div class="text-xs text-gray-600 space-y-1">
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <strong>请求方式:</strong> 
              <span class="font-mono">{{ getRequestMethod() }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-green-500 rounded-full"></div>
              <strong>请求地址:</strong> 
              <span class="font-mono text-xs break-all">{{ getRequestUrl() }}</span>
            </div>
            <div v-if="context === 'preview' && getParameterCount() > 0" class="flex items-center space-x-2">
              <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
              <strong>绑定参数:</strong> 
              <span>{{ getParameterCount() }} 个</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据列表 -->
    <div v-else-if="component.config.type === 'data-list'" class="overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
              <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
            </div>
            <span class="text-sm font-medium text-gray-800">{{ component.config.label }}</span>
          </div>
          <button
            @click="loadListData"
            :disabled="isLoading"
            class="btn-secondary text-xs py-1 px-3"
          >
            {{ isLoading ? '加载中...' : '刷新数据' }}
          </button>
        </div>
      </div>
      
      <div class="p-4">
        <div v-if="listData.length > 0" class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50">
                <th
                  v-for="column in getColumns()"
                  :key="column.key"
                  class="text-left py-3 px-4 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {{ column.title }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in listData"
                :key="index"
                class="hover:bg-gray-50 transition-colors"
              >
                <td
                  v-for="column in getColumns()"
                  :key="column.key"
                  class="py-3 px-4 text-sm text-gray-900"
                >
                  {{ item[column.key] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center text-gray-500 py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">暂无数据</h4>
          <p class="text-xs text-gray-500 mb-4">点击"刷新数据"加载数据</p>
        </div>
      </div>
    </div>

    <!-- 响应展示 -->
    <div v-else-if="component.config.type === 'response-display'" class="overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <span class="text-sm font-medium text-gray-800">{{ component.config.label }}</span>
        </div>
      </div>
      
      <div class="p-4">
        <div v-if="previewStore.latestResponse" class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-gray-700">最新响应</span>
            <span 
              class="px-2 py-1 rounded text-xs font-medium"
              :class="previewStore.latestResponse.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
            >
              {{ previewStore.latestResponse.status }}
            </span>
          </div>
          <div class="bg-gray-900 rounded-lg p-4 overflow-auto max-h-64 border border-gray-200">
            <div v-if="getDisplayFormat() === 'json'" class="text-green-400 font-mono text-xs">
              <pre class="whitespace-pre-wrap">{{ JSON.stringify(previewStore.latestResponse.data, null, 2) }}</pre>
            </div>
            <div v-else-if="getDisplayFormat() === 'text'" class="text-green-400 font-mono text-xs">
              {{ JSON.stringify(previewStore.latestResponse.data) }}
            </div>
            <div v-else class="text-green-400 font-mono text-xs">
              表格格式显示功能开发中...
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">暂无响应数据</h4>
          <p class="text-xs text-gray-500 mb-4">执行API调用后将显示响应结果</p>
        </div>
      </div>
    </div>

    <!-- 多行文本输入 -->
    <div v-else-if="component.config.type === 'multiline-text'" class="p-4">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">
            {{ component.config.label }}
            <span v-if="component.config.required" class="text-red-500 ml-1">*</span>
          </label>
        </div>
        <textarea
          :value="getMultilineValue()"
          @input="updateMultilineValue(($event.target as HTMLTextAreaElement)?.value)"
          :placeholder="component.config.placeholder"
          :disabled="component.config.disabled"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
        ></textarea>
      </div>
    </div>

    <!-- 布尔选择器 -->
    <div v-else-if="component.config.type === 'boolean-select'" class="p-4">
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">
            {{ component.config.label }}
            <span v-if="component.config.required" class="text-red-500 ml-1">*</span>
          </label>
        </div>
        <div class="flex space-x-2">
          <button
            v-if="'allowNull' in component.config && component.config.allowNull"
            @click="updateBooleanValue(null)"
            :disabled="component.config.disabled"
            class="flex-1 px-3 py-2 text-sm border rounded-lg transition-colors"
            :class="booleanValue === null 
              ? 'bg-gray-100 border-gray-300 text-gray-700 font-medium' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            {{ 'nullLabel' in component.config ? component.config.nullLabel : '未选择' }}
          </button>
          <button
            @click="updateBooleanValue(true)"
            :disabled="component.config.disabled"
            class="flex-1 px-3 py-2 text-sm border rounded-lg transition-colors"
            :class="booleanValue === true 
              ? 'bg-green-100 border-green-300 text-green-700 font-medium' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            {{ 'trueLabel' in component.config ? component.config.trueLabel : '是' }}
          </button>
          <button
            @click="updateBooleanValue(false)"
            :disabled="component.config.disabled"
            class="flex-1 px-3 py-2 text-sm border rounded-lg transition-colors"
            :class="booleanValue === false 
              ? 'bg-red-100 border-red-300 text-red-700 font-medium' 
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'"
          >
            {{ 'falseLabel' in component.config ? component.config.falseLabel : '否' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 分页表格 -->
    <div v-else-if="component.config.type === 'paginated-table'" class="overflow-hidden">
      <div class="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
              <ComponentIcon :type="component.config.type" class="w-4 h-4 text-gray-600" />
            </div>
            <span class="text-sm font-medium text-gray-800">{{ component.config.label }}</span>
          </div>
          <button
            @click="loadPaginatedData"
            :disabled="isLoading || isLoadingPaginatedData"
            class="btn-secondary text-xs py-1 px-3"
          >
            {{ (isLoading || isLoadingPaginatedData) ? '加载中...' : '刷新数据' }}
          </button>
        </div>
      </div>
      
      <div class="p-4">
        <div v-if="paginatedData.list && paginatedData.list.length > 0" class="space-y-4">
          <!-- 表格 -->
          <div class="overflow-x-auto min-h-96">
            <table class="min-w-full table-fixed border-collapse">
              <thead>
                <tr class="border-b border-gray-200 bg-gray-50">
                  <th
                    v-for="column in getPaginatedColumns()"
                    :key="column.key"
                    class="text-left py-3 px-3 text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors whitespace-nowrap"
                    :class="getColumnWidth(column)"
                    @click="handleSort(column.key, $event)"
                  >
                    <div class="flex items-center space-x-1">
                      <span>{{ column.title }}</span>
                      <div v-if="column.sortable" class="flex flex-col">
                        <svg 
                          class="w-3 h-3 transition-colors"
                          :class="getSortDirection(column.key) === 'asc' ? 'text-blue-600' : 'text-gray-400'"
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <svg 
                          class="w-3 h-3 transition-colors -mt-1"
                          :class="getSortDirection(column.key) === 'desc' ? 'text-blue-600' : 'text-gray-400'"
                          fill="currentColor" viewBox="0 0 20 20"
                        >
                          <path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" />
                        </svg>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="(item, index) in paginatedData.list"
                  :key="index"
                  class="hover:bg-gray-50 transition-colors h-12"
                >
                  <td
                    v-for="column in getPaginatedColumns()"
                    :key="column.key"
                    class="py-3 px-3 text-sm text-gray-900"
                    :class="getColumnWidth(column)"
                  >
                    <span v-if="column.key === 'enabled'">
                      <span 
                        class="px-2 py-1 text-xs rounded-full"
                        :class="item[column.key] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ item[column.key] ? '启用' : '禁用' }}
                      </span>
                    </span>
                    <span 
                      v-else 
                      class="inline-block truncate"
                      :class="getColumnMaxWidth(column)"
                      :title="item[column.key] || '-'"
                    >
                      {{ item[column.key] || '-' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 分页控制器 -->
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-500">
              共 {{ paginatedData.total || 0 }} 条记录，第 {{ paginatedData.page || 1 }} / {{ paginatedData.totalPage || 1 }} 页
            </div>
            <div class="flex items-center space-x-1">
              <!-- 上一页按钮 -->
              <button
                @click="changePage(paginatedData.page - 1)"
                :disabled="paginatedData.page <= 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                上一页
              </button>
              
              <!-- 页码按钮列表 -->
              <div class="flex items-center space-x-1">
                <!-- 首页 -->
                <button
                  v-if="shouldShowFirstPage"
                  @click="changePage(1)"
                  class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  :class="paginatedData.page === 1 ? 'bg-blue-100 text-blue-700 border-blue-300' : ''"
                >
                  1
                </button>
                
                <!-- 首页省略号 -->
                <span v-if="shouldShowStartEllipsis" class="px-2 text-sm text-gray-400">...</span>
                
                <!-- 中间页码 -->
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  :class="paginatedData.page === page ? 'bg-blue-100 text-blue-700 border-blue-300' : ''"
                >
                  {{ page }}
                </button>
                
                <!-- 尾页省略号 -->
                <span v-if="shouldShowEndEllipsis" class="px-2 text-sm text-gray-400">...</span>
                
                <!-- 尾页 -->
                <button
                  v-if="shouldShowLastPage"
                  @click="changePage(paginatedData.totalPage)"
                  class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  :class="paginatedData.page === paginatedData.totalPage ? 'bg-blue-100 text-blue-700 border-blue-300' : ''"
                >
                  {{ paginatedData.totalPage }}
                </button>
              </div>
              
              <!-- 下一页按钮 -->
              <button
                @click="changePage(paginatedData.page + 1)"
                :disabled="paginatedData.page >= paginatedData.totalPage"
                class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center text-gray-500 py-12">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
            <ComponentIcon :type="component.config.type" class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="text-sm font-medium text-gray-700 mb-2">暂无数据</h4>
          <p class="text-xs text-gray-500 mb-4">点击"刷新数据"加载数据</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, inject, computed, type ComputedRef } from 'vue'
import { usePreviewStore } from '@/stores/preview.store'
import { useCanvasStore } from '@/stores/canvas.store'
import type { CanvasComponent } from '@/types/global.types'
import ComponentIcon from '@/components/ComponentIcon.vue'

// 组件属性
interface Props {
  component: CanvasComponent
  context?: 'preview' | 'page' // 上下文：预览模式或独立页面
  allComponents?: CanvasComponent[] // 所有组件（用于参数收集）
}

const props = withDefaults(defineProps<Props>(), {
  context: 'preview',
  allComponents: () => []
})

// 状态管理
const previewStore = usePreviewStore()
const canvasStore = useCanvasStore()

// 注入页面组件列表（独立页面模式使用）
const pageComponents = inject<ComputedRef<CanvasComponent[]>>('pageComponents', computed(() => []))

// 缓存页面组件列表，避免响应式依赖导致的无限循环
const cachedPageComponents = ref<CanvasComponent[]>([])

// 监听pageComponents变化，但只在初始化时更新缓存
watch(() => pageComponents.value, (newComponents) => {
  if (props.context === 'page' && newComponents.length > 0 && cachedPageComponents.value.length === 0) {
    cachedPageComponents.value = [...newComponents]
    console.log('🔧 初始化缓存页面组件列表 - 组件数量:', cachedPageComponents.value.length)
  }
}, { immediate: true })

// 本地状态
const isLoading = ref(false)
const listData = ref<any[]>([])

// 分页表格数据和状态
const paginatedData = ref<{
  list: any[]
  total: number
  page: number
  totalPage: number
  size: number
}>({
  list: [],
  total: 0,
  page: 1,
  totalPage: 1,
  size: 10
})

const currentSort = ref<string>('')
const sortDirection = ref<'asc' | 'desc' | null>(null)
// 多字段排序支持
const sortFields = ref<Array<{field: string, direction: 'asc' | 'desc'}>>([])
const enableMultiSort = ref(false) // 是否启用多字段排序

// 布尔选择器的响应式状态
const booleanValue = ref<boolean | null>(null)

// 分页数据加载状态锁定 - 防止无限循环
const isLoadingPaginatedData = ref(false)

// 防抖定时器
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null)

// 初始化布尔值
function initBooleanValue() {
  if (props.component.config.type === 'boolean-select') {
    booleanValue.value = getBooleanValue()
  }
}

// 初始化分页表格状态
function initializePaginatedTableState() {
  if (props.component.config.type !== 'paginated-table') return
  
  // 恢复排序状态
  const sortKey = `${getStorageKeyPrefix()}${props.component.id}_currentSort`
  const sortDirectionKey = `${getStorageKeyPrefix()}${props.component.id}_sortDirection`
  
  const storedSort = localStorage.getItem(sortKey)
  const storedDirection = localStorage.getItem(sortDirectionKey)
  
  if (storedSort) {
    currentSort.value = storedSort
  }
  
  if (storedDirection && storedDirection !== 'null') {
    sortDirection.value = storedDirection as 'asc' | 'desc'
  }
  
  // 恢复页码状态
  const pageKey = `${getStorageKeyPrefix()}${props.component.id}_currentPage`
  const storedPage = localStorage.getItem(pageKey)
  
  if (storedPage) {
    const pageNum = parseInt(storedPage, 10)
    if (!isNaN(pageNum) && pageNum > 0) {
      paginatedData.value.page = pageNum
    }
  }
  
  console.log('🔧 分页表格状态初始化完成 - 排序:', currentSort.value, sortDirection.value, '页码:', paginatedData.value.page)
}

// 监听组件变化，重新初始化布尔值和分页表格状态
watch(() => props.component, () => {
  initBooleanValue()
  initializePaginatedTableState()
}, { immediate: true })

// 获取存储键前缀（根据上下文区分）
function getStorageKeyPrefix() {
  return props.context === 'page' ? 'page_component_' : 'component_'
}

// 更新表单值
function updateValue(value: any) {
  const storageKey = `${getStorageKeyPrefix()}${props.component.id}_value`
  localStorage.setItem(storageKey, String(value))
}

// 获取组件当前值（支持默认值）
function getCurrentValue() {
  const storageKey = `${getStorageKeyPrefix()}${props.component.id}_value`
  const storedValue = localStorage.getItem(storageKey)
  
  if (storedValue !== null && storedValue !== '') {
    return storedValue
  }
  
  // 如果没有存储值，使用默认值
  const config = props.component.config
  if ('defaultValue' in config && config.defaultValue !== undefined) {
    // 自动设置默认值到localStorage中
    localStorage.setItem(storageKey, String(config.defaultValue))
    return config.defaultValue
  }
  
  return ''
}

// 获取多行文本的值
function getMultilineValue() {
  const storageKey = `${getStorageKeyPrefix()}${props.component.id}_multilineValue`
  const storedValue = localStorage.getItem(storageKey)
  
  if (storedValue !== null && storedValue !== '') {
    return storedValue
  }
  
  return ''
}

// 更新多行文本的值
function updateMultilineValue(value: string) {
  const storageKey = `${getStorageKeyPrefix()}${props.component.id}_multilineValue`
  localStorage.setItem(storageKey, value)
}

// 获取布尔值
function getBooleanValue() {
  const storageKey = `${getStorageKeyPrefix()}${props.component.id}_booleanValue`
  const storedValue = localStorage.getItem(storageKey)
  
  if (storedValue !== null && storedValue !== '') {
    if (storedValue === 'null') return null
    return storedValue === 'true'
  }
  
  // 如果没有存储值，使用默认值
  const config = props.component.config
  if (config.type === 'boolean-select' && 'defaultValue' in config && config.defaultValue !== undefined) {
    localStorage.setItem(storageKey, String(config.defaultValue))
    return config.defaultValue
  }
  
  return null
}

// 更新布尔值
function updateBooleanValue(value: boolean | null) {
  const storageKey = `${getStorageKeyPrefix()}${props.component.id}_booleanValue`
  localStorage.setItem(storageKey, String(value))
  
  // 更新响应式状态
  booleanValue.value = value
}

// 处理按钮点击
async function handleButtonClick() {
  const config = props.component.config
  if (config.type !== 'button') return
  
  // 确认对话框
  if ('confirmText' in config && config.confirmText) {
    if (!confirm(config.confirmText)) return
  }
  
  // 使用智能参数收集系统
  if ('requestUrl' in config && config.requestUrl) {
    const method = config.requestMethod || 'GET'
    try {
      isLoading.value = true
      
      // 根据上下文获取组件列表
      let allComponents: CanvasComponent[]
      if (props.context === 'preview') {
        allComponents = props.allComponents.length > 0 ? props.allComponents : canvasStore.components
      } else {
        // 独立页面模式：使用缓存的页面组件列表，避免响应式依赖
        allComponents = cachedPageComponents.value.length > 0 ? cachedPageComponents.value : [props.component]
        console.log('🔧 独立页面参数收集 - 组件数量:', allComponents.length, '(使用缓存)')
        console.log('🔧 独立页面参数收集 - 组件列表:', allComponents.map(c => ({
          id: c.id,
          type: c.config.type,
          label: c.config.label
        })))
      }
      
      await previewStore.callApiWithComponents(allComponents, config.requestUrl, method, props.context)
    } catch (error) {
      console.error('API调用失败:', error)
      alert('请求失败: ' + (error instanceof Error ? error.message : '未知错误'))
    } finally {
      isLoading.value = false
    }
  } else {
    // 模拟操作
    alert(`按钮"${config.text}"被点击了！`)
  }
}

// 加载列表数据
async function loadListData() {
  const config = props.component.config
  if (config.type !== 'data-list') return
  
  isLoading.value = true
  
  try {
    if ('apiUrl' in config && config.apiUrl) {
      const response = await previewStore.callApi(config.apiUrl, 'GET')
      if (response.status === 200 && response.data) {
        listData.value = response.data.data || response.data || []
      }
    } else {
      // 生成模拟数据
      listData.value = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: `项目 ${i + 1}`,
        status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)],
        value: Math.floor(Math.random() * 1000)
      }))
    }
  } catch (error) {
    console.error('加载列表数据失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载分页表格的数据
async function loadPaginatedData() {
  const config = props.component.config
  if (config.type !== 'paginated-table') return
  
  // 🔒 防止无限循环：检查是否已经在加载中
  if (isLoadingPaginatedData.value) {
    console.log('🔒 分页数据正在加载中，跳过重复请求 - 组件ID:', props.component.id)
    return
  }
  
  // 设置锁定状态
  isLoadingPaginatedData.value = true
  console.log('🔧 开始加载分页数据 - 组件ID:', props.component.id, '上下文:', props.context)
  
  try {
    if ('apiUrl' in config && config.apiUrl) {
      // 根据上下文获取组件列表
      let allComponents: CanvasComponent[]
      if (props.context === 'preview') {
        allComponents = props.allComponents.length > 0 ? props.allComponents : canvasStore.components
      } else {
        // 独立页面模式：使用缓存的页面组件列表，避免响应式依赖
        allComponents = cachedPageComponents.value.length > 0 ? cachedPageComponents.value : [props.component]
        console.log('🔧 分页表格参数收集 - 组件数量:', allComponents.length, '(使用缓存)')
      }
      
      const response = await previewStore.callApiWithComponents(allComponents, config.apiUrl, 'POST', props.context)
      
      if (response.status === 200 && response.data) {
        let responseData = response.data
        
        if (responseData.success && responseData.data) {
          responseData = responseData.data
        }
        
        paginatedData.value = {
          list: responseData.list || [],
          total: responseData.total || 0,
          page: paginatedData.value.page, // 保持用户选择的页码，不使用API返回的页码
          totalPage: responseData.totalPage || 1,
          size: responseData.size || paginatedData.value.size
        }
        console.log('🔧 分页数据加载成功 - 记录数:', responseData.list?.length || 0)
      }
    } else {
      // 生成模拟数据
      const mockData = Array.from({ length: paginatedData.value.size }, (_, i) => ({
        id: (paginatedData.value.page - 1) * paginatedData.value.size + i + 1,
        number: `T${1000 + i}`,
        name: `测试配方 ${i + 1}`,
        materialNumber: `M${200 + i}`,
        materialName: `测试物料 ${i + 1}`,
        enabled: Math.random() > 0.5,
        createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
      }))
      
      paginatedData.value = {
        list: mockData,
        total: 50,
        page: paginatedData.value.page,
        totalPage: Math.ceil(50 / paginatedData.value.size),
        size: paginatedData.value.size
      }
      console.log('🔧 分页模拟数据生成完成')
    }
  } catch (error) {
    console.error('🚨 加载分页数据失败:', error)
    
    // 错误处理：重置为第一页
    if (paginatedData.value.page > 1) {
      console.log('🔧 错误恢复：重置到第一页')
      paginatedData.value.page = 1
      const pageKey = `${getStorageKeyPrefix()}${props.component.id}_currentPage`
      localStorage.setItem(pageKey, '1')
    }
  } finally {
    // 🔓 确保状态总是被释放
    isLoadingPaginatedData.value = false
    console.log('🔧 分页数据加载完成，释放锁定状态 - 组件ID:', props.component.id)
  }
}

// 获取列配置
function getColumns() {
  const config = props.component.config
  if (config.type === 'data-list' && 'columns' in config) {
    return config.columns
  }
  return [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: '名称', sortable: true },
    { key: 'status', title: '状态', sortable: false }
  ]
}

// 获取分页表格的列配置
function getPaginatedColumns() {
  const config = props.component.config
  if (config.type === 'paginated-table' && 'columns' in config) {
    return config.columns
  }
  return [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'name', title: '名称', sortable: true },
    { key: 'status', title: '状态', sortable: false }
  ]
}

// 获取列的最大宽度样式
function getColumnMaxWidth(column: any) {
  // 根据列的key或类型设置不同的最大宽度
  const key = column.key
  
  // ID类型的列较短
  if (key === 'id' || key.toLowerCase().includes('id')) {
    return 'max-w-20'
  }
  
  // 编号类型的列
  if (key.toLowerCase().includes('number') || key.toLowerCase().includes('code')) {
    return 'max-w-32'
  }
  
  // 名称类型的列
  if (key.toLowerCase().includes('name') || key.toLowerCase().includes('title')) {
    return 'max-w-48'
  }
  
  // 时间类型的列
  if (key.toLowerCase().includes('time') || key.toLowerCase().includes('date')) {
    return 'max-w-40'
  }
  
  // 状态类型的列较短
  if (key.toLowerCase().includes('status') || key.toLowerCase().includes('enabled')) {
    return 'max-w-24'
  }
  
  // 默认中等宽度
  return 'max-w-xs'
}

// 获取列的固定宽度样式（用于表头）
function getColumnWidth(column: any) {
  // 根据列的key或类型设置不同的固定宽度
  const key = column.key
  const title = column.title || ''
  
  // 根据标题长度动态调整最小宽度
  const titleLength = title.length
  let baseWidth = 'w-32' // 基础宽度
  
  // ID类型的列
  if (key === 'id' || key.toLowerCase().includes('id')) {
    baseWidth = titleLength > 4 ? 'w-24' : 'w-20'
  }
  // 编号类型的列
  else if (key.toLowerCase().includes('number') || key.toLowerCase().includes('code')) {
    baseWidth = titleLength > 6 ? 'w-40' : 'w-32'
  }
  // 名称类型的列
  else if (key.toLowerCase().includes('name') || key.toLowerCase().includes('title')) {
    baseWidth = titleLength > 8 ? 'w-56' : 'w-48'
  }
  // 时间类型的列
  else if (key.toLowerCase().includes('time') || key.toLowerCase().includes('date')) {
    baseWidth = titleLength > 6 ? 'w-48' : 'w-40'
  }
  // 状态类型的列
  else if (key.toLowerCase().includes('status') || key.toLowerCase().includes('enabled')) {
    baseWidth = titleLength > 4 ? 'w-32' : 'w-24'
  }
  // 默认根据标题长度调整
  else {
    if (titleLength > 10) baseWidth = 'w-48'
    else if (titleLength > 6) baseWidth = 'w-40'
    else baseWidth = 'w-32'
  }
  
  return baseWidth
}

// 获取显示格式
function getDisplayFormat() {
  const config = props.component.config
  if (config.type === 'response-display' && 'format' in config) {
    return config.format || 'json'
  }
  return 'json'
}

// 获取请求方法
function getRequestMethod() {
  const config = props.component.config
  if (config.type === 'button' && 'requestMethod' in config) {
    return config.requestMethod || 'GET'
  }
  return 'GET'
}

// 获取请求地址
function getRequestUrl() {
  const config = props.component.config
  if (config.type === 'button' && 'requestUrl' in config) {
    return config.requestUrl || ''
  }
  return ''
}

// 获取参数数量（仅预览模式显示）
function getParameterCount() {
  if (props.context !== 'preview') return 0
  
  const allComponents = props.allComponents.length > 0 ? props.allComponents : canvasStore.components
  return allComponents.filter(comp => {
    const config = comp.config
    return 'parameterConfig' in config && 
           config.parameterConfig && 
           config.parameterConfig.type !== 'none'
  }).length
}

// 检查是否有请求配置
function hasRequestConfig() {
  const config = props.component.config
  if (config.type === 'button') {
    return 'requestUrl' in config && config.requestUrl
  }
  return false
}

// 处理排序
function handleSort(key: string, event?: MouseEvent) {
  const config = props.component.config
  if (config.type !== 'paginated-table') return
  
  const column = getPaginatedColumns().find(col => col.key === key)
  if (!column || !column.sortable) return
  
  // 检查是否按住Ctrl键（多字段排序）
  const isMultiSort = event?.ctrlKey || event?.metaKey
  
  if (isMultiSort && enableMultiSort.value) {
    // 多字段排序逻辑
    handleMultiFieldSort(key)
  } else {
    // 单字段排序逻辑（原有逻辑）
    if (currentSort.value === key) {
      if (sortDirection.value === null) {
        sortDirection.value = 'asc'
      } else if (sortDirection.value === 'asc') {
        sortDirection.value = 'desc'
      } else {
        sortDirection.value = null
        currentSort.value = ''
      }
    } else {
      currentSort.value = key
      sortDirection.value = 'asc'
    }
    
    // 清空多字段排序
    sortFields.value = []
  }
  
  // 保存排序状态
  const sortKey = `${getStorageKeyPrefix()}${props.component.id}_currentSort`
  const sortDirectionKey = `${getStorageKeyPrefix()}${props.component.id}_sortDirection`
  
  localStorage.setItem(sortKey, currentSort.value)
  localStorage.setItem(sortDirectionKey, String(sortDirection.value))
  
  // 防抖加载数据
  debouncedLoadPaginatedData()
}

// 处理多字段排序
function handleMultiFieldSort(key: string) {
  const existingIndex = sortFields.value.findIndex(item => item.field === key)
  
  if (existingIndex >= 0) {
    // 字段已存在，切换排序方向或移除
    const existing = sortFields.value[existingIndex]
    if (existing.direction === 'asc') {
      existing.direction = 'desc'
    } else {
      // 移除该字段
      sortFields.value.splice(existingIndex, 1)
    }
  } else {
    // 添加新的排序字段
    sortFields.value.push({ field: key, direction: 'asc' })
  }
  
  // 更新主排序字段（使用第一个排序字段）
  if (sortFields.value.length > 0) {
    currentSort.value = sortFields.value[0].field
    sortDirection.value = sortFields.value[0].direction
  } else {
    currentSort.value = ''
    sortDirection.value = null
  }
}

// 获取排序方向
function getSortDirection(key: string) {
  if (currentSort.value === key) {
    return sortDirection.value
  }
  return null
}

// 改变页码
function changePage(page: number) {
  if (page < 1 || page > paginatedData.value.totalPage) return
  
  console.log('🔧 切换页码:', page, '当前页码:', paginatedData.value.page)
  
  paginatedData.value.page = page
  
  const pageKey = `${getStorageKeyPrefix()}${props.component.id}_currentPage`
  localStorage.setItem(pageKey, String(page))
  
  console.log('🔧 页码已保存到localStorage:', pageKey, '=', page)
  
  // 页码切换立即加载，不需要防抖
  loadPaginatedData()
}

// 计算可见页码列表
const visiblePages = computed(() => {
  const current = paginatedData.value.page
  const total = paginatedData.value.totalPage
  const pages: number[] = []
  
  if (total <= 7) {
    // 总页数少于等于7页，显示所有页码（除了首页和尾页，避免重复）
    for (let i = 2; i < total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7页，智能显示中间页码
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)
    
    for (let i = start; i <= end; i++) {
      if (i !== 1 && i !== total) { // 避免与首页尾页重复
        pages.push(i)
      }
    }
  }
  
  return pages
})

// 是否显示首页
const shouldShowFirstPage = computed(() => {
  return paginatedData.value.totalPage > 0
})

// 是否显示尾页
const shouldShowLastPage = computed(() => {
  return paginatedData.value.totalPage > 1
})

// 是否显示开始省略号
const shouldShowStartEllipsis = computed(() => {
  const current = paginatedData.value.page
  const total = paginatedData.value.totalPage
  return total > 7 && current > 4
})

// 是否显示结束省略号
const shouldShowEndEllipsis = computed(() => {
  const current = paginatedData.value.page
  const total = paginatedData.value.totalPage
  return total > 7 && current < total - 3
})

// 防抖加载分页数据
function debouncedLoadPaginatedData() {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
  
  debounceTimer.value = setTimeout(() => {
    loadPaginatedData()
  }, 300) // 300ms 防抖延迟
}
</script> 