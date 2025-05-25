import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CanvasComponent, ComponentConfig } from '@/types/global.types'

export const useCanvasStore = defineStore('canvas', () => {
  // 状态
  const components = ref<CanvasComponent[]>([])
  const selectedComponentId = ref<string | null>(null)
  
  // 计算属性
  const selectedComponent = computed(() => {
    if (!selectedComponentId.value) return null
    return components.value.find(c => c.id === selectedComponentId.value) || null
  })
  
  const hasComponents = computed(() => components.value.length > 0)
  
  // 操作方法
  function addComponent(config: ComponentConfig) {
    const newComponent: CanvasComponent = {
      id: generateId(),
      config,
      order: components.value.length
    }
    components.value.push(newComponent)
    selectedComponentId.value = newComponent.id
  }
  
  function removeComponent(id: string) {
    const index = components.value.findIndex(c => c.id === id)
    if (index > -1) {
      components.value.splice(index, 1)
      // 重新排序
      components.value.forEach((c, i) => {
        c.order = i
      })
      // 清除选择
      if (selectedComponentId.value === id) {
        selectedComponentId.value = null
      }
    }
  }
  
  function updateComponent(id: string, config: ComponentConfig) {
    const component = components.value.find(c => c.id === id)
    if (component) {
      component.config = { ...config }
    }
  }
  
  function selectComponent(id: string | null) {
    selectedComponentId.value = id
  }
  
  function moveComponent(fromIndex: number, toIndex: number) {
    if (fromIndex < 0 || fromIndex >= components.value.length ||
        toIndex < 0 || toIndex >= components.value.length) {
      return
    }
    
    const [movedComponent] = components.value.splice(fromIndex, 1)
    components.value.splice(toIndex, 0, movedComponent)
    
    // 重新排序
    components.value.forEach((c, i) => {
      c.order = i
    })
  }
  
  function clearCanvas() {
    components.value = []
    selectedComponentId.value = null
  }
  
  function loadComponents(newComponents: CanvasComponent[]) {
    components.value = [...newComponents]
    selectedComponentId.value = null
  }
  
  // 导出配置
  function exportConfig() {
    return {
      components: components.value.map(c => ({
        id: c.id,
        config: c.config,
        order: c.order
      }))
    }
  }
  
  // 导入配置
  function importConfig(config: { components: CanvasComponent[] }) {
    if (config.components && Array.isArray(config.components)) {
      loadComponents(config.components)
    }
  }
  
  // 工具函数
  function generateId(): string {
    return 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  return {
    // 状态
    components,
    selectedComponentId,
    
    // 计算属性
    selectedComponent,
    hasComponents,
    
    // 方法
    addComponent,
    removeComponent,
    updateComponent,
    selectComponent,
    moveComponent,
    clearCanvas,
    loadComponents,
    exportConfig,
    importConfig
  }
}) 