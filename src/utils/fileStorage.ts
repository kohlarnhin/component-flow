import type { SavedPage } from '@/types/global.types'

// 文件存储工具类
export class FileStorageService {
  private static readonly STORAGE_DIR = 'saved-pages'
  
  // 保存页面到文件
  static async savePage(page: SavedPage): Promise<void> {
    try {
      const fileName = `${page.id}.json`
      const fileContent = JSON.stringify(page, null, 2)
      
      // 在浏览器环境中，我们使用localStorage作为备选方案
      // 实际的文件系统操作需要后端支持
      if (typeof window !== 'undefined') {
        // 浏览器环境：使用localStorage + 下载功能
        const existingPages = this.getAllPagesFromStorage()
        const updatedPages = existingPages.filter(p => p.id !== page.id)
        updatedPages.push(page)
        
                localStorage.setItem('lowcode-saved-pages', JSON.stringify(updatedPages))
      }
    } catch (error) {
      console.error('保存页面文件失败:', error)
      throw new Error('保存页面失败')
    }
  }
  
  // 从文件加载页面
  static async loadPage(pageId: string): Promise<SavedPage | null> {
    try {
      if (typeof window !== 'undefined') {
        // 浏览器环境：从localStorage读取
        const pages = this.getAllPagesFromStorage()
        return pages.find(p => p.id === pageId) || null
      }
      return null
    } catch (error) {
      console.error('加载页面文件失败:', error)
      return null
    }
  }
  
  // 获取所有页面
  static async getAllPages(): Promise<SavedPage[]> {
    try {
      if (typeof window !== 'undefined') {
        return this.getAllPagesFromStorage()
      }
      return []
    } catch (error) {
      console.error('获取页面列表失败:', error)
      return []
    }
  }
  
  // 删除页面文件
  static async deletePage(pageId: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        const pages = this.getAllPagesFromStorage()
        const updatedPages = pages.filter(p => p.id !== pageId)
        localStorage.setItem('lowcode-saved-pages', JSON.stringify(updatedPages))
      }
    } catch (error) {
      console.error('删除页面文件失败:', error)
      throw new Error('删除页面失败')
    }
  }
  
  // 检查页面是否存在
  static async pageExists(pageId: string): Promise<boolean> {
    try {
      const page = await this.loadPage(pageId)
      return page !== null
    } catch (error) {
      return false
    }
  }
  
  // 从localStorage获取所有页面
  private static getAllPagesFromStorage(): SavedPage[] {
    try {
      const stored = localStorage.getItem('lowcode-saved-pages')
      if (stored) {
        const pages = JSON.parse(stored)
        return Array.isArray(pages) ? pages : []
      }
      return []
    } catch (error) {
      console.error('从localStorage读取页面失败:', error)
      return []
    }
  }
  
  // 下载页面为文件（可选功能）
  private static downloadPageAsFile(page: SavedPage, fileName: string): void {
    try {
      const fileContent = JSON.stringify(page, null, 2)
      const blob = new Blob([fileContent], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('下载页面文件失败:', error)
    }
  }
  
  // 从文件导入页面
  static async importPageFromFile(file: File): Promise<SavedPage> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string
          const page = JSON.parse(content) as SavedPage
          
          // 验证页面数据结构
          if (!page.id || !page.name || !Array.isArray(page.components)) {
            throw new Error('无效的页面文件格式')
          }
          
          // 生成新的ID避免冲突
          page.id = this.generatePageId()
          page.updatedAt = new Date().toISOString()
          
          resolve(page)
        } catch (error) {
          reject(new Error('解析页面文件失败: ' + (error as Error).message))
        }
      }
      
      reader.onerror = () => {
        reject(new Error('读取文件失败'))
      }
      
      reader.readAsText(file)
    })
  }
  
  // 生成页面ID
  private static generatePageId(): string {
    return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  // 获取存储统计信息
  static async getStorageStats(): Promise<{
    totalPages: number
    totalSize: string
    lastModified: string | null
  }> {
    try {
      const pages = await this.getAllPages()
      const totalSize = new Blob([JSON.stringify(pages)]).size
      const lastModified = pages.length > 0 
        ? pages.reduce((latest, page) => 
            page.updatedAt > latest ? page.updatedAt : latest, 
            pages[0].updatedAt
          )
        : null
      
      return {
        totalPages: pages.length,
        totalSize: this.formatFileSize(totalSize),
        lastModified
      }
    } catch (error) {
      return {
        totalPages: 0,
        totalSize: '0 B',
        lastModified: null
      }
    }
  }
  
  // 格式化文件大小
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B'
    
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
} 