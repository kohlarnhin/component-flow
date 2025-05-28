import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { pageService } from '@/utils/database'
import type { CanvasComponent, SavedPage } from '@/types/global.types'

export const usePagesStore = defineStore('pages', () => {
  // 状态
  const pages = ref<SavedPage[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 计算属性
  const pagesCount = computed(() => pages.value.length)
  
  const savedPages = computed(() => pages.value)
  
  const publicPages = computed(() => 
    pages.value.filter(page => page.is_public)
  )
  
  const privatePages = computed(() => 
    pages.value.filter(page => !page.is_public)
  )

  const recentPages = computed(() => 
    [...pages.value]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
  )

  // 操作方法
  async function loadPages() {
    try {
      loading.value = true
      error.value = null
      pages.value = await pageService.getAllPages()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '加载页面失败'
      console.error('加载页面失败:', err)
    } finally {
      loading.value = false
    }
  }

  async function savePage(pageData: {
    name: string
    description?: string
    components: CanvasComponent[]
    thumbnail?: string
    is_public?: boolean
    tags?: string[]
  }): Promise<number> {
    try {
      loading.value = true
      error.value = null
      
      const pageId = await pageService.savePage({
        name: pageData.name,
        description: pageData.description || '',
        components: pageData.components,
        thumbnail: pageData.thumbnail,
        is_public: pageData.is_public ?? true,
        tags: pageData.tags || []
      })
      
      // 重新加载页面列表
      await loadPages()
      
      return pageId as number
    } catch (err) {
      error.value = err instanceof Error ? err.message : '保存页面失败'
      console.error('保存页面失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePage(id: number, pageData: Partial<{
    name: string
    description: string
    components: CanvasComponent[]
    thumbnail: string
    is_public: boolean
    tags: string[]
  }>) {
    try {
      loading.value = true
      error.value = null
      
      await pageService.updatePage(id, pageData)
      
      // 重新加载页面列表
      await loadPages()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '更新页面失败'
      console.error('更新页面失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deletePage(id: number) {
    try {
      loading.value = true
      error.value = null
      
      await pageService.deletePage(id)
      
      // 重新加载页面列表
      await loadPages()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '删除页面失败'
      console.error('删除页面失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  function getPageById(id: number): SavedPage | undefined {
    return pages.value.find(page => page.id === id)
  }

  async function getPage(id: string | number): Promise<SavedPage | null> {
    try {
      const pageId = typeof id === 'string' ? parseInt(id) : id
      return await pageService.getPageById(pageId)
    } catch (err) {
      console.error('获取页面失败:', err)
      return null
    }
  }

  async function searchPages(keyword: string): Promise<SavedPage[]> {
    try {
      if (!keyword.trim()) {
        return pages.value
      }
      
      return await pageService.searchPages(keyword)
    } catch (err) {
      console.error('搜索页面失败:', err)
      return []
    }
  }

  // 根据标签获取页面
  function getPagesByTag(tag: string): SavedPage[] {
    return pages.value.filter(page => 
      page.tags && page.tags.includes(tag)
    )
  }

  // 获取所有标签
  const allTags = computed(() => {
    const tags = new Set<string>()
    pages.value.forEach(page => {
      if (page.tags) {
        page.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  })

  // 复制页面
  async function duplicatePage(id: number, newName?: string): Promise<number> {
    const originalPage = getPageById(id)
    if (!originalPage) {
      throw new Error('页面不存在')
    }

    const duplicatedName = newName || `${originalPage.name} (副本)`
    
    return await savePage({
      name: duplicatedName,
      description: originalPage.description,
      components: JSON.parse(JSON.stringify(originalPage.components)), // 深拷贝
      thumbnail: originalPage.thumbnail,
      is_public: originalPage.is_public,
      tags: originalPage.tags
    })
  }

  // 初始化
  async function init() {
    await loadPages()
  }

  // 初始化页面（别名）
  async function initializePages() {
    await init()
  }

  // 批量操作
  async function deletePages(ids: number[]) {
    try {
      loading.value = true
      error.value = null
      
      for (const id of ids) {
        await pageService.deletePage(id)
      }
      
      await loadPages()
    } catch (err) {
      error.value = err instanceof Error ? err.message : '批量删除失败'
      console.error('批量删除失败:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updatePageVisibility(id: number, isPublic: boolean) {
    const page = getPageById(id)
    if (!page) {
      throw new Error('页面不存在')
    }
    
    await updatePage(id, { 
      name: page.name || '未命名页面',
      description: page.description || '',
      components: page.components,
      is_public: isPublic,
      tags: page.tags || []
    })
  }

  // 更新页面中的组件
  async function updatePageComponent(pageId: number, componentId: string, newConfig: any) {
    const page = getPageById(pageId)
    if (!page) {
      throw new Error('页面不存在')
    }

    const updatedComponents = page.components.map(comp => 
      comp.id === componentId ? { ...comp, config: newConfig } : comp
    )

    // 确保必需字段不为空，避免数据库约束错误
    await updatePage(pageId, { 
      name: page.name || '未命名页面',
      description: page.description || '',
      components: updatedComponents,
      is_public: page.is_public ?? true,
      tags: page.tags || []
    })
  }

  // 导入页面
  async function importPage(pageConfig: {
    name: string
    description?: string
    components: CanvasComponent[]
    tags?: string[]
  }): Promise<number> {
    return await savePage({
      ...pageConfig,
      is_public: true
    })
  }

  // 导出页面
  function exportPage(id: number): SavedPage | null {
    const page = getPageById(id)
    return page ? { ...page } : null
  }

  return {
    // 状态
    pages,
    loading,
    error,
    
    // 计算属性
    pagesCount,
    savedPages,
    publicPages,
    privatePages,
    recentPages,
    allTags,
    
    // 方法
    loadPages,
    savePage,
    updatePage,
    deletePage,
    getPageById,
    getPage,
    searchPages,
    getPagesByTag,
    duplicatePage,
    deletePages,
    updatePageVisibility,
    updatePageComponent,
    importPage,
    exportPage,
    init,
    initializePages
  }
}) 