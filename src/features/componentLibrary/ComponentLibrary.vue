<template>
  <div class="bg-white rounded-lg border border-gray-200 h-full flex flex-col">
    <!-- 简洁头部 -->
    <div class="px-4 py-3 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-semibold text-gray-900">组件库</h2>
          <p class="text-sm text-gray-500">拖拽组件到画布开始构建</p>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="px-4 pt-4 pb-2 flex-shrink-0 space-y-3">
      <!-- 搜索框 -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索组件名称或描述..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
        />
        <button
          v-if="searchQuery"
          @click="clearSearch"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <svg class="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 类型筛选器 -->
      <div class="flex items-center space-x-2">
        <span class="text-sm font-medium text-gray-700">类型:</span>
        <div class="flex space-x-1">
          <button
            v-for="category in categories"
            :key="category.key"
            @click="setActiveCategory(category.key)"
            class="px-3 py-1 text-xs font-medium rounded-full transition-all duration-200"
            :class="activeCategory === category.key 
              ? 'bg-blue-100 text-blue-700 border border-blue-200' 
              : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'"
          >
            {{ category.name }}
            <span v-if="category.key !== 'all'" class="ml-1 text-xs opacity-75">
              ({{ getCategoryCount(category.key) }})
            </span>
          </button>
        </div>
      </div>

      <!-- 筛选状态显示 -->
      <div v-if="hasActiveFilters" class="flex items-center justify-between text-xs text-gray-500">
        <span>
          显示 {{ filteredComponents.length }} / {{ componentTypes.length }} 个组件
          <span v-if="searchQuery" class="text-blue-600">
            (搜索: "{{ searchQuery }}")
          </span>
        </span>
        <button
          @click="resetFilters"
          class="text-blue-600 hover:text-blue-700 font-medium"
        >
          重置筛选
        </button>
      </div>
    </div>

    <!-- 组件统计 -->
    <div class="px-4 pb-2 flex-shrink-0">
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
          </div>
          <h3 class="text-sm font-medium text-gray-900">可用组件</h3>
        </div>
        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span class="text-gray-600">当前显示</span>
            <span class="font-medium text-gray-900">{{ filteredComponents.length }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span class="text-gray-600">总数</span>
            <span class="font-medium text-gray-900">{{ componentTypes.length }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 组件列表 - 主要区域 -->
    <div class="flex-1 px-4 pb-2 overflow-y-auto">
      <div class="border border-gray-200 rounded-lg">
        <div class="px-3 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
          <div class="flex items-center space-x-2">
            <div class="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
              <svg class="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
              </svg>
            </div>
            <h3 class="text-sm font-medium text-gray-900">组件列表</h3>
            <div v-if="activeCategory !== 'all'" class="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {{ getCategoryName(activeCategory) }}
            </div>
          </div>
        </div>
        
        <div class="p-3">
          <!-- 组件列表 -->
          <div v-if="filteredComponents.length > 0" class="space-y-2">
            <ComponentLibraryItem
              v-for="componentType in filteredComponents"
              :key="componentType.type"
              :type="componentType.type"
              :name="highlightSearchText(componentType.name)"
              :icon="componentType.icon"
              :description="highlightSearchText(componentType.description)"
            />
          </div>
          
          <!-- 空状态 -->
          <div v-else class="text-center py-8">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">未找到匹配的组件</h4>
            <p class="text-xs text-gray-500 mb-4">
              <span v-if="searchQuery">尝试修改搜索关键词</span>
              <span v-else>当前分类下没有组件</span>
            </p>
            <button
              @click="resetFilters"
              class="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              重置筛选条件
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 拖拽提示 - 底部 -->
    <div class="border-t border-gray-100 px-4 py-4 pb-6 flex-shrink-0">
      <div class="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <div class="flex items-center space-x-2">
          <div class="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
            <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <div>
            <h4 class="text-sm font-medium text-blue-900">拖拽提示</h4>
            <p class="text-xs text-blue-700 mt-1">选择组件拖拽到右侧画布即可添加</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useComponentLibraryStore } from '@/stores/componentLibrary.store'
import ComponentLibraryItem from './ComponentLibraryItem.vue'
import { getAllComponentMetadata } from '@/utils/componentMetadata'

// 状态管理
const componentLibraryStore = useComponentLibraryStore()

// 初始化组件库
onMounted(() => {
  componentLibraryStore.init()
})

// 搜索状态
const searchQuery = ref('')
const activeCategory = ref('all')

// 从统一元数据获取组件类型
const componentTypes = getAllComponentMetadata()

// 分类定义
const categories = [
  { key: 'all', name: '全部' },
  { key: 'input', name: '输入类' },
  { key: 'action', name: '操作类' },
  { key: 'display', name: '展示类' }
]

// 计算属性
const filteredComponents = computed(() => {
  let components = componentLibraryStore.componentTemplates
  
  // 分类筛选
  if (activeCategory.value !== 'all') {
    components = components.filter(comp => comp.category === activeCategory.value)
  }
  
  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    components = components.filter(comp => 
      comp.name.toLowerCase().includes(query) ||
      comp.description.toLowerCase().includes(query) ||
      comp.type.toLowerCase().includes(query)
    )
  }
  
  return components
})

// 计算属性：是否有活动筛选条件
const hasActiveFilters = computed(() => {
  return activeCategory.value !== 'all' || searchQuery.value.trim() !== ''
})

// 获取分类组件数量
function getCategoryCount(categoryKey: string): number {
  if (categoryKey === 'all') return componentLibraryStore.componentTemplates.length
  return componentLibraryStore.componentTemplates.filter(component => component.category === categoryKey).length
}

// 获取分类名称
function getCategoryName(categoryKey: string): string {
  const category = categories.find(cat => cat.key === categoryKey)
  return category?.name || '未知'
}

// 设置活动分类
function setActiveCategory(categoryKey: string) {
  activeCategory.value = categoryKey
}

// 清空搜索
function clearSearch() {
  searchQuery.value = ''
}

// 重置所有筛选条件
function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'all'
}

// 高亮搜索文本
function highlightSearchText(text: string): string {
  if (!searchQuery.value.trim()) return text
  
  const query = searchQuery.value.trim()
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 text-yellow-800 px-1 rounded">$1</mark>')
}
</script> 