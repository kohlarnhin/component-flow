<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-50 space-y-2">
      <TransitionGroup
        name="toast"
        tag="div"
        class="space-y-2"
      >
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          class="toast-item"
          :class="getToastClasses(notification.type)"
        >
          <div class="flex items-start space-x-3">
            <!-- 图标 -->
            <div class="flex-shrink-0 mt-0.5">
              <svg v-if="notification.type === 'success'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else-if="notification.type === 'error'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else-if="notification.type === 'warning'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
            </div>
            
            <!-- 内容 -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium">{{ notification.title }}</p>
              <p v-if="notification.message" class="text-sm opacity-90 mt-1">{{ notification.message }}</p>
            </div>
            
            <!-- 关闭按钮 -->
            <button
              @click="notificationStore.removeNotification(notification.id)"
              class="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification.store'

const notificationStore = useNotificationStore()

function getToastClasses(type: string) {
  const baseClasses = 'max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
  
  switch (type) {
    case 'success':
      return `${baseClasses} border-l-4 border-green-400 text-green-800`
    case 'error':
      return `${baseClasses} border-l-4 border-red-400 text-red-800`
    case 'warning':
      return `${baseClasses} border-l-4 border-yellow-400 text-yellow-800`
    case 'info':
      return `${baseClasses} border-l-4 border-blue-400 text-blue-800`
    default:
      return `${baseClasses} border-l-4 border-gray-400 text-gray-800`
  }
}
</script>

<style scoped>
.toast-item {
  @apply p-4;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style> 