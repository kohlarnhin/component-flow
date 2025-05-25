<template>
  <ComponentRenderer
    :component="component"
    context="preview"
    :all-components="allComponents"
  />
</template>

<script setup lang="ts">
import { useCanvasStore } from '@/stores/canvas.store'
import type { CanvasComponent } from '@/types/global.types'
import ComponentRenderer from '@/components/ComponentRenderer.vue'

// 组件属性
interface Props {
  component: CanvasComponent
}

// 事件定义
interface Emits {
  'api-call': [url: string, method: string, data?: any]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 状态管理
const canvasStore = useCanvasStore()

// 获取所有组件用于参数收集
const allComponents = canvasStore.components
</script> 