import type { ComponentType } from '@/types/global.types'

// 组件元数据接口
export interface ComponentMetadata {
  type: ComponentType
  name: string
  description: string
  category: 'input' | 'action' | 'display'
  icon: ComponentType // 使用组件类型作为图标标识
}

// 组件元数据配置
export const COMPONENT_METADATA: Record<ComponentType, ComponentMetadata> = {
  'text-input': {
    type: 'text-input',
    name: '文本输入',
    description: '单行文本输入框',
    category: 'input',
    icon: 'text-input'
  },
  'password-input': {
    type: 'password-input',
    name: '密码输入',
    description: '密码输入框',
    category: 'input',
    icon: 'password-input'
  },
  'textarea': {
    type: 'textarea',
    name: '文本域',
    description: '多行文本输入框',
    category: 'input',
    icon: 'textarea'
  },
  'multiline-text': {
    type: 'multiline-text',
    name: '多行文本输入',
    description: '支持数组输入的多行文本框',
    category: 'input',
    icon: 'multiline-text'
  },
  'boolean-select': {
    type: 'boolean-select',
    name: '是否选择器',
    description: '布尔值选择组件',
    category: 'input',
    icon: 'boolean-select'
  },
  'button': {
    type: 'button',
    name: '请求按钮',
    description: 'API请求触发按钮',
    category: 'action',
    icon: 'button'
  },
  'data-list': {
    type: 'data-list',
    name: '数据列表',
    description: '数据展示列表',
    category: 'display',
    icon: 'data-list'
  },
  'paginated-table': {
    type: 'paginated-table',
    name: '分页表格',
    description: '支持分页和排序的数据表格',
    category: 'display',
    icon: 'paginated-table'
  },
  'response-display': {
    type: 'response-display',
    name: '响应展示',
    description: 'API响应结果展示',
    category: 'display',
    icon: 'response-display'
  }
}

// 工具函数：获取组件类型名称
export function getComponentTypeName(type: ComponentType): string {
  return COMPONENT_METADATA[type]?.name || '未知组件'
}

// 工具函数：获取组件描述
export function getComponentDescription(type: ComponentType): string {
  return COMPONENT_METADATA[type]?.description || '未知组件描述'
}

// 工具函数：获取组件分类
export function getComponentCategory(type: ComponentType): string {
  const categoryMap = {
    'input': '输入类',
    'action': '操作类',
    'display': '展示类'
  }
  const category = COMPONENT_METADATA[type]?.category
  return category ? categoryMap[category] : '未知分类'
}

// 工具函数：获取组件元数据
export function getComponentMetadata(type: ComponentType): ComponentMetadata | null {
  return COMPONENT_METADATA[type] || null
}

// 工具函数：获取所有组件元数据
export function getAllComponentMetadata(): ComponentMetadata[] {
  return Object.values(COMPONENT_METADATA)
}

// 工具函数：按分类获取组件
export function getComponentsByCategory(category: 'input' | 'action' | 'display'): ComponentMetadata[] {
  return Object.values(COMPONENT_METADATA).filter(meta => meta.category === category)
} 