<template>
  <div class="p-6">
    <el-form label-position="top" size="small">
      <el-form-item label="组件类型">
        <el-input :value="selectedComponent.tag" disabled />
      </el-form-item>

      <el-divider content-position="left">画布属性</el-divider>

      <!-- 节点 ID -->
      <el-form-item label="节点 ID">
        <el-input :value="nodeId" disabled placeholder="自动生成" />
      </el-form-item>

      <!-- 位置信息 -->
      <el-form-item label="位置">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-input :value="positionX" placeholder="X" disabled>
              <template #prepend>X</template>
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-input :value="positionY" placeholder="Y" disabled>
              <template #prepend>Y</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 尺寸信息 -->
      <el-form-item label="尺寸">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-input :value="width" placeholder="宽度" disabled>
              <template #prepend>W</template>
            </el-input>
          </el-col>
          <el-col :span="12">
            <el-input :value="height" placeholder="高度" disabled>
              <template #prepend>H</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form-item>

      <!-- 布局模式 -->
      <el-form-item label="布局模式">
        <el-select :value="layout" disabled placeholder="请选择布局模式">
          <el-option label="Block" value="block" />
          <el-option label="Flex" value="flex" />
          <el-option label="Grid" value="grid" />
        </el-select>
      </el-form-item>

      <el-divider content-position="left">基础属性</el-divider>

      <el-form-item label="组件 ID">
        <el-input
          :model-value="selectedComponent.props.id"
          placeholder="组件 ID"
          @update:model-value="updateProp('id', $event)"
        />
      </el-form-item>

      <el-form-item label="组件 Class">
        <el-input
          :model-value="selectedComponent.props.class"
          placeholder="CSS 类名"
          @update:model-value="updateProp('class', $event)"
        />
      </el-form-item>

      <el-form-item label="组件样式">
        <el-input
          :model-value="selectedComponent.props.style"
          type="textarea"
          :rows="2"
          placeholder="内联样式"
          @update:model-value="updateProp('style', $event)"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CanvasComponent } from '@designer/types/draw-center'
import type { ElementNode } from '@designer/ast/types'

// Props
interface Props {
  selectedComponent: CanvasComponent
  // 原始的 ElementNode，用于读取 meta 信息
  rawNode?: ElementNode
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProp: [key: string, value: any]
  updateChildren: [value: string]
  removeSelectedComponent: []
}>()

// 更新属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateProp(key: string, value: any) {
  emit('updateProp', key, value)
}

// 从 rawNode 读取画布扩展属性
const nodeId = computed(() => props.rawNode?.id || '未生成')
const positionX = computed(() => props.rawNode?.meta?.position?.x?.toString() || '0')
const positionY = computed(() => props.rawNode?.meta?.position?.y?.toString() || '0')
const width = computed(() => {
  const w = props.rawNode?.meta?.size?.width
  return w ? w.toString() : 'auto'
})
const height = computed(() => {
  const h = props.rawNode?.meta?.size?.height
  return h ? h.toString() : 'auto'
})
const layout = computed(() => props.rawNode?.meta?.layout || 'block')
</script>
