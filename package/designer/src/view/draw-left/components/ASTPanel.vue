<template>
  <div class="flex h-full flex-col p-4">
    <!-- 统计信息 -->
    <div class="mb-4 rounded-lg bg-linear-to-r from-blue-50 to-indigo-50 p-4">
      <div class="mb-3 flex items-center justify-between">
        <h4 class="m-0 text-sm font-semibold text-gray-800">统计信息</h4>
        <el-tag v-if="astStats.totalNodes > 0" size="small" effect="plain">实时</el-tag>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div class="rounded-lg bg-white p-2 text-center shadow-sm">
          <div class="text-lg font-bold text-blue-600">{{ astStats.totalNodes }}</div>
          <div class="text-xs text-gray-500">节点</div>
        </div>
        <div class="rounded-lg bg-white p-2 text-center shadow-sm">
          <div class="text-lg font-bold text-indigo-600">{{ astStats.depth }}</div>
          <div class="text-xs text-gray-500">深度</div>
        </div>
        <div class="rounded-lg bg-white p-2 text-center shadow-sm">
          <div class="text-lg font-bold text-purple-600">{{ astStats.elementCount }}</div>
          <div class="text-xs text-gray-500">元素</div>
        </div>
      </div>
    </div>

    <!-- AST 结构查看器 -->
    <div class="flex flex-1 flex-col">
      <div class="mb-2 flex items-center justify-between">
        <h4 class="m-0 text-sm font-semibold text-gray-800">AST 结构</h4>
        <el-tag v-if="astText" size="small" type="info" effect="plain">实时预览</el-tag>
      </div>
      <div ref="astContainerRef" class="flex-1 overflow-hidden">
        <!-- JSON 树形视图 -->
        <div
          v-if="astData"
          class="ast-viewer h-full rounded-lg border border-gray-200 bg-white p-3"
        >
          <VueJsonPretty
            :data="astData"
            :deep="5"
            :show-length="true"
            :show-line="false"
            :show-double-quotes="false"
            :height="astViewerHeight"
            virtual
          />
        </div>
        <!-- 空状态 -->
        <div
          v-else
          class="flex h-full min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50"
        >
          <el-icon :size="48" class="mb-3 text-gray-300">
            <Document />
          </el-icon>
          <p class="text-sm text-gray-400">画布为空,拖拽组件开始设计</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Document } from '@element-plus/icons-vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import type { ASTStats } from '@designer/types/draw-left'

// Props
interface Props {
  astStats: ASTStats
  astText: string
}

const props = defineProps<Props>()

/**
 * AST 容器引用
 */
const astContainerRef = ref<HTMLDivElement>()

/**
 * AST 查看器高度
 */
const astViewerHeight = ref(400)

/**
 * 计算 AST 查看器高度
 */
function calculateHeight() {
  if (astContainerRef.value) {
    // 获取容器高度,减去 padding 和 border
    const containerHeight = astContainerRef.value.clientHeight
    // 减去内边距 (p-3 = 12px * 2 = 24px) 和边框 (1px * 2 = 2px)
    astViewerHeight.value = Math.max(containerHeight - 26, 300)
  }
}

/**
 * 监听窗口大小变化
 */
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  // 初始计算
  calculateHeight()

  // 使用 ResizeObserver 监听容器大小变化
  if (astContainerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      calculateHeight()
    })
    resizeObserver.observe(astContainerRef.value)
  }
})

onUnmounted(() => {
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

/**
 * 解析 AST 文本为 JSON 对象
 */
const astData = computed(() => {
  if (!props.astText) return null
  try {
    return JSON.parse(props.astText)
  } catch {
    return null
  }
})
</script>

<style scoped>
/* 自定义 AST 查看器样式 */
.ast-viewer :deep(.vjs-tree) {
  font-size: 13px;
  line-height: 1.6;
}

.ast-viewer :deep(.vjs-key) {
  color: #6366f1;
  font-weight: 500;
}

.ast-viewer :deep(.vjs-value-string) {
  color: #10b981;
}

.ast-viewer :deep(.vjs-value-number) {
  color: #f59e0b;
}

.ast-viewer :deep(.vjs-value-boolean) {
  color: #8b5cf6;
}

.ast-viewer :deep(.vjs-tree-node) {
  padding: 2px 0;
}

.ast-viewer :deep(.vjs-tree-node:hover) {
  background-color: #f9fafb;
}
</style>
