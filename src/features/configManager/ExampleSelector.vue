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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- OAuth2登录示例 -->
          <div 
            @click="selectExample('oauth-login')"
            class="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  OAuth2登录示例
                </h3>
                <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                  完整的OAuth2密码模式登录流程，包含用户名密码输入、Basic认证配置、登录按钮和响应展示。
                  适合学习API认证和表单提交功能。
                </p>
                <div class="mt-4">
                  <div class="text-xs text-gray-500 mb-2">包含组件：</div>
                  <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      <ComponentIcon type="text-input" class="w-3 h-3 mr-1" />
                      用户名输入
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      <ComponentIcon type="password-input" class="w-3 h-3 mr-1" />
                      密码输入
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      <ComponentIcon type="button" class="w-3 h-3 mr-1" />
                      登录按钮
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      <ComponentIcon type="response-display" class="w-3 h-3 mr-1" />
                      响应展示
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">组件数量: 8个</span>
                <span class="text-blue-600 font-medium group-hover:text-blue-700">点击选择 →</span>
              </div>
            </div>
          </div>

          <!-- 分页表格示例 -->
          <div 
            @click="selectExample('paginated-table')"
            class="group cursor-pointer bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all duration-300"
          >
            <div class="flex items-start space-x-4">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18m-9-4v8m-7 0V4a1 1 0 011-1h3m0 0h3m0 0h3m0 0a1 1 0 011 1v16a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                  分页表格示例
                </h3>
                <p class="text-sm text-gray-600 mt-2 leading-relaxed">
                  泡茶配方管理示例，展示完整的分页表格功能。包含编号名称搜索、物料编号筛选、启用状态选择和数据表格展示。
                  支持排序、分页和多条件搜索。
                </p>
                <div class="mt-4">
                  <div class="text-xs text-gray-500 mb-2">包含组件：</div>
                  <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                      <ComponentIcon type="text-input" class="w-3 h-3 mr-1" />
                      编号名称搜索
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                      <ComponentIcon type="multiline-text" class="w-3 h-3 mr-1" />
                      物料编号列表
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                      <ComponentIcon type="boolean-select" class="w-3 h-3 mr-1" />
                      启用状态选择
                    </span>
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700 border border-green-200">
                      <ComponentIcon type="paginated-table" class="w-3 h-3 mr-1" />
                      泡茶配方表格
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-4 border-t border-gray-100">
              <div class="flex items-center justify-between text-sm">
                <span class="text-gray-500">组件数量: 4个</span>
                <span class="text-green-600 font-medium group-hover:text-green-700">点击选择 →</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
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
import ComponentIcon from '@/components/ComponentIcon.vue'

// 事件定义
interface Emits {
  close: []
  select: [exampleType: 'oauth-login' | 'paginated-table']
}

const emit = defineEmits<Emits>()

// 选择示例
function selectExample(exampleType: 'oauth-login' | 'paginated-table') {
  emit('select', exampleType)
}
</script> 