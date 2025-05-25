import type { ComponentConfig, ComponentType } from '@/types/global.types'

export interface ComponentTemplate {
  type: ComponentType
  name: string
  icon: string
  description: string
  defaultConfig: ComponentConfig
}

function generateDefaultId(type: ComponentType): string {
  return `${type}_${Date.now()}`
}

export const componentTemplates: ComponentTemplate[] = [
  {
    type: 'text-input',
    name: '文本输入',
    icon: '📝',
    description: '单行文本输入框',
    defaultConfig: {
      id: generateDefaultId('text-input'),
      type: 'text-input',
      label: '文本输入',
      placeholder: '请输入文本',
      required: false,
      disabled: false,
      defaultValue: '',
      maxLength: 100,
      parameterConfig: {
        type: 'json',
        fieldName: 'text_field'
      }
    }
  },
  {
    type: 'password-input',
    name: '密码输入',
    icon: '🔒',
    description: '密码输入框',
    defaultConfig: {
      id: generateDefaultId('password-input'),
      type: 'password-input',
      label: '密码',
      placeholder: '请输入密码',
      required: true,
      disabled: false,
      defaultValue: '',
      maxLength: 50,
      parameterConfig: {
        type: 'json',
        fieldName: 'password'
      }
    }
  },
  {
    type: 'textarea',
    name: '文本域',
    icon: '📄',
    description: '多行文本输入框',
    defaultConfig: {
      id: generateDefaultId('textarea'),
      type: 'textarea',
      label: '文本域',
      placeholder: '请输入多行文本',
      required: false,
      disabled: false,
      defaultValue: '',
      maxLength: 500,
      parameterConfig: {
        type: 'json',
        fieldName: 'content'
      }
    }
  },
  {
    type: 'button',
    name: '按钮',
    icon: '🔘',
    description: '可点击的按钮组件',
    defaultConfig: {
      id: generateDefaultId('button'),
      type: 'button',
      label: '请求按钮',
      text: '发送请求',
      disabled: false,
      requestUrl: '',
      requestMethod: 'GET',
      confirmText: ''
    }
  },
  {
    type: 'data-list',
    name: '数据列表',
    icon: '📊',
    description: '可排序分页的数据表格',
    defaultConfig: {
      id: generateDefaultId('data-list'),
      type: 'data-list',
      label: '数据列表',
      apiUrl: '',
      columns: [
        { key: 'id', title: 'ID', sortable: true },
        { key: 'name', title: '名称', sortable: true },
        { key: 'status', title: '状态', sortable: false }
      ],
      pageSize: 10
    }
  },
  {
    type: 'response-display',
    name: '响应展示',
    icon: '📺',
    description: '展示API响应数据',
    defaultConfig: {
      id: generateDefaultId('response-display'),
      type: 'response-display',
      label: '响应展示',
      format: 'json'
    }
  },
  {
    type: 'multiline-text',
    name: '多行文本输入',
    icon: '📝',
    description: '支持数组输入的多行文本框',
    defaultConfig: {
      id: generateDefaultId('multiline-text'),
      type: 'multiline-text',
      label: '多行文本输入',
      placeholder: '每行输入一个值',
      required: false,
      disabled: false,
      parameterConfig: {
        type: 'json',
        fieldName: 'array_field'
      }
    }
  },
  {
    type: 'boolean-select',
    name: '是否选择器',
    icon: '☑️',
    description: '布尔值选择组件',
    defaultConfig: {
      id: generateDefaultId('boolean-select'),
      type: 'boolean-select',
      label: '是否选择器',
      required: false,
      disabled: false,
      defaultValue: null,
      trueLabel: '是',
      falseLabel: '否',
      nullLabel: '未选择',
      allowNull: true,
      parameterConfig: {
        type: 'json',
        fieldName: 'enabled'
      }
    }
  },
  {
    type: 'paginated-table',
    name: '分页表格',
    icon: '📋',
    description: '支持分页和排序的数据表格',
    defaultConfig: {
      id: generateDefaultId('paginated-table'),
      type: 'paginated-table',
      label: '分页表格',
      apiUrl: '',
      columns: [
        { key: 'id', title: 'ID', sortable: true },
        { key: 'name', title: '名称', sortable: true },
        { key: 'status', title: '状态', sortable: false }
      ],
      pageSize: 10,
      searchFields: ['name'],
      sortableFields: ['id', 'name']
    }
  }
]

export function getTemplateByType(type: ComponentType): ComponentTemplate | undefined {
  return componentTemplates.find(template => template.type === type)
}

export function createComponentConfig(type: ComponentType): ComponentConfig {
  const template = getTemplateByType(type)
  if (!template) {
    throw new Error(`未找到类型为 ${type} 的组件模板`)
  }
  
  return {
    ...template.defaultConfig,
    id: generateDefaultId(type)
  }
} 