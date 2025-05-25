# Vue3低代码平台OAuth2登录功能技术文档

## 项目概述

Vue3低代码平台是一个基于拖拽的可视化页面构建工具，本文档描述了为该平台添加OAuth2登录功能的完整技术实现。

### 技术栈
- **前端框架**: Vue 3.4+ + TypeScript
- **状态管理**: Pinia
- **样式框架**: TailwindCSS
- **构建工具**: Vite
- **组件系统**: 6种基础组件（文本输入、密码输入、文本域、按钮、数据列表、响应展示）

## 需求分析

### OAuth2接口规范
```bash
curl --location 'http://192.168.31.170:8888/oauth/token' \
--header 'Accept: application/json, text/plain, */*' \
--header 'Accept-Language: zh-CN,zh;q=0.9,en;q=0.8' \
--header 'Authorization: Basic YXBjcDoxMjM0NTY=' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=password' \
--data-urlencode 'username=sky_test' \
--data-urlencode 'password=123456' \
--data-urlencode 'scope=all'
```

### 响应格式
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 86399,
    "scope": "all",
    "username": "sky_test",
    "jti": "15739382-20f9-47f6-8efa-534972fc23d8"
}
```

### 核心需求
1. **参数类型支持**: urlencoded请求体、Basic认证头、header参数
2. **简化认证**: 基本的API请求-响应展示，无复杂token管理
3. **跨域支持**: 通过Vite代理解决CORS问题
4. **页面管理**: 支持保存页面并独立访问

## 技术架构

### 参数绑定系统扩展

#### 新增参数类型
```typescript
// src/types/global.types.ts
export type ParameterType = 
  | 'query' | 'json' | 'form' | 'path' | 'header' 
  | 'urlencoded' | 'basic-auth'  // 新增类型

export interface CollectedParameters {
  query: Record<string, any>
  json: Record<string, any>
  form: Record<string, any>
  path: Record<string, any>
  header: Record<string, any>
  urlencoded: Record<string, any>  // 新增
  basicAuth: Record<string, any>   // 新增
}
```

#### 智能参数收集器
```typescript
// src/stores/preview.store.ts
function collectParameters(components: CanvasComponent[]): CollectedParameters {
  const collected: CollectedParameters = {
    query: {}, json: {}, form: {}, path: {}, header: {},
    urlencoded: {}, basicAuth: {}
  }
  
  components.forEach(component => {
    if (hasParameters(component)) {
      component.config.parameters?.forEach(param => {
        const value = getComponentValue(component)
        if (value !== undefined && value !== '') {
          collected[param.type][param.name] = value
        }
      })
    }
  })
  
  return collected
}
```

### 请求构建器增强

#### URLEncoded请求体支持
```typescript
function buildRequestBody(params: CollectedParameters, method: string): any {
  if (Object.keys(params.urlencoded).length > 0) {
    const urlParams = new URLSearchParams()
    Object.entries(params.urlencoded).forEach(([key, value]) => {
      urlParams.append(key, String(value))
    })
    return urlParams
  }
  
  if (Object.keys(params.json).length > 0) {
    return JSON.stringify(params.json)
  }
  
  return null
}
```

#### Basic认证头支持
```typescript
function buildRequestHeaders(params: CollectedParameters): Record<string, string> {
  const headers: Record<string, string> = {}
  
  // Basic认证头
  if (Object.keys(params.basicAuth).length > 0) {
    const { username, password } = params.basicAuth
    if (username && password) {
      const credentials = btoa(`${username}:${password}`)
      headers['Authorization'] = `Basic ${credentials}`
    }
  }
  
  // 自定义Header参数
  Object.entries(params.header).forEach(([key, value]) => {
    headers[key] = String(value)
  })
  
  // Content-Type设置
  if (Object.keys(params.urlencoded).length > 0) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
  } else if (Object.keys(params.json).length > 0) {
    headers['Content-Type'] = 'application/json'
  }
  
  return headers
}
```

### 认证Store简化设计

```typescript
// src/stores/auth.store.ts
export const useAuthStore = defineStore('auth', () => {
  // 简化的Basic认证支持
  function generateBasicAuth(username: string, password: string): string {
    return btoa(`${username}:${password}`)
  }
  
  return {
    generateBasicAuth
  }
})
```

### 跨域代理配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/oauth-api': {
        target: 'http://192.168.31.170:8888',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oauth-api/, ''),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔧 OAuth代理请求:', req.method, req.url)
          })
        }
      }
    }
  }
})
```

## OAuth2登录示例配置

### 完整组件配置
创建包含10个组件的OAuth2登录表单：

1. **用户名输入框** (urlencoded参数)
2. **密码输入框** (urlencoded参数)  
3. **Grant Type字段** (urlencoded参数，默认"password")
4. **Scope字段** (urlencoded参数，默认"all")
5. **Basic认证用户名** (basic-auth参数，默认"apcp")
6. **Basic认证密码** (basic-auth参数，默认"123456")
7. **Accept头** (header参数)
8. **Accept-Language头** (header参数)
9. **登录按钮** (POST请求到OAuth接口)
10. **响应展示组件** (显示登录结果)

### 示例配置代码
```typescript
const oauthSampleConfig = {
  components: [
    {
      id: 'username-input',
      config: {
        type: 'text-input',
        label: '用户名',
        defaultValue: 'sky_test',
        parameters: [{
          name: 'username',
          type: 'urlencoded',
          required: true
        }]
      }
    },
    {
      id: 'password-input', 
      config: {
        type: 'password-input',
        label: '密码',
        defaultValue: '123456',
        parameters: [{
          name: 'password',
          type: 'urlencoded',
          required: true
        }]
      }
    },
    {
      id: 'login-button',
      config: {
        type: 'button',
        text: '登录',
        requestUrl: 'http://192.168.31.170:8888/oauth/token',
        requestMethod: 'POST'
      }
    }
    // ... 其他组件配置
  ]
}
```

## 页面管理系统

### 页面保存功能
```typescript
// src/stores/pages.store.ts
async function savePage(pageData: SavedPage): Promise<void> {
  const pages = await getPages()
  const existingIndex = pages.findIndex(p => p.id === pageData.id)
  
  if (existingIndex >= 0) {
    pages[existingIndex] = pageData
  } else {
    pages.push(pageData)
  }
  
  localStorage.setItem('saved-pages', JSON.stringify(pages))
}
```

### 独立页面访问
- **路由配置**: `/page/:pageId`
- **页面组件**: `PageViewerPage.vue`
- **渲染组件**: `PageRenderer.vue`

### 关键技术实现

#### Provide/Inject模式
```typescript
// PageViewerPage.vue
const pageComponents = computed(() => page.value?.components || [])
provide('pageComponents', pageComponents)

// PageRenderer.vue  
const pageComponents = inject<ComputedRef<CanvasComponent[]>>('pageComponents')
```

#### 参数收集修复
```typescript
async function handleButtonClick() {
  // 使用注入的页面组件列表进行参数收集
  const allPageComponents = pageComponents?.value || [props.component]
  const response = await previewStore.callApiWithComponents(
    allPageComponents, 
    config.requestUrl, 
    method
  )
}
```

## 核心功能验证

### 功能清单
- ✅ **urlencoded请求体格式支持**
- ✅ **Basic认证头自动生成**  
- ✅ **Header参数类型支持**
- ✅ **跨域代理配置**
- ✅ **完整OAuth2登录示例**
- ✅ **页面保存和独立访问**
- ✅ **预览模式和独立页面一致性**
- ✅ **响应展示功能**

### 测试场景
1. **预览模式测试**: 在画布预览中测试OAuth登录流程
2. **独立页面测试**: 保存页面后通过独立URL访问测试
3. **参数收集测试**: 验证所有参数类型正确收集
4. **跨域请求测试**: 验证代理配置正常工作
5. **响应展示测试**: 验证登录响应正确显示

## 部署说明

### 开发环境
```bash
npm install
npm run dev
```

### 生产环境
```bash
npm run build
npm run preview
```

### 代理配置注意事项
- 开发环境使用Vite代理解决CORS问题
- 生产环境需要配置Nginx反向代理或后端CORS设置

## 总结

本次OAuth2登录功能开发成功实现了：

1. **扩展了参数绑定系统**，支持urlencoded、basic-auth、header三种新参数类型
2. **简化了认证逻辑**，专注于基本的API请求-响应展示功能
3. **完善了页面管理系统**，支持页面保存和独立访问
4. **解决了跨域问题**，通过Vite代理实现OAuth服务器访问
5. **提供了完整示例**，包含10个组件的OAuth2登录表单

整个实现保持了系统的向后兼容性，最小化了对现有架构的改动，为低代码平台提供了强大的OAuth2认证能力。 