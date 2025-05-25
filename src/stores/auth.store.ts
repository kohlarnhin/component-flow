import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 认证配置接口
export interface AuthConfig {
  type: 'none' | 'basic' | 'bearer'
  basicAuth?: {
    username: string
    password: string
  }
}

// 认证Store
export const useAuthStore = defineStore('auth', () => {
  // 基本认证配置
  const basicAuth = ref<{ username: string, password: string } | null>(null)

  // 计算属性
  const hasBasicAuth = computed(() => basicAuth.value !== null)
  
  // 设置Basic认证
  function setBasicAuth(username: string, password: string) {
    basicAuth.value = { username, password }
    console.log('🔐 设置Basic认证:', { username, password: '***' })
  }
  
  // 清除认证
  function clearAuth() {
    basicAuth.value = null
    console.log('🔐 清除认证信息')
  }
  
  // 获取Basic认证头
  function getBasicAuthHeader(): Record<string, string> {
    if (!basicAuth.value) return {}
    
    const { username, password } = basicAuth.value
    const credentials = btoa(`${username}:${password}`)
    return {
      'Authorization': `Basic ${credentials}`
    }
  }
  
  return {
    // 状态
    basicAuth,
    
    // 计算属性
    hasBasicAuth,
    
    // 方法
    setBasicAuth,
    clearAuth,
    getBasicAuthHeader
  }
}) 