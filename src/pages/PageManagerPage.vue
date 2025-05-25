<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white border-b border-gray-200 px-6 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between 2xl:max-w-full 2xl:px-2">
        <div class="flex items-center space-x-4">
          <h1 class="text-2xl font-bold text-gray-900">我的页面</h1>
          <span class="text-sm text-gray-500">管理所有保存的页面</span>
        </div>
        
        <div class="flex items-center space-x-4">
          <button
            @click="goBack"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            返回主页
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="max-w-7xl mx-auto px-6 py-6 2xl:max-w-full 2xl:px-8">
      <PageManagerContent />
    </main>
  </div>
</template>

<script setup lang="ts">
import PageManagerContent from '@/features/pageManager/PageManagerContent.vue'

// 返回主页
function goBack() {
  window.close()
}
</script> 