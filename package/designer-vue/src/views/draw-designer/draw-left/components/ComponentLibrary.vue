<template>
  <div class="p-4">
    <!-- 组件分类 -->
    <div v-for="category in componentCategories" :key="category.name" class="mb-6">
      <h3 class="mb-3 border-l-3 border-blue-500 pl-2 text-sm font-semibold text-gray-800">
        {{ category.label }}
      </h3>

      <!-- 组件列表 -->
      <div v-if="category.components.length > 0" class="grid grid-cols-2 gap-2">
        <div
          v-for="comp in category.components"
          :key="comp.astNode.tag"
          class="flex cursor-move flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 p-3 transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
          draggable="true"
          @dragstart="handleDragStart($event, comp)"
        >
          <el-icon class="mb-1 text-2xl text-blue-500">
            <component :is="comp.icon" />
          </el-icon>
          <span class="text-xs text-gray-600">{{ comp.label }}</span>
        </div>
      </div>

      <!-- 空状态提示 -->
      <div
        v-else
        class="flex items-center justify-center rounded border border-dashed border-gray-300 bg-gray-50 p-6 text-gray-400"
      >
        <span class="text-sm">暂无数据</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { componentCategories } from '@designer-vue/draw-config'
import type { ComponentConfig } from '@designer-vue/types/componentsTypes'

/**
 * 组件定义接口
 * @deprecated 使用 ComponentConfig 替代
 */
export type ComponentDef = ComponentConfig

// Emits
const emit = defineEmits<{
  dragStart: [event: globalThis.DragEvent, comp: ComponentConfig]
}>()

// 拖拽开始
function handleDragStart(event: globalThis.DragEvent, comp: ComponentConfig) {
  emit('dragStart', event, comp)
}
</script>
