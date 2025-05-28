// HTTP API-based database implementation
// This connects to the Node.js backend with SQLite database

import type { ComponentConfig, CanvasComponent, ExampleConfig, ComponentDocumentation, SavedPage } from '@/types/global.types'

// API 基础配置
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : 'http://localhost:3001'

// HTTP 请求工具函数
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}/api${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(errorData.error || `HTTP ${response.status}`)
  }

  return response.json()
}

// 数据库接口类型定义
interface DatabaseComponent {
  id: number
  component_id: string
  name: string
  type: string
  icon: string
  description: string
  category: string
  config: ComponentConfig
  is_system: boolean
  created_at: string
  updated_at: string
}

interface DatabasePage {
  id: number
  name: string
  description: string
  components: CanvasComponent[]
  thumbnail?: string
  is_public: boolean
  created_at: string
  updated_at: string
  tags?: string[]
}

interface ComponentStats {
  id: number
  component_id: string
  usage_count: number
  last_used_at: string
  name?: string
  type?: string
  icon?: string
}

// 初始化函数 (HTTP版本不需要特殊初始化)
export function initDatabase() {
  console.log('HTTP API 数据库客户端初始化完成')
  return { 
    close: () => console.log('HTTP API 客户端无需关闭连接') 
  }
}

// 组件库相关操作
export const componentService = {
  // 获取所有组件
  async getAllComponents(): Promise<DatabaseComponent[]> {
    try {
      return await apiRequest<DatabaseComponent[]>('/components')
    } catch (error) {
      console.error('获取组件失败:', error)
      return []
    }
  },
  
  // 根据类型获取组件
  async getComponentsByType(type: string): Promise<DatabaseComponent[]> {
    try {
      return await apiRequest<DatabaseComponent[]>(`/components/type/${encodeURIComponent(type)}`)
    } catch (error) {
      console.error('获取组件失败:', error)
      return []
    }
  },
  
  // 添加自定义组件
  async addComponent(componentData: {
    component_id: string
    name: string
    type: string
    icon?: string
    description?: string
    category?: string
    config: ComponentConfig
  }): Promise<{ lastInsertRowid: number }> {
    try {
      const result = await apiRequest<{ id: number }>('/components', {
        method: 'POST',
        body: JSON.stringify(componentData)
      })
      return { lastInsertRowid: result.id }
    } catch (error) {
      console.error('添加组件失败:', error)
      throw error
    }
  },
  
  // 更新组件
  async updateComponent(id: number, componentData: Partial<{
    name: string
    icon: string
    description: string
    category: string
    config: ComponentConfig
  }>): Promise<{ changes: number }> {
    try {
      await apiRequest<{ success: boolean }>(`/components/${id}`, {
        method: 'PUT',
        body: JSON.stringify(componentData)
      })
      return { changes: 1 }
    } catch (error) {
      console.error('更新组件失败:', error)
      if (error instanceof Error && error.message.includes('404')) {
        return { changes: 0 }
      }
      throw error
    }
  },
  
  // 删除自定义组件
  async deleteComponent(id: number): Promise<{ changes: number }> {
    try {
      await apiRequest<{ success: boolean }>(`/components/${id}`, {
        method: 'DELETE'
      })
      return { changes: 1 }
    } catch (error) {
      console.error('删除组件失败:', error)
      if (error instanceof Error && error.message.includes('404')) {
        return { changes: 0 }
      }
      throw error
    }
  },

  // 获取组件详细信息（用于文档）
  async getComponentInfo(id: string): Promise<ComponentDocumentation | null> {
    try {
      return await apiRequest<ComponentDocumentation>(`/components/${id}/info`)
    } catch (error) {
      console.error('获取组件信息失败:', error)
      return null
    }
  }
}

// 页面相关操作
export const pageService = {
  // 转换数据库页面格式为前端格式
  formatPageData(dbPage: DatabasePage): SavedPage {
    return {
      id: dbPage.id,
      name: dbPage.name,
      description: dbPage.description,
      components: dbPage.components,
      thumbnail: dbPage.thumbnail,
      is_public: dbPage.is_public,
      createdAt: dbPage.created_at,
      updatedAt: dbPage.updated_at,
      tags: dbPage.tags
    }
  },

  // 获取所有页面
  async getAllPages(): Promise<SavedPage[]> {
    try {
      const dbPages = await apiRequest<DatabasePage[]>('/pages')
      return dbPages.map(page => this.formatPageData(page))
    } catch (error) {
      console.error('获取页面列表失败:', error)
      throw error
    }
  },
  
  // 根据ID获取页面
  async getPageById(id: number): Promise<SavedPage | null> {
    try {
      const dbPage = await apiRequest<DatabasePage>(`/pages/${id}`)
      return this.formatPageData(dbPage)
    } catch (error) {
      console.error('获取页面失败:', error)
      if (error instanceof Error && error.message.includes('404')) {
        return null
      }
      throw error
    }
  },
  
  // 保存页面
  async savePage(pageData: {
    name: string
    description?: string
    components: CanvasComponent[]
    thumbnail?: string
    is_public?: boolean
    tags?: string[]
  }): Promise<number> {
    try {
      const result = await apiRequest<{ id: number }>('/pages', {
        method: 'POST',
        body: JSON.stringify(pageData)
      })
      return result.id
    } catch (error) {
      console.error('保存页面失败:', error)
      throw error
    }
  },
  
  // 更新页面
  async updatePage(id: number, pageData: Partial<{
    name: string
    description: string
    components: CanvasComponent[]
    thumbnail: string
    is_public: boolean
    tags: string[]
  }>): Promise<{ changes: number }> {
    try {
      await apiRequest<{ success: boolean }>(`/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(pageData)
      })
      return { changes: 1 }
    } catch (error) {
      console.error('更新页面失败:', error)
      if (error instanceof Error && error.message.includes('404')) {
        return { changes: 0 }
      }
      throw error
    }
  },
  
  // 删除页面
  async deletePage(id: number): Promise<{ changes: number }> {
    try {
      await apiRequest<{ success: boolean }>(`/pages/${id}`, {
        method: 'DELETE'
      })
      return { changes: 1 }
    } catch (error) {
      console.error('删除页面失败:', error)
      if (error instanceof Error && error.message.includes('404')) {
        return { changes: 0 }
      }
      throw error
    }
  },
  
  // 搜索页面
  async searchPages(keyword: string): Promise<SavedPage[]> {
    try {
      if (!keyword.trim()) {
        return await this.getAllPages()
      }
      const dbPages = await apiRequest<DatabasePage[]>(`/pages/search/${encodeURIComponent(keyword)}`)
      return dbPages.map(page => this.formatPageData(page))
    } catch (error) {
      console.error('搜索页面失败:', error)
      return []
    }
  }
}

// 统计相关操作
export const statsService = {
  // 记录组件使用
  async recordComponentUsage(componentId: string): Promise<{ changes: number }> {
    try {
      await apiRequest<{ success: boolean }>('/stats/usage', {
        method: 'POST',
        body: JSON.stringify({ component_id: componentId })
      })
      return { changes: 1 }
    } catch (error) {
      console.error('记录组件使用失败:', error)
      throw error
    }
  },
  
  // 获取组件使用统计
  async getComponentStats(): Promise<ComponentStats[]> {
    try {
      return await apiRequest<ComponentStats[]>('/stats/components')
    } catch (error) {
      console.error('获取组件统计失败:', error)
      return []
    }
  }
}

// 获取数据库实例 (HTTP版本返回空对象)
export function getDatabase() {
  return {
    close: () => console.log('HTTP API 客户端无需关闭连接')
  }
}

// 关闭数据库连接 (HTTP版本无需操作)
export function closeDatabase() {
  console.log('HTTP API 客户端无需关闭连接')
}

// 示例配置服务
export const exampleService = {
  // 获取所有示例配置
  async getAllExamples(): Promise<ExampleConfig[]> {
    try {
      return await apiRequest<ExampleConfig[]>('/examples')
    } catch (error) {
      console.error('获取示例配置失败:', error)
      throw error
    }
  },

  // 根据分类获取示例配置
  async getExamplesByCategory(category: string): Promise<ExampleConfig[]> {
    try {
      return await apiRequest<ExampleConfig[]>(`/examples/category/${category}`)
    } catch (error) {
      console.error('获取分类示例配置失败:', error)
      throw error
    }
  },

  // 获取单个示例配置
  async getExampleById(id: number): Promise<ExampleConfig | null> {
    try {
      return await apiRequest<ExampleConfig>(`/examples/${id}`)
    } catch (error) {
      console.error('获取示例配置失败:', error)
      return null
    }
  },

  // 保存示例配置
  async saveExample(exampleData: {
    name: string
    description?: string
    category?: string
    components: CanvasComponent[]
    icon?: string
  }): Promise<number> {
    try {
      const result = await apiRequest<{ id: number }>('/examples', {
        method: 'POST',
        body: JSON.stringify(exampleData)
      })
      return result.id
    } catch (error) {
      console.error('保存示例配置失败:', error)
      throw error
    }
  },

  // 更新示例配置
  async updateExample(id: number, exampleData: {
    name?: string
    description?: string
    category?: string
    components?: CanvasComponent[]
    icon?: string
  }): Promise<void> {
    try {
      await apiRequest(`/examples/${id}`, {
        method: 'PUT',
        body: JSON.stringify(exampleData)
      })
    } catch (error) {
      console.error('更新示例配置失败:', error)
      throw error
    }
  },

  // 删除示例配置
  async deleteExample(id: number): Promise<void> {
    try {
      await apiRequest(`/examples/${id}`, {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('删除示例配置失败:', error)
      throw error
    }
  }
} 