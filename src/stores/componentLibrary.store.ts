import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { componentService, statsService } from '@/utils/database'
import type { ComponentTemplate } from '@/components/userComponents/templates/componentTemplates'

// Extended template interface with category
interface ExtendedComponentTemplate extends ComponentTemplate {
  category?: string
}

export const useComponentLibraryStore = defineStore('componentLibrary', () => {
  // 状态
  const components = ref<Array<{
    id: number
    component_id: string
    name: string
    type: string
    icon: string
    description: string
    category: string
    config: any
    is_system: boolean
    created_at: string
    updated_at: string
  }>>([])
  
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const componentTemplates = computed((): ExtendedComponentTemplate[] => {
    return components.value.map(comp => ({
      type: comp.type as any,
      name: comp.name,
      icon: comp.icon,
      description: comp.description,
      defaultConfig: comp.config,
      category: comp.category
    }))
  })

  const categorizedComponents = computed(() => {
    const categories: Record<string, ExtendedComponentTemplate[]> = {}
    
    componentTemplates.value.forEach(comp => {
      const category = comp.category || 'other'
      if (!categories[category]) {
        categories[category] = []
      }
      categories[category].push(comp)
    })
    
    return categories
  })

  const systemComponents = computed(() => 
    components.value.filter(comp => comp.is_system)
  )

  const customComponents = computed(() => 
    components.value.filter(comp => !comp.is_system)
  )

  // 操作方法
  async function loadComponents() {
    try {
      loading.value = true
      error.value = null
      components.value = await componentService.getAllComponents()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载组件失败'
      console.error('加载组件失败:', err)
    } finally {
      loading.value = false
    }
  }

  async function addCustomComponent(componentData: {
    component_id: string
    name: string
    type: string
    icon?: string
    description?: string
    category?: string
    config: any
  }) {
    try {
      loading.value = true
      error.value = null
      
      const result = await componentService.addComponent(componentData)
      console.log('组件添加成功:', result)
      
      // 重新加载组件列表
      await loadComponents()
      
      return result.lastInsertRowid
    } catch (err) {
      error.value = err instanceof Error ? err.message : '添加组件失败'
      console.error('添加组件失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateComponent(id: number, componentData: Partial<{
    name: string
    icon: string
    description: string
    category: string
    config: any
  }>) {
    try {
      loading.value = true
      error.value = null
      
      await componentService.updateComponent(id, componentData)
      
      // 重新加载组件列表
      await loadComponents()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新组件失败'
      console.error('更新组件失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteComponent(id: number) {
    try {
      loading.value = true
      error.value = null
      
      await componentService.deleteComponent(id)
      
      // 重新加载组件列表
      await loadComponents()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除组件失败'
      console.error('删除组件失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function getComponentByType(type: string) {
    return components.value.find(comp => comp.type === type)
  }

  async function recordComponentUsage(componentId: string) {
    try {
      await statsService.recordComponentUsage(componentId)
    } catch (err) {
      console.warn('记录组件使用失败:', err)
    }
  }

  // 搜索组件
  function searchComponents(keyword: string) {
    if (!keyword.trim()) {
      return componentTemplates.value
    }
    
    const lowerKeyword = keyword.toLowerCase()
    return componentTemplates.value.filter(comp => 
      comp.name.toLowerCase().includes(lowerKeyword) ||
      comp.description.toLowerCase().includes(lowerKeyword) ||
      comp.type.toLowerCase().includes(lowerKeyword)
    )
  }

  // 根据分类获取组件
  function getComponentsByCategory(category: string) {
    return components.value.filter(comp => comp.category === category)
  }

  // 获取所有分类
  const categories = computed(() => {
    const cats = new Set(components.value.map(comp => comp.category))
    return Array.from(cats).sort()
  })

  // 初始化
  async function init() {
    await loadComponents()
  }

  return {
    // 状态
    components,
    loading,
    error,
    
    // 计算属性
    componentTemplates,
    categorizedComponents,
    systemComponents,
    customComponents,
    categories,
    
    // 方法
    loadComponents,
    addCustomComponent,
    updateComponent,
    deleteComponent,
    getComponentByType,
    recordComponentUsage,
    searchComponents,
    getComponentsByCategory,
    init
  }
}) 