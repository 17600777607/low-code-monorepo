<template>
  <main class="mx-px flex flex-1 flex-col bg-white">
    <!-- 画布容器 -->
    <div
      ref="canvasContainerRef"
      class="canvas-container"
      :class="{ 'grid-enabled': showGrid }"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <!-- 空状态 -->
      <div v-if="canvasComponents.length === 0" class="empty-state">
        <el-empty description="从左侧拖拽组件到这里开始设计" />
      </div>

      <!-- 使用递归组件渲染画布节点 -->
      <CanvasNode
        v-for="comp in canvasComponents"
        :key="comp.id || `comp-${Math.random()}`"
        :ast-node="comp"
        :selected-id="selectedComponentId || undefined"
        @select="handleSelectNode"
        @update="handleUpdateNode"
        @drop-into="handleDropInto"
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import CanvasNode from './components/CanvasNode.vue'
import type { ElementNode } from '@designer/ast/types'

// Re-export 以保持向后兼容
export type { CanvasComponent } from '@designer/types/draw-center'

// Props
interface Props {
  canvasComponents: ElementNode[] // 改用 ElementNode 类型
  selectedIndex: number | null
}

const props = defineProps<Props>()

// 状态
const showGrid = ref(true) // 是否显示网格
const selectedComponentId = ref<string | null>(null)

// Emits
const emit = defineEmits<{
  drop: [event: globalThis.DragEvent]
  selectComponent: [id: string]
  updateComponent: [node: ElementNode]
  removeComponent: [id: string]
}>()

// 拖拽放置到画布
const handleDrop = (event: globalThis.DragEvent) => {
  emit('drop', event)
}

// 选择节点
const handleSelectNode = (id: string) => {
  selectedComponentId.value = id
  // 通过 id 找到索引并触发原有事件（保持兼容性）
  const index = props.canvasComponents.findIndex(comp => comp.id === id)
  if (index !== -1) {
    emit('selectComponent', id)
  }
}

// 更新节点
const handleUpdateNode = (node: ElementNode) => {
  emit('updateComponent', node)
}

// 处理拖入容器
const handleDropInto = (_payload: { targetId: string; sourceNode: ElementNode }) => {
  // TODO: 实现将 sourceNode 添加到 targetId 容器的 children
}
</script>

<style scoped>
/* 画布容器 */
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: #f9fafb;
  overflow: auto;
}

/* 网格背景 */
.canvas-container.grid-enabled {
  background-image:
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: -1px -1px;
}

/* 空状态 */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 400px;
}
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
