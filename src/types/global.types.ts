// 组件类型枚举
export type ComponentType = 'text-input' | 'password-input' | 'textarea' | 'button' | 'data-list' | 'response-display' | 'multiline-text' | 'boolean-select' | 'paginated-table'

// 参数类型枚举
export type ParameterType = 'query' | 'json' | 'form' | 'path' | 'header' | 'urlencoded' | 'basic-auth' | 'none'

// 参数配置接口
export interface ParameterConfig {
  type: ParameterType // 参数类型
  fieldName: string // 字段名（API参数key）
  path?: string // 嵌套路径，如 'user.profile.name'
}

// 基础组件配置接口
export interface BaseComponentConfig {
  id: string
  type: ComponentType
  label: string // 显示名称
  placeholder?: string
  required?: boolean
  disabled?: boolean
  // 新增：参数配置
  parameterConfig?: ParameterConfig
}

// 认证配置接口
export interface AuthConfig {
  type: 'none' | 'basic' | 'bearer'
  basicAuth?: {
    username: string
    password: string
  }
}

// 按钮组件配置（简化）
export interface ButtonConfig extends BaseComponentConfig {
  type: 'button'
  text: string
  // 简化的请求配置
  requestUrl?: string
  requestMethod?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  confirmText?: string
  // 认证配置
  authConfig?: AuthConfig
  // 移除复杂的参数绑定配置
}

// 输入组件配置
export interface InputConfig extends BaseComponentConfig {
  type: 'text-input' | 'password-input' | 'textarea'
  defaultValue?: string
  maxLength?: number
}

// 数据列表配置
export interface DataListConfig extends BaseComponentConfig {
  type: 'data-list'
  apiUrl?: string
  columns: Array<{
    key: string
    title: string
    sortable?: boolean
  }>
  pageSize?: number
}

// 响应展示配置
export interface ResponseDisplayConfig extends BaseComponentConfig {
  type: 'response-display'
  format?: 'json' | 'text' | 'table'
}

// 多行文本输入配置
export interface MultilineTextConfig extends BaseComponentConfig {
  type: 'multiline-text'
}

// 布尔选择器配置
export interface BooleanSelectConfig extends BaseComponentConfig {
  type: 'boolean-select'
  defaultValue?: boolean | null
  trueLabel?: string // true状态的显示文本
  falseLabel?: string // false状态的显示文本
  nullLabel?: string // null状态的显示文本
  allowNull?: boolean // 是否允许null值
}

// 分页表格配置
export interface PaginatedTableConfig extends BaseComponentConfig {
  type: 'paginated-table'
  apiUrl?: string
  columns: Array<{
    key: string
    title: string
    sortable?: boolean
  }>
  pageSize?: number
  searchFields?: string[] // 支持搜索的字段
  sortableFields?: string[] // 支持排序的字段
}

// 联合类型
export type ComponentConfig = ButtonConfig | InputConfig | DataListConfig | ResponseDisplayConfig | MultilineTextConfig | BooleanSelectConfig | PaginatedTableConfig

// 画布组件
export interface CanvasComponent {
  id: string
  config: ComponentConfig
  order: number
}

// 已保存的页面
export interface SavedPage {
  id: number
  name: string
  description?: string
  components: CanvasComponent[]
  thumbnail?: string
  createdAt: string
  updatedAt: string
  tags?: string[]
  is_public?: boolean
}

// API响应
export interface ApiResponse {
  id: string
  timestamp: string
  url: string
  method: string
  status: number
  data: any
  error?: string
  requestParams?: {
    headers: Record<string, string>
    body: any
    parameters: CollectedParameters
  }
}

// 收集到的参数数据
export interface CollectedParameters {
  query: Record<string, any>
  json: Record<string, any>
  form: Record<string, any>
  path: Record<string, any>
  header: Record<string, any>
  urlencoded: Record<string, any>
  basicAuth: Record<string, any>
}

// 示例配置接口
export interface ExampleConfig {
  id: number
  name: string
  description?: string
  category: string
  components: CanvasComponent[]
  icon?: string
  isSystem: boolean
  createdAt: string
}

// 组件属性文档
export interface ComponentProperty {
  name: string
  type: string
  description: string
}

// 组件示例
export interface ComponentExample {
  name: string
  config: any
}

// 组件文档
export interface ComponentDocumentation {
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
  usage_count: number
  last_used_at?: string
  documentation: {
    title: string
    description: string
    properties: ComponentProperty[]
    usage: string
    examples: ComponentExample[]
    currentConfig: any
  }
} 