<template>
  <main class="mx-px flex flex-1 flex-col bg-white">
    <!-- 画布头部 -->
    <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <h2 class="m-0 text-lg text-gray-800">设计画布</h2>
      <div>
        <el-button-group>
          <el-button size="small" :icon="Delete" @click="handleClearCanvas"> 清空 </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 画布容器 -->
    <div
      class="h-full flex-1 overflow-y-auto bg-gray-50 p-6"
      @drop="handleDrop"
      @dragover.prevent
      @dragenter.prevent
    >
      <!-- 空状态 -->
      <div v-if="canvasComponents.length === 0" class="flex h-full items-center justify-center">
        <el-empty description="从左侧拖拽组件到这里开始设计" />
      </div>

      <!-- 组件列表 -->
      <div v-else class="flex flex-col gap-3">
        <div
          v-for="(comp, index) in canvasComponents"
          :key="index"
          class="group relative cursor-pointer rounded border-2 border-transparent bg-white p-4 transition-all hover:border-blue-500 hover:shadow-md"
          :class="{ 'border-blue-500 shadow-lg': selectedIndex === index }"
          @click="handleSelectComponent(index)"
        >
          <component
            :is="resolveComponentTag(comp.tag)"
            v-bind="comp.props"
            class="pointer-events-none"
          >
            {{ comp.children }}
          </component>
          <div
            class="absolute top-2 right-2 opacity-0 transition-opacity group-hover:opacity-100"
            :class="{ 'opacity-100': selectedIndex === index }"
          >
            <el-button
              type="danger"
              size="small"
              circle
              :icon="Delete"
              @click.stop="handleRemoveComponent(index)"
            />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type Component } from 'vue'
import { Delete } from '@element-plus/icons-vue'
import type { CanvasComponent } from '@designer/types/draw-center'

// Re-export 以保持向后兼容
export type { CanvasComponent } from '@designer/types/draw-center'

// Props
interface Props {
  canvasComponents: CanvasComponent[]
  selectedIndex: number | null
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  drop: [event: globalThis.DragEvent]
  selectComponent: [index: number]
  removeComponent: [index: number]
  clearCanvas: []
}>()

// 组件缓存
const componentCache = new Map<string, Component | string>()

/**
 * 将 kebab-case 转换为 PascalCase
 * el-button -> ElButton
 */
function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * 动态解析组件
 */
function resolveComponentTag(tag: string): Component | string {
  // 检查缓存
  if (componentCache.has(tag)) {
    return componentCache.get(tag)!
  }

  // 原生 HTML 标签
  const nativeTags = ['div', 'span', 'p', 'section', 'article', 'header', 'footer']
  if (nativeTags.includes(tag)) {
    componentCache.set(tag, tag)
    return tag
  }

  // Element Plus 组件
  if (tag.startsWith('el-')) {
    const componentName = kebabToPascal(tag)

    // 使用异步组件动态导入
    const asyncComponent = defineAsyncComponent(() =>
      import('element-plus')
        .then(module => {
          const comp = module[componentName as keyof typeof module]
          if (!comp) {
            return { template: '<div>组件不存在</div>' }
          }
          return comp as Component
        })
        .catch(_error => {
          return { template: '<div>加载失败</div>' }
        })
    )

    componentCache.set(tag, asyncComponent)
    return asyncComponent
  }

  // 默认返回 div
  componentCache.set(tag, 'div')
  return 'div'
}

// 拖拽放置
function handleDrop(event: globalThis.DragEvent) {
  emit('drop', event)
}

// 选择组件
function handleSelectComponent(index: number) {
  emit('selectComponent', index)
}

// 移除组件
function handleRemoveComponent(index: number) {
  emit('removeComponent', index)
}

// 清空画布
function handleClearCanvas() {
  emit('clearCanvas')
}
</script>

<style scoped>
.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}
</style>
