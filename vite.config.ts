import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // 自定义API转发中间件
    {
      name: 'api-proxy',
      configureServer(server) {
        server.middlewares.use('/api', async (req, res, next) => {
          // 从/api/后面提取完整的目标URL
          const apiPath = req.url?.replace(/^\//, '') || ''
          
          console.log('🔍 原始请求URL:', req.url)
          console.log('🔍 提取的API路径:', apiPath)
          
          if (apiPath && (apiPath.startsWith('http://') || apiPath.startsWith('https://'))) {
            console.log('🚀 准备转发到:', apiPath)
            
            try {
              // 收集请求体
              let body = ''
              req.on('data', chunk => {
                body += chunk.toString()
              })
              
              req.on('end', async () => {
                try {
                  // 准备请求头
                  const forwardHeaders = {}
                  
                  // 复制原始请求头，排除代理相关的头
                  Object.keys(req.headers).forEach(key => {
                    const lowerKey = key.toLowerCase()
                    if (!['host', 'connection', 'upgrade', 'proxy-connection', 'proxy-authorization'].includes(lowerKey)) {
                      forwardHeaders[key] = req.headers[key]
                    }
                  })
                  
                  // 准备请求选项
                  const fetchOptions = {
                    method: req.method,
                    headers: forwardHeaders,
                    body: req.method !== 'GET' && body ? body : undefined
                  }
                  
                  console.log('🚀 发起请求:', apiPath)
                  console.log('🎯 转发的请求头:', forwardHeaders)
                  console.log('🎯 请求体:', body)
                  
                  // 发起请求
                  const response = await fetch(apiPath, fetchOptions)
                  
                  console.log('✅ 收到响应:', response.status, apiPath)
                  
                  // 获取响应数据
                  const responseData = await response.text()
                  console.log('📄 响应内容:', responseData.substring(0, 200) + (responseData.length > 200 ? '...' : ''))
                  
                  // 设置响应头
                  res.setHeader('Access-Control-Allow-Origin', '*')
                  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
                  
                  // 复制响应头
                  response.headers.forEach((value, key) => {
                    const lowerKey = key.toLowerCase()
                    if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(lowerKey)) {
                      res.setHeader(key, value)
                    }
                  })
                  
                  // 确保Content-Type正确设置
                  if (!response.headers.get('content-type')) {
                    res.setHeader('content-type', 'application/json; charset=utf-8')
                  }
                  
                  res.statusCode = response.status
                  res.end(responseData)
                  
                } catch (error) {
                  console.error('❌ 转发错误:', error.message)
                  res.statusCode = 500
                  res.setHeader('Content-Type', 'application/json')
                  res.end(JSON.stringify({ 
                    error: 'Proxy Error', 
                    message: error.message,
                    code: 'PROXY_ERROR'
                  }))
                }
              })
              
            } catch (error) {
              console.error('❌ 请求处理错误:', error.message)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ 
                error: 'Request Error', 
                message: error.message,
                code: 'REQUEST_ERROR'
              }))
            }
          } else {
            console.error('❌ 无效的API路径:', apiPath)
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ 
              error: 'Invalid API Path', 
              message: `API路径必须是完整的HTTP/HTTPS URL: ${apiPath}`,
              code: 'INVALID_API_PATH'
            }))
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    // 移除代理配置，使用中间件处理
    // proxy: {}
  }
}) 