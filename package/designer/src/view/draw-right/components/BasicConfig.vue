<template>
  <div class="p-6">
    <el-form label-position="top" size="small">
      <el-form-item label="组件类型">
        <el-input :value="selectedComponent.tag" disabled />
      </el-form-item>

      <el-divider content-position="left">基础属性</el-divider>

      <el-form-item label="ID">
        <el-input
          :model-value="selectedComponent.props.id"
          placeholder="组件 ID"
          @update:model-value="updateProp('id', $event)"
        />
      </el-form-item>

      <el-form-item label="Class">
        <el-input
          :model-value="selectedComponent.props.class"
          placeholder="CSS 类名"
          @update:model-value="updateProp('class', $event)"
        />
      </el-form-item>

      <el-form-item label="样式">
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
import type { CanvasComponent } from '@designer/view/draw-center/index.vue'

// Props
interface Props {
  selectedComponent: CanvasComponent
}

defineProps<Props>()

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
</script>
