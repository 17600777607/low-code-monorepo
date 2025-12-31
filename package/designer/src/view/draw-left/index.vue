<template>
  <aside class="flex w-[280px] flex-col border-r border-gray-200 bg-white">
    <el-tabs v-model="activeTab" class="flex flex-1 flex-col" stretch>
      <!-- 组件库 Tab -->
      <el-tab-pane label="组件库" name="components">
        <ComponentLibrary @drag-start="handleDragStart" />
      </el-tab-pane>

      <!-- AST Tab -->
      <el-tab-pane label="AST" name="ast">
        <ASTPanel :ast-stats="astStats" :ast-text="astText" />
      </el-tab-pane>
    </el-tabs>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ComponentLibrary from './components/ComponentLibrary.vue'
import ASTPanel from './components/ASTPanel.vue'
import type { ComponentDef } from './components/ComponentLibrary.vue'
import type { ASTStats } from '@designer/types/draw-left'

// Props
interface Props {
  astStats: ASTStats
  astText: string
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  dragStart: [event: globalThis.DragEvent, comp: ComponentDef]
  generateCode: []
  clearCanvas: []
}>()

// 左侧 tab 状态
const activeTab = ref('components')

// 拖拽开始
function handleDragStart(event: globalThis.DragEvent, comp: ComponentDef) {
  emit('dragStart', event, comp)
}
</script>

<style scoped>
:deep(.el-tabs__header) {
  padding-top: 22px;
}
:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}
:deep(.el-tab-pane) {
  height: 100%;
}
</style>
