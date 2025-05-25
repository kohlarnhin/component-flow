import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  persistent?: boolean
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([])

  function addNotification(notification: Omit<Notification, 'id'>) {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const newNotification: Notification = {
      id,
      duration: 4000,
      ...notification
    }
    
    notifications.value.push(newNotification)
    
    // 自动移除通知
    if (!newNotification.persistent) {
      setTimeout(() => {
        removeNotification(id)
      }, newNotification.duration)
    }
    
    return id
  }

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  // 便捷方法
  function success(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'success', title, message, duration })
  }

  function error(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'error', title, message, duration: duration || 6000 })
  }

  function warning(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'warning', title, message, duration })
  }

  function info(title: string, message?: string, duration?: number) {
    return addNotification({ type: 'info', title, message, duration })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
}) 