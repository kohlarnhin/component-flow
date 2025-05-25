<template>
  <ComponentRenderer
    :component="component"
    context="page"
  />
</template>

<script setup lang="ts">
import type { CanvasComponent } from '@/types/global.types'
import ComponentRenderer from '@/components/ComponentRenderer.vue'

// 组件属性
interface Props {
  component: CanvasComponent
}

const props = defineProps<Props>()
</script> 