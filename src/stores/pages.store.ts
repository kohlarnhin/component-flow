import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { SavedPage, CanvasComponent } from '@/types/global.types'
import { FileStorageService } from '@/utils/fileStorage'

export const usePagesStore = defineStore('pages', () => {
  // 状态
  const savedPages = ref<SavedPage[]>([])
  const currentViewingPage = ref<SavedPage | null>(null)
  const isLoading = ref(false)
  
  // 计算属性
  const pagesCount = computed(() => savedPages.value.length)
  
  // 初始化 - 从文件存储加载已保存的页面
  async function initializePages() {
    try {
      isLoading.value = true
      const pages = await FileStorageService.getAllPages()
      savedPages.value = pages
    } catch (error) {
      console.error('加载已保存页面失败:', error)
    } finally {
      isLoading.value = false
    }
  }
  
  // 保存新页面
  async function savePage(name: string, components: CanvasComponent[], description?: string): Promise<string> {
    try {
      isLoading.value = true
      
      const newPage: SavedPage = {
        id: generatePageId(),
        name,
        description,
        components: [...components],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await FileStorageService.savePage(newPage)
      savedPages.value.push(newPage)
      
      return newPage.id
    } catch (error) {
      console.error('保存页面失败:', error)
      throw new Error('保存页面失败')
    } finally {
      isLoading.value = false
    }
  }
  
  // 删除页面
  async function deletePage(id: string) {
    try {
      isLoading.value = true
      
      await FileStorageService.deletePage(id)
      const index = savedPages.value.findIndex(p => p.id === id)
      if (index > -1) {
        savedPages.value.splice(index, 1)
      }
      
      // 如果删除的是当前查看的页面，清空当前页面
      if (currentViewingPage.value?.id === id) {
        currentViewingPage.value = null
      }
    } catch (error) {
      console.error('删除页面失败:', error)
      throw new Error('删除页面失败')
    } finally {
      isLoading.value = false
    }
  }
  
  // 获取页面
  async function getPage(id: string): Promise<SavedPage | null> {
    try {
      // 先从内存中查找
      const memoryPage = savedPages.value.find(p => p.id === id)
      if (memoryPage) {
        return memoryPage
      }
      
      // 从文件存储中加载
      const page = await FileStorageService.loadPage(id)
      if (page) {
        // 添加到内存中
        const existingIndex = savedPages.value.findIndex(p => p.id === id)
        if (existingIndex === -1) {
          savedPages.value.push(page)
        }
      }
      
      return page
    } catch (error) {
      console.error('获取页面失败:', error)
      return null
    }
  }
  
  // 复制页面
  async function duplicatePage(id: string): Promise<string | null> {
    try {
      isLoading.value = true
      
      const originalPage = await getPage(id)
      if (!originalPage) {
        throw new Error('原页面不存在')
      }
      
      const newPageId = await savePage(
        `${originalPage.name} (副本)`,
        originalPage.components,
        originalPage.description
      )
      
      return newPageId
    } catch (error) {
      console.error('复制页面失败:', error)
      return null
    } finally {
      isLoading.value = false
    }
  }
  
  // 更新页面中的组件
  async function updatePageComponent(pageId: string, componentId: string, newConfig: any): Promise<boolean> {
    try {
      isLoading.value = true
      
      const page = await getPage(pageId)
      if (!page) {
        throw new Error('页面不存在')
      }
      
      // 找到要更新的组件
      const componentIndex = page.components.findIndex(c => c.id === componentId)
      if (componentIndex === -1) {
        throw new Error('组件不存在')
      }
      
      // 更新组件配置
      const updatedComponents = [...page.components]
      updatedComponents[componentIndex] = {
        ...updatedComponents[componentIndex],
        config: newConfig
      }
      
      // 更新页面
      const updatedPage: SavedPage = {
        ...page,
        components: updatedComponents,
        updatedAt: new Date().toISOString()
      }
      
      // 保存到文件
      await FileStorageService.savePage(updatedPage)
      
      // 更新内存中的页面
      const memoryIndex = savedPages.value.findIndex(p => p.id === pageId)
      if (memoryIndex > -1) {
        savedPages.value[memoryIndex] = updatedPage
      }
      
      // 如果是当前查看的页面，也要更新
      if (currentViewingPage.value?.id === pageId) {
        currentViewingPage.value = updatedPage
      }
      
      return true
    } catch (error) {
      console.error('更新页面组件失败:', error)
      throw new Error('更新组件失败')
    } finally {
      isLoading.value = false
    }
  }
  
  // 工具函数
  function generatePageId(): string {
    return 'page_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }
  
  // 初始化
  initializePages()
  
  return {
    // 状态
    savedPages,
    currentViewingPage,
    isLoading,
    
    // 计算属性
    pagesCount,
    
    // 方法
    initializePages,
    savePage,
    deletePage,
    getPage,
    duplicatePage,
    updatePageComponent
  }
}) 