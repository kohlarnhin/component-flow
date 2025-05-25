import type { CanvasComponent } from '@/types/global.types'

// 生成独立的HTML页面
export function generateStandalonePage(components: CanvasComponent[], pageName: string): string {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageName}</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .input-field {
            @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
        }
        .btn-primary {
            @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
        }
        .btn-secondary {
            @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
        }
        .component-card {
            @apply bg-white rounded-lg border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden p-4;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen">
    <div id="app">
        <div class="container mx-auto px-4 py-8">
            <div class="max-w-4xl mx-auto">
                <!-- 页面头部 -->
                <div class="mb-8 text-center">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">${pageName}</h1>
                    <p class="text-gray-600">由Vue3低代码平台生成</p>
                </div>
                
                <!-- 组件区域 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    ${generateComponentsHTML(components)}
                </div>
                
                <!-- API响应区域 -->
                <div v-if="apiResponses.length > 0" class="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">API响应记录</h3>
                    <div class="space-y-4">
                        <div v-for="response in apiResponses" :key="response.id" class="border border-gray-200 rounded-lg p-4">
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-sm font-medium" :class="response.status === 200 ? 'text-green-600' : 'text-red-600'">
                                    {{ response.method }} {{ response.status }}
                                </span>
                                <span class="text-xs text-gray-500">{{ formatTime(response.timestamp) }}</span>
                            </div>
                            <div class="text-xs text-gray-600 mb-2 break-all">{{ response.url }}</div>
                            <div v-if="response.data" class="bg-gray-900 rounded p-3 text-green-400 font-mono text-xs overflow-auto max-h-32">
                                <pre>{{ JSON.stringify(response.data, null, 2) }}</pre>
                            </div>
                            <div v-if="response.error" class="bg-red-50 border border-red-200 rounded p-3 text-red-600 text-xs">
                                {{ response.error }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        const { createApp, ref, computed } = Vue;
        
        createApp({
            setup() {
                // 状态管理
                const formData = ref({});
                const apiResponses = ref([]);
                const isLoading = ref(false);
                
                // 更新表单数据
                function updateFormData(componentId, value) {
                    formData.value[componentId] = value;
                }
                
                // 获取表单数据
                function getFormData(componentId) {
                    return formData.value[componentId] || '';
                }
                
                // 获取组件当前值（支持默认值）
                function getCurrentValue(component) {
                    const storedValue = formData.value[component.id];
                    if (storedValue !== undefined && storedValue !== null && storedValue !== '') {
                        return storedValue;
                    }
                    
                    // 使用默认值
                    const config = component.config;
                    if (config.defaultValue !== undefined) {
                        formData.value[component.id] = config.defaultValue;
                        return config.defaultValue;
                    }
                    
                    return '';
                }
                
                // 收集参数
                function collectParameters() {
                    const collected = {
                        query: {},
                        json: {},
                        form: {},
                        path: {},
                        header: {},
                        urlencoded: {},
                        basicAuth: {}
                    };
                    
                    const components = ${JSON.stringify(components)};
                    
                    components.forEach(component => {
                        const config = component.config;
                        if (config.parameterConfig && config.parameterConfig.type !== 'none') {
                            const paramConfig = config.parameterConfig;
                            const componentValue = formData.value[component.id];
                            
                            if (componentValue !== undefined && componentValue !== null && componentValue !== '') {
                                const fieldName = paramConfig.fieldName;
                                const paramType = paramConfig.type;
                                
                                switch (paramType) {
                                    case 'query':
                                        collected.query[fieldName] = componentValue;
                                        break;
                                    case 'json':
                                        collected.json[fieldName] = componentValue;
                                        break;
                                    case 'form':
                                        collected.form[fieldName] = componentValue;
                                        break;
                                    case 'urlencoded':
                                        collected.urlencoded[fieldName] = componentValue;
                                        break;
                                    case 'path':
                                        collected.path[fieldName] = componentValue;
                                        break;
                                    case 'header':
                                        collected.header[fieldName] = componentValue;
                                        break;
                                    case 'basic-auth':
                                        collected.basicAuth[fieldName] = componentValue;
                                        break;
                                }
                            }
                        }
                    });
                    
                    return collected;
                }
                
                // 构建请求URL
                function buildRequestUrl(baseUrl, parameters) {
                    let url = baseUrl;
                    
                    // 处理路径参数
                    Object.entries(parameters.path).forEach(([key, value]) => {
                        url = url.replace(\`{\${key}}\`, encodeURIComponent(String(value)));
                        url = url.replace(\`:\${key}\`, encodeURIComponent(String(value)));
                    });
                    
                    // 处理查询参数
                    if (Object.keys(parameters.query).length > 0) {
                        const urlObj = new URL(url, window.location.origin);
                        Object.entries(parameters.query).forEach(([key, value]) => {
                            urlObj.searchParams.append(key, String(value));
                        });
                        url = urlObj.toString();
                    }
                    
                    return url;
                }
                
                // 构建请求体
                function buildRequestBody(method, parameters) {
                    if (method === 'GET') {
                        return undefined;
                    }
                    
                    // 优先使用urlencoded参数
                    if (Object.keys(parameters.urlencoded).length > 0) {
                        const urlencoded = new URLSearchParams();
                        Object.entries(parameters.urlencoded).forEach(([key, value]) => {
                            urlencoded.append(key, String(value));
                        });
                        return urlencoded.toString();
                    }
                    
                    // 其次使用JSON参数
                    if (Object.keys(parameters.json).length > 0) {
                        return JSON.stringify(parameters.json);
                    }
                    
                    // 最后使用表单参数
                    if (Object.keys(parameters.form).length > 0) {
                        const formData = new FormData();
                        Object.entries(parameters.form).forEach(([key, value]) => {
                            formData.append(key, String(value));
                        });
                        return formData;
                    }
                    
                    return undefined;
                }
                
                // 构建请求头
                function buildRequestHeaders(parameters, hasJsonBody, hasUrlencodedBody) {
                    const headers = { ...parameters.header };
                    
                    // 设置Content-Type
                    if (hasUrlencodedBody) {
                        headers['Content-Type'] = 'application/x-www-form-urlencoded';
                    } else if (hasJsonBody) {
                        headers['Content-Type'] = 'application/json';
                    }
                    
                    // 处理Basic认证
                    if (Object.keys(parameters.basicAuth).length > 0) {
                        const username = parameters.basicAuth.username || '';
                        const password = parameters.basicAuth.password || '';
                        if (username && password) {
                            const credentials = btoa(\`\${username}:\${password}\`);
                            headers['Authorization'] = \`Basic \${credentials}\`;
                        }
                    }
                    
                    return headers;
                }
                
                // API调用
                async function callApi(url, method) {
                    isLoading.value = true;
                    
                    const response = {
                        id: \`api_\${Date.now()}\`,
                        timestamp: new Date().toISOString(),
                        url: url,
                        method: method,
                        status: 0,
                        data: null,
                        error: undefined
                    };
                    
                    try {
                        const parameters = collectParameters();
                        let requestUrl = buildRequestUrl(url, parameters);
                        
                        response.url = requestUrl;
                        
                        const requestBody = buildRequestBody(method, parameters);
                        const hasJsonBody = requestBody && typeof requestBody === 'string' && requestBody.startsWith('{');
                        const hasUrlencodedBody = requestBody && typeof requestBody === 'string' && !requestBody.startsWith('{');
                        
                        const headers = buildRequestHeaders(parameters, hasJsonBody, hasUrlencodedBody);
                        
                        const fetchOptions = {
                            method: method,
                            headers: headers
                        };
                        
                        if (requestBody !== undefined) {
                            fetchOptions.body = requestBody;
                        }
                        
                        const fetchResponse = await fetch(requestUrl, fetchOptions);
                        response.status = fetchResponse.status;
                        
                        const contentType = fetchResponse.headers.get('content-type');
                        if (contentType && contentType.includes('application/json')) {
                            response.data = await fetchResponse.json();
                        } else {
                            response.data = await fetchResponse.text();
                        }
                        
                    } catch (error) {
                        response.status = 0;
                        response.error = error.message;
                    } finally {
                        isLoading.value = false;
                    }
                    
                    apiResponses.value.push(response);
                    return response;
                }
                
                // 处理按钮点击
                async function handleButtonClick(component) {
                    const config = component.config;
                    if (config.confirmText && !confirm(config.confirmText)) {
                        return;
                    }
                    
                    if (config.requestUrl) {
                        const method = config.requestMethod || 'GET';
                        await callApi(config.requestUrl, method);
                    } else {
                        alert(\`按钮"\${config.text}"被点击了！\`);
                    }
                }
                
                // 格式化时间
                function formatTime(timestamp) {
                    return new Date(timestamp).toLocaleTimeString();
                }
                
                return {
                    formData,
                    apiResponses,
                    isLoading,
                    updateFormData,
                    getFormData,
                    getCurrentValue,
                    handleButtonClick,
                    formatTime
                };
            }
        }).mount('#app');
    </script>
</body>
</html>`;

  return htmlTemplate;
}

// 生成组件HTML
function generateComponentsHTML(components: CanvasComponent[]): string {
  return components.map(component => {
    const config = component.config;
    const componentClass = getComponentLayoutClass(config.type);
    
    switch (config.type) {
      case 'text-input':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">
                ${config.label}
                ${config.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
              </label>
              <input
                v-model="formData['${component.id}']"
                @input="updateFormData('${component.id}', $event.target.value)"
                type="text"
                placeholder="${config.placeholder || ''}"
                ${config.disabled ? 'disabled' : ''}
                class="input-field"
                ${config.defaultValue ? `value="${config.defaultValue}"` : ''}
              />
            </div>
          </div>
        `;
        
      case 'password-input':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">
                ${config.label}
                ${config.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
              </label>
              <input
                v-model="formData['${component.id}']"
                @input="updateFormData('${component.id}', $event.target.value)"
                type="password"
                placeholder="${config.placeholder || ''}"
                ${config.disabled ? 'disabled' : ''}
                class="input-field"
                ${config.defaultValue ? `value="${config.defaultValue}"` : ''}
              />
            </div>
          </div>
        `;
        
      case 'textarea':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">
                ${config.label}
                ${config.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
              </label>
              <textarea
                v-model="formData['${component.id}']"
                @input="updateFormData('${component.id}', $event.target.value)"
                placeholder="${config.placeholder || ''}"
                ${config.disabled ? 'disabled' : ''}
                rows="4"
                class="input-field resize-none"
              >${config.defaultValue || ''}</textarea>
            </div>
          </div>
        `;
        
      case 'button':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              ${config.label ? `<label class="text-sm font-medium text-gray-800">${config.label}</label>` : ''}
              <button
                @click="handleButtonClick(${JSON.stringify(component)})"
                :disabled="isLoading"
                class="btn-primary w-full flex items-center justify-center space-x-2 py-3"
              >
                <span v-if="isLoading">处理中...</span>
                <span v-else>${'text' in config ? config.text : '发送请求'}</span>
              </button>
            </div>
          </div>
        `;
        
      case 'response-display':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">${config.label}</label>
              <div v-if="apiResponses.length > 0" class="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-xs overflow-auto max-h-64">
                <pre>{{ JSON.stringify(apiResponses[apiResponses.length - 1].data, null, 2) }}</pre>
              </div>
              <div v-else class="text-center text-gray-500 py-8">
                <p class="text-sm">暂无响应数据</p>
              </div>
            </div>
          </div>
        `;
        
      case 'multiline-text':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">
                ${config.label}
                ${config.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
              </label>
              <textarea
                v-model="formData['${component.id}']"
                @input="updateFormData('${component.id}', $event.target.value)"
                placeholder="${config.placeholder || '每行输入一个值'}"
                ${config.disabled ? 'disabled' : ''}
                rows="4"
                class="input-field resize-vertical"
              ></textarea>
            </div>
          </div>
        `;
        
      case 'boolean-select':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">
                ${config.label}
                ${config.required ? '<span class="text-red-500 ml-1">*</span>' : ''}
              </label>
              <div class="flex space-x-2">
                <button
                  @click="updateFormData('${component.id}', true)"
                  class="flex-1 px-3 py-2 text-sm border rounded-lg transition-colors"
                  :class="formData['${component.id}'] === true ? 'bg-green-100 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-600'"
                >
                  是
                </button>
                <button
                  @click="updateFormData('${component.id}', false)"
                  class="flex-1 px-3 py-2 text-sm border rounded-lg transition-colors"
                  :class="formData['${component.id}'] === false ? 'bg-red-100 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-600'"
                >
                  否
                </button>
              </div>
            </div>
          </div>
        `;
        
      case 'data-list':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">${config.label}</label>
              <div class="text-center text-gray-500 py-8">
                <p class="text-sm">数据列表组件（静态页面暂不支持）</p>
              </div>
            </div>
          </div>
        `;
        
      case 'paginated-table':
        return `
          <div class="component-card ${componentClass}">
            <div class="space-y-3">
              <label class="text-sm font-medium text-gray-800">${config.label}</label>
              <div class="text-center text-gray-500 py-8">
                <p class="text-sm">分页表格组件（静态页面暂不支持）</p>
              </div>
            </div>
          </div>
        `;
    }
  }).join('\n');
}

// 获取组件布局类
function getComponentLayoutClass(type: string): string {
  // 展示类组件占用整行（两列）
  if (type === 'response-display' || type === 'data-list' || type === 'paginated-table') {
    return 'md:col-span-2';
  }
  
  // 按钮组件占用整行
  if (type === 'button') {
    return 'md:col-span-2';
  }
  
  // 文本域占用整行
  if (type === 'textarea') {
    return 'md:col-span-2';
  }
  
  // 参数输入组件占用一列（一行两个）
  // 包括：text-input, password-input, multiline-text, boolean-select
  return 'md:col-span-1';
}

// 保存页面到文件
export function savePageAsFile(components: CanvasComponent[], pageName: string): void {
  const htmlContent = generateStandalonePage(components, pageName);
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${pageName.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
} 