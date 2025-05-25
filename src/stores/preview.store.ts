import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CanvasComponent, CollectedParameters, ApiResponse, InputConfig } from '@/types/global.types'

export const usePreviewStore = defineStore('preview', () => {
  // 状态
  const isPreviewVisible = ref(false)
  const apiResponses = ref<ApiResponse[]>([])
  const isLoading = ref(false)

  // 计算属性
  const hasApiResponses = computed(() => apiResponses.value.length > 0)
  const latestResponse = computed(() => 
    apiResponses.value.length > 0 ? apiResponses.value[apiResponses.value.length - 1] : null
  )

  // 打开预览
  function openPreview() {
    console.log('🎭 打开预览模态框')
    isPreviewVisible.value = true
  }

  // 关闭预览
  function closePreview() {
    console.log('🎭 关闭预览模态框')
    isPreviewVisible.value = false
  }

  // 获取组件值（支持默认值）
  function getComponentValue(component: CanvasComponent, context?: string): any {
    const config = component.config
    
    // 获取存储键前缀（根据上下文区分）
    const storagePrefix = context === 'page' ? 'page_component_' : 'component_'
    
    // 处理多行文本输入
    if (config.type === 'multiline-text') {
      const storageKey = `${storagePrefix}${component.id}_multilineValue`
      const storedValue = localStorage.getItem(storageKey)
      
      if (storedValue !== null && storedValue !== '') {
        // 将文本按行分割为数组，过滤空行
        return storedValue.split('\n').filter(line => line.trim() !== '')
      }
      return []
    }
    
    // 处理布尔选择器
    if (config.type === 'boolean-select') {
      const storageKey = `${storagePrefix}${component.id}_booleanValue`
      const storedValue = localStorage.getItem(storageKey)
      
      if (storedValue !== null) {
        if (storedValue === 'true') return true
        if (storedValue === 'false') return false
        if (storedValue === 'null') return null
      }
      
      // 使用默认值
      if ('defaultValue' in config) {
        return config.defaultValue
      }
      return null
    }
    
    // 处理其他输入组件
    const storageKey = `${storagePrefix}${component.id}_value`
    const storedValue = localStorage.getItem(storageKey)
    
    if (storedValue !== null && storedValue !== '') {
      return storedValue
    }
    
    // 使用默认值（只有输入组件有defaultValue）
    if (config.type === 'text-input' || config.type === 'password-input' || config.type === 'textarea') {
      const inputConfig = config as InputConfig
      if (inputConfig.defaultValue !== undefined) {
        return inputConfig.defaultValue
      }
    }
    
    return ''
  }

  // 智能参数收集器
  function collectParameters(components: CanvasComponent[], context?: string): CollectedParameters {
    console.log('📊 开始收集参数，组件数量:', components.length)
    
    const collected: CollectedParameters = {
      query: {},
      json: {},
      form: {},
      path: {},
      header: {},
      urlencoded: {},
      basicAuth: {}
    }

    // 检查是否有分页表格组件，如果有则添加分页参数
    const paginatedTableComponent = components.find(comp => comp.config.type === 'paginated-table')
    if (paginatedTableComponent) {
      // 获取存储键前缀（根据上下文区分）
      const storagePrefix = context === 'page' ? 'page_component_' : 'component_'
      
      // 获取当前页码
      const pageKey = `${storagePrefix}${paginatedTableComponent.id}_currentPage`
      const storedPage = localStorage.getItem(pageKey)
      const currentPage = storedPage ? parseInt(storedPage, 10) : 1
      
      // 获取页面大小
      const pageSize = ('pageSize' in paginatedTableComponent.config && paginatedTableComponent.config.pageSize) 
        ? paginatedTableComponent.config.pageSize 
        : 10
      
      // 获取排序状态
      const sortKey = `${storagePrefix}${paginatedTableComponent.id}_currentSort`
      const sortDirectionKey = `${storagePrefix}${paginatedTableComponent.id}_sortDirection`
      const currentSort = localStorage.getItem(sortKey) || ''
      const sortDirection = localStorage.getItem(sortDirectionKey) || null
      
      // 构建排序数组 - 使用字符串格式：正序为"+字段名"，倒序为"-字段名"
      const sorts: string[] = []
      if (currentSort && sortDirection && sortDirection !== 'null') {
        const sortPrefix = sortDirection === 'asc' ? '+' : '-'
        sorts.push(sortPrefix + currentSort)
      }
      
      // 添加分页表格的参数
      collected.json.size = pageSize
      collected.json.page = currentPage
      collected.json.sorts = sorts
      
      // 初始化search对象
      if (!collected.json.search) {
        collected.json.search = {}
      }
      
      console.log('📊 分页表格参数收集:', {
        page: currentPage,
        size: pageSize,
        sorts: sorts,
        componentId: paginatedTableComponent.id
      })
    }

    components.forEach(component => {
      const config = component.config
      console.log(`📊 处理组件 ${component.id} (${config.type})`)
      
      if (config.parameterConfig && config.parameterConfig.type !== 'none') {
        const paramConfig = config.parameterConfig
        const componentValue = getComponentValue(component, context)
        
        console.log(`📊 组件 ${component.id} 参数配置:`, {
          type: paramConfig.type,
          fieldName: paramConfig.fieldName,
          value: componentValue
        })

        if (componentValue !== undefined && componentValue !== null && componentValue !== '') {
          const fieldName = paramConfig.fieldName
          const paramType = paramConfig.type

          // 处理嵌套字段（如 search.numberOrName）
          const setNestedValue = (obj: any, path: string, value: any) => {
            const keys = path.split('.')
            let current = obj
            
            for (let i = 0; i < keys.length - 1; i++) {
              const key = keys[i]
              if (!(key in current)) {
                current[key] = {}
              }
              current = current[key]
            }
            
            const lastKey = keys[keys.length - 1]
            current[lastKey] = value
          }

          switch (paramType) {
            case 'query':
              if (fieldName.includes('.')) {
                setNestedValue(collected.query, fieldName, componentValue)
              } else {
                collected.query[fieldName] = componentValue
              }
              break
            case 'json':
              if (fieldName.includes('.')) {
                setNestedValue(collected.json, fieldName, componentValue)
              } else {
                collected.json[fieldName] = componentValue
              }
              break
            case 'form':
              if (fieldName.includes('.')) {
                setNestedValue(collected.form, fieldName, componentValue)
              } else {
                collected.form[fieldName] = componentValue
              }
              break
            case 'urlencoded':
              if (fieldName.includes('.')) {
                setNestedValue(collected.urlencoded, fieldName, componentValue)
              } else {
                collected.urlencoded[fieldName] = componentValue
              }
              break
            case 'path':
              collected.path[fieldName] = componentValue
              break
            case 'header':
              collected.header[fieldName] = componentValue
              break
            case 'basic-auth':
              collected.basicAuth[fieldName] = componentValue
              break
          }
        }
      }
    })

    console.log('📊 参数收集完成:', collected)
    return collected
  }

  // 构建请求URL
  function buildRequestUrl(baseUrl: string, parameters: CollectedParameters): string {
    console.log('🔗 构建请求URL，基础URL:', baseUrl)
    let url = baseUrl

    // 处理路径参数
    Object.entries(parameters.path).forEach(([key, value]) => {
      const placeholder1 = `{${key}}`
      const placeholder2 = `:${key}`
      
      if (url.includes(placeholder1)) {
        url = url.replace(placeholder1, encodeURIComponent(String(value)))
        console.log(`🔗 替换路径参数 {${key}} = ${value}`)
      } else if (url.includes(placeholder2)) {
        url = url.replace(placeholder2, encodeURIComponent(String(value)))
        console.log(`🔗 替换路径参数 :${key} = ${value}`)
      }
    })

    // 处理查询参数
    if (Object.keys(parameters.query).length > 0) {
      const urlObj = new URL(url, window.location.origin)
      Object.entries(parameters.query).forEach(([key, value]) => {
        urlObj.searchParams.append(key, String(value))
        console.log(`🔗 添加查询参数 ${key} = ${value}`)
      })
      url = urlObj.toString()
    }

    console.log('🔗 最终URL:', url)
    return url
  }

  // 构建请求体
  function buildRequestBody(method: string, parameters: CollectedParameters): any {
    console.log('📦 构建请求体，方法:', method)
    
    if (method === 'GET') {
      console.log('📦 GET请求，无需请求体')
      return undefined
    }

    // 优先使用urlencoded参数（OAuth2登录）
    if (Object.keys(parameters.urlencoded).length > 0) {
      console.log('📦 使用urlencoded格式:', parameters.urlencoded)
      const urlencoded = new URLSearchParams()
      Object.entries(parameters.urlencoded).forEach(([key, value]) => {
        urlencoded.append(key, String(value))
      })
      return urlencoded.toString()
    }

    // 其次使用JSON参数
    if (Object.keys(parameters.json).length > 0) {
      console.log('📦 使用JSON格式:', parameters.json)
      return JSON.stringify(parameters.json)
    }

    // 最后使用表单参数
    if (Object.keys(parameters.form).length > 0) {
      console.log('📦 使用FormData格式:', parameters.form)
      const formData = new FormData()
      Object.entries(parameters.form).forEach(([key, value]) => {
        formData.append(key, String(value))
      })
      return formData
    }

    console.log('📦 无请求体参数')
    return undefined
  }

  // 构建请求头
  function buildRequestHeaders(parameters: CollectedParameters, hasJsonBody: boolean, hasUrlencodedBody: boolean): Record<string, string> {
    console.log('🔐 构建请求头')
    const headers: Record<string, string> = { ...parameters.header }

    // 处理Basic认证
    if (Object.keys(parameters.basicAuth).length > 0) {
      const username = parameters.basicAuth.username || ''
      const password = parameters.basicAuth.password || ''
      if (username && password) {
        const credentials = btoa(`${username}:${password}`)
        headers['Authorization'] = `Basic ${credentials}`
        console.log('🔐 使用Basic认证')
      }
    }

    // 设置Content-Type
    if (hasUrlencodedBody) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      console.log('🔐 设置Content-Type: application/x-www-form-urlencoded')
    } else if (hasJsonBody) {
      headers['Content-Type'] = 'application/json'
      console.log('🔐 设置Content-Type: application/json')
    }

    console.log('🔐 最终请求头:', headers)
    return headers
  }

  // 处理代理URL
  function processProxyUrl(url: string): string {
    console.log('🌐 处理代理URL:', url)
    
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname
      
      console.log('🌐 URL主机名:', hostname)
      
      // 本地地址直接访问
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        console.log('🌐 本地地址，直接访问')
        return url
      }
      
      // 外部地址转发：/api/完整URL
      const proxyUrl = `/api/${url}`
      console.log('🌐 转发到:', proxyUrl)
      return proxyUrl
      
    } catch (error) {
      console.error('🌐 URL解析失败:', error)
      return url
    }
  }

  // API调用主函数
  async function callApiWithComponents(components: CanvasComponent[], url: string, method: string = 'GET', context?: string): Promise<ApiResponse> {
    console.log('🚀 开始API调用')
    console.log('🚀 URL:', url)
    console.log('🚀 方法:', method)
    console.log('🚀 组件数量:', components.length)
    console.log('🚀 上下文:', context || 'preview')

    isLoading.value = true

    const response: ApiResponse = {
      id: `api_${Date.now()}`,
      timestamp: new Date().toISOString(),
      url: url,
      method: method,
      status: 0,
      data: null,
      error: undefined
    }

    try {
      // 收集参数
      const parameters = collectParameters(components, context)
      
      // 构建请求URL
      let requestUrl = buildRequestUrl(url, parameters)
      
      // 处理代理
      requestUrl = processProxyUrl(requestUrl)
      response.url = requestUrl

      // 构建请求体
      const requestBody = buildRequestBody(method, parameters)
      const hasJsonBody = requestBody && typeof requestBody === 'string' && requestBody.startsWith('{')
      const hasUrlencodedBody = requestBody && typeof requestBody === 'string' && !requestBody.startsWith('{')

      // 构建请求头
      const headers = buildRequestHeaders(parameters, hasJsonBody, hasUrlencodedBody)

      console.log('🚀 发送请求:', {
        url: requestUrl,
        method,
        headers,
        body: requestBody
      })

      // 发送请求
      const fetchOptions: RequestInit = {
        method: method,
        headers: headers
      }

      if (requestBody !== undefined) {
        fetchOptions.body = requestBody
      }

      const fetchResponse = await fetch(requestUrl, fetchOptions)
      response.status = fetchResponse.status

      console.log('🚀 收到响应，状态码:', response.status)

      // 解析响应
      const contentType = fetchResponse.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        response.data = await fetchResponse.json()
        console.log('🚀 JSON响应数据:', response.data)
      } else {
        response.data = await fetchResponse.text()
        console.log('🚀 文本响应数据:', response.data)
      }

    } catch (error: any) {
      console.error('🚀 API调用失败:', error)
      response.status = 0
      response.error = error.message || String(error)
    } finally {
      isLoading.value = false
    }

    // 保存响应记录
    apiResponses.value.push(response)
    console.log('🚀 API调用完成，响应已保存')

    return response
  }

  // 简化的API调用方法
  async function callApi(url: string, method: string = 'GET', data?: any): Promise<ApiResponse> {
    // 创建临时组件来传递数据
    const tempComponents: CanvasComponent[] = []
    
    if (data && typeof data === 'object') {
      Object.entries(data).forEach(([key, value], index) => {
        tempComponents.push({
          id: `temp_${index}`,
          config: {
            id: `temp_${index}`,
            type: 'text-input',
            label: key,
            parameterConfig: {
              type: 'json',
              fieldName: key
            },
            defaultValue: String(value)
          } as InputConfig,
          order: index
        })
      })
    }

    return callApiWithComponents(tempComponents, url, method)
  }

  // 清空响应记录
  function clearResponses() {
    apiResponses.value = []
    console.log('🗑️ 已清空API响应记录')
  }

  return {
    // 状态
    isPreviewVisible,
    apiResponses,
    isLoading,
    
    // 计算属性
    hasApiResponses,
    latestResponse,
    
    // 方法
    openPreview,
    closePreview,
    collectParameters,
    buildRequestUrl,
    buildRequestBody,
    buildRequestHeaders,
    processProxyUrl,
    callApiWithComponents,
    callApi,
    clearResponses
  }
}) 