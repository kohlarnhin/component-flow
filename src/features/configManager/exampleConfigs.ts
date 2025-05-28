import { createComponentConfig } from '@/components/userComponents/templates/componentTemplates'
import type { CanvasComponent } from '@/types/global.types'

// 生成唯一ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// OAuth2登录示例配置
export function createOAuthLoginExample(): CanvasComponent[] {
  const components: CanvasComponent[] = []

  // 1. 用户名输入框
  const usernameConfig = createComponentConfig('text-input')
  usernameConfig.label = '用户名'
  usernameConfig.placeholder = '请输入用户名（如：sky_test）'
  if ('defaultValue' in usernameConfig) {
    usernameConfig.defaultValue = 'sky_test'
  }
  usernameConfig.required = true
  if ('parameterConfig' in usernameConfig) {
    usernameConfig.parameterConfig = {
      type: 'form',
      fieldName: 'username'
    }
  }
  components.push({
    id: generateId(),
    config: usernameConfig,
    order: 0
  })

  // 2. 密码输入框
  const passwordConfig = createComponentConfig('password-input')
  passwordConfig.label = '密码'
  passwordConfig.placeholder = '请输入密码（如：123456）'
  if ('defaultValue' in passwordConfig) {
    passwordConfig.defaultValue = '123456'
  }
  passwordConfig.required = true
  if ('parameterConfig' in passwordConfig) {
    passwordConfig.parameterConfig = {
      type: 'form',
      fieldName: 'password'
    }
  }
  components.push({
    id: generateId(),
    config: passwordConfig,
    order: 1
  })

  // 3. grant_type字段
  const grantTypeConfig = createComponentConfig('text-input')
  grantTypeConfig.label = 'Grant Type'
  if ('defaultValue' in grantTypeConfig) {
    grantTypeConfig.defaultValue = 'password'
  }
  grantTypeConfig.disabled = true
  if ('parameterConfig' in grantTypeConfig) {
    grantTypeConfig.parameterConfig = {
      type: 'form',
      fieldName: 'grant_type'
    }
  }
  components.push({
    id: generateId(),
    config: grantTypeConfig,
    order: 2
  })

  // 4. scope字段
  const scopeConfig = createComponentConfig('text-input')
  scopeConfig.label = 'Scope'
  if ('defaultValue' in scopeConfig) {
    scopeConfig.defaultValue = 'all'
  }
  scopeConfig.disabled = true
  if ('parameterConfig' in scopeConfig) {
    scopeConfig.parameterConfig = {
      type: 'form',
      fieldName: 'scope'
    }
  }
  components.push({
    id: generateId(),
    config: scopeConfig,
    order: 3
  })

  // 5. Basic认证用户名
  const basicUsernameConfig = createComponentConfig('text-input')
  basicUsernameConfig.label = 'Basic认证用户名'
  if ('defaultValue' in basicUsernameConfig) {
    basicUsernameConfig.defaultValue = 'sky_client'
  }
  basicUsernameConfig.disabled = true
  if ('parameterConfig' in basicUsernameConfig) {
    basicUsernameConfig.parameterConfig = {
      type: 'header',
      fieldName: 'Authorization',
      path: 'basic.username'
    }
  }
  components.push({
    id: generateId(),
    config: basicUsernameConfig,
    order: 4
  })

  // 6. Basic认证密码
  const basicPasswordConfig = createComponentConfig('password-input')
  basicPasswordConfig.label = 'Basic认证密码'
  if ('defaultValue' in basicPasswordConfig) {
    basicPasswordConfig.defaultValue = 'sky_secret'
  }
  basicPasswordConfig.disabled = true
  if ('parameterConfig' in basicPasswordConfig) {
    basicPasswordConfig.parameterConfig = {
      type: 'header',
      fieldName: 'Authorization',
      path: 'basic.password'
    }
  }
  components.push({
    id: generateId(),
    config: basicPasswordConfig,
    order: 5
  })

  // 7. 登录按钮
  const buttonConfig = createComponentConfig('button')
  if ('text' in buttonConfig) {
    buttonConfig.text = 'OAuth2登录'
    buttonConfig.requestUrl = 'http://localhost:8080/oauth/token'
    buttonConfig.requestMethod = 'POST'
    buttonConfig.confirmText = '确定要进行OAuth2登录吗？'
  }
  components.push({
    id: generateId(),
    config: buttonConfig,
    order: 6
  })

  // 8. 响应展示
  const responseConfig = createComponentConfig('response-display')
  responseConfig.label = 'OAuth2登录响应'
  if ('format' in responseConfig) {
    responseConfig.format = 'json'
  }
  components.push({
    id: generateId(),
    config: responseConfig,
    order: 7
  })

  return components
}

// 分页表格示例配置
export function createPaginatedTableExample(): CanvasComponent[] {
  const components: CanvasComponent[] = []

  // 1. Authorization Token输入
  const tokenConfig = createComponentConfig('text-input')
  tokenConfig.label = 'Authorization Token'
  tokenConfig.placeholder = '请输入Bearer token（如：Bearer eyJhbGciOiJIUzI1NiIs...）'
  tokenConfig.required = false
  if ('parameterConfig' in tokenConfig) {
    tokenConfig.parameterConfig = {
      type: 'header',
      fieldName: 'authorization'
    }
  }
  components.push({
    id: generateId(),
    config: tokenConfig,
    order: 0
  })

  // 2. 编号或名称搜索输入
  const searchConfig = createComponentConfig('text-input')
  searchConfig.label = '编号或名称搜索'
  searchConfig.placeholder = '请输入配方编号或名称'
  searchConfig.required = false
  if ('parameterConfig' in searchConfig) {
    searchConfig.parameterConfig = {
      type: 'json',
      fieldName: 'search.numberOrName'
    }
  }
  components.push({
    id: generateId(),
    config: searchConfig,
    order: 1
  })

  // 3. 物料编号列表（多行文本输入）
  const materialNumbersConfig = createComponentConfig('multiline-text')
  materialNumbersConfig.label = '物料编号列表'
  materialNumbersConfig.placeholder = '每行输入一个物料编号'
  if ('parameterConfig' in materialNumbersConfig) {
    materialNumbersConfig.parameterConfig = {
      type: 'json',
      fieldName: 'search.materialNumbers'
    }
  }
  components.push({
    id: generateId(),
    config: materialNumbersConfig,
    order: 2
  })

  // 4. 是否启用筛选
  const enabledConfig = createComponentConfig('boolean-select')
  enabledConfig.label = '是否启用'
  if ('trueLabel' in enabledConfig) {
    enabledConfig.trueLabel = '启用'
  }
  if ('falseLabel' in enabledConfig) {
    enabledConfig.falseLabel = '禁用'
  }
  if ('nullLabel' in enabledConfig) {
    enabledConfig.nullLabel = '全部'
  }
  if ('allowNull' in enabledConfig) {
    enabledConfig.allowNull = true
  }
  if ('parameterConfig' in enabledConfig) {
    enabledConfig.parameterConfig = {
      type: 'json',
      fieldName: 'search.enabled'
    }
  }
  components.push({
    id: generateId(),
    config: enabledConfig,
    order: 3
  })

  // 5. 分页表格组件
  const tableConfig = createComponentConfig('paginated-table')
  tableConfig.label = '茶配方管理表格'
  if ('apiUrl' in tableConfig) {
    tableConfig.apiUrl = '/api/data/recipes'
  }
  if ('pageSize' in tableConfig) {
    tableConfig.pageSize = 10
  }
  if ('columns' in tableConfig) {
    tableConfig.columns = [
      { key: 'id', title: 'ID', sortable: false },
      { key: 'number', title: '配方编号', sortable: false },
      { key: 'name', title: '配方名称', sortable: false },
      { key: 'materialNumber', title: '物料编号', sortable: false },
      { key: 'materialName', title: '物料名称', sortable: false },
      { key: 'theoryOutputMl', title: '理论产量(ml)', sortable: true },
      { key: 'teaBagCount', title: '茶包数量', sortable: true },
      { key: 'waterMl', title: '水量(ml)', sortable: true },
      { key: 'steepTimeSec', title: '浸泡时间(秒)', sortable: false },
      { key: 'temperature', title: '温度(°C)', sortable: false },
      { key: 'iceWaterMl', title: '冰水量(ml)', sortable: false },
      { key: 'enabled', title: '启用状态', sortable: false },
      { key: 'createTime', title: '创建时间', sortable: false },
      { key: 'remark', title: '备注', sortable: false }
    ]
  }
  components.push({
    id: generateId(),
    config: tableConfig,
    order: 4
  })

  return components
}

// 示例配置工厂
export function createExampleConfig(exampleType: 'oauth-login' | 'paginated-table'): CanvasComponent[] {
  switch (exampleType) {
    case 'oauth-login':
      return createOAuthLoginExample()
    case 'paginated-table':
      return createPaginatedTableExample()
    default:
      throw new Error(`未知的示例类型: ${exampleType}`)
  }
} 