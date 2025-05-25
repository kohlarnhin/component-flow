import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // 通用转发代理 - 动态转发到/api/后面的完整URL
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        selfHandleResponse: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 从/api/后面提取完整的目标URL
            const apiPath = req.url?.replace(/^\/api\//, '') || ''
            
            console.log('🔍 原始请求URL:', req.url)
            console.log('🔍 提取的API路径:', apiPath)
            console.log('🔍 原始请求头:', req.headers)
            
            if (apiPath && (apiPath.startsWith('http://') || apiPath.startsWith('https://'))) {
              console.log('🚀 准备转发到:', apiPath)
              
              // 使用fetch进行转发（更简单可靠）
              const forwardRequest = async () => {
                try {
                  // 收集请求体
                  let body = ''
                  req.on('data', chunk => {
                    body += chunk.toString()
                  })
                  
                  req.on('end', async () => {
              try {
                      // 准备请求头 - 转发所有原始请求头
                      const forwardHeaders = {}
                      
                      // 复制所有原始请求头，排除一些代理相关的头
                      Object.keys(req.headers).forEach(key => {
                        const lowerKey = key.toLowerCase()
                        // 排除一些不需要转发的头
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
                      console.log('📄 响应内容:', responseData.substring(0, 500) + (responseData.length > 500 ? '...' : ''))
                      
                      // 设置响应头
                      const responseHeaders = {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                      }
                      
                      // 复制响应头，但排除编码相关的头
                      response.headers.forEach((value, key) => {
                        const lowerKey = key.toLowerCase()
                        // 排除可能导致解码问题的头
                        if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(lowerKey)) {
                          responseHeaders[key] = value
                        }
                      })
                      
                      // 确保Content-Type正确设置
                      if (!responseHeaders['content-type']) {
                        responseHeaders['content-type'] = 'application/json; charset=utf-8'
                      }
                      
                      console.log('📤 设置响应头:', responseHeaders)
                      
                      res.writeHead(response.status, responseHeaders)
                      
                      // 返回响应数据
                      res.end(responseData)
                      
                    } catch (error) {
                      console.error('❌ 转发错误:', error.message)
              res.writeHead(500, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ 
                error: 'Proxy Error', 
                        message: error.message,
                code: 'PROXY_ERROR'
                      }))
                    }
                  })
                  
                } catch (error) {
                  console.error('❌ 请求处理错误:', error.message)
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ 
                    error: 'Request Error', 
                    message: error.message,
                    code: 'REQUEST_ERROR'
                  }))
                }
              }
              
              forwardRequest()
              
            } else {
              console.error('❌ 无效的API路径:', apiPath)
              res.writeHead(400, { 'Content-Type': 'application/json' })
              res.end(JSON.stringify({ 
                error: 'Invalid API Path', 
                message: `API路径必须是完整的HTTP/HTTPS URL: ${apiPath}`,
                code: 'INVALID_API_PATH'
              }))
            }
          })
        }
      }
    }
  }
}) 