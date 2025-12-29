<template>
  <div class="p-4">
    <!-- 操作按钮 -->
    <div class="mb-4 flex gap-2">
      <el-button type="primary" size="small" @click="handleParseToAST"> 解析为 AST </el-button>
      <el-button type="success" size="small" @click="handleGenerateCode"> 生成代码 </el-button>
      <el-button size="small" @click="handleClearCanvas">清空画布</el-button>
    </div>

    <!-- 统计信息 -->
    <div class="mb-4 rounded bg-gray-50 p-3">
      <h4 class="m-0 mb-2 text-sm text-gray-800">统计信息</h4>
      <ul class="m-0 list-none p-0">
        <li class="py-1 text-xs text-gray-600">节点总数: {{ astStats.totalNodes }}</li>
        <li class="py-1 text-xs text-gray-600">树深度: {{ astStats.depth }}</li>
        <li class="py-1 text-xs text-gray-600">元素节点: {{ astStats.elementCount }}</li>
      </ul>
    </div>

    <!-- AST 结构查看器 -->
    <div>
      <h4 class="m-0 mb-2 text-sm text-gray-800">AST 结构</h4>
      <el-scrollbar height="400px">
        <pre
          class="m-0 overflow-x-auto rounded bg-gray-800 p-3 text-xs leading-relaxed text-gray-300"
          >{{ astText }}</pre
        >
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * AST 统计信息接口
 */
export interface ASTStats {
  totalNodes: number
  depth: number
  elementCount: number
}

// Props
interface Props {
  astStats: ASTStats
  astText: string
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  parseToAST: []
  generateCode: []
  clearCanvas: []
}>()

// 解析为 AST
function handleParseToAST() {
  emit('parseToAST')
}

// 生成代码
function handleGenerateCode() {
  emit('generateCode')
}

// 清空画布
function handleClearCanvas() {
  emit('clearCanvas')
}
</script>
