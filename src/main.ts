import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './styles/globals.css'
import { initDatabase } from './utils/database'

// 初始化数据库
try {
  initDatabase()
  console.log('数据库初始化完成')
} catch (error) {
  console.error('数据库初始化失败:', error)
}

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app') 