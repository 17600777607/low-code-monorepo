<template>
  <div>
    <el-divider content-position="left">按钮属性</el-divider>

    <el-form-item label="类型">
      <el-select
        :model-value="selectedComponent.props.type"
        @update:model-value="updateProp('type', $event)"
      >
        <el-option label="默认" value="" />
        <el-option label="主要" value="primary" />
        <el-option label="成功" value="success" />
        <el-option label="警告" value="warning" />
        <el-option label="危险" value="danger" />
        <el-option label="信息" value="info" />
      </el-select>
    </el-form-item>

    <el-form-item label="尺寸">
      <el-select
        :model-value="selectedComponent.props.size"
        @update:model-value="updateProp('size', $event)"
      >
        <el-option label="大" value="large" />
        <el-option label="默认" value="default" />
        <el-option label="小" value="small" />
      </el-select>
    </el-form-item>

    <el-form-item label="文本">
      <el-input
        :model-value="selectedComponent.children"
        placeholder="按钮文本"
        @update:model-value="updateChildren($event)"
      />
    </el-form-item>

    <el-form-item label="禁用">
      <el-switch
        :model-value="selectedComponent.props.disabled"
        @update:model-value="updateProp('disabled', $event)"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import type { CanvasComponent } from '../../../view/draw-center/index.vue'

/**
 * 按钮组件配置面板
 * 用于配置 el-button 组件的特定属性
 */

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
}>()

/**
 * 更新组件属性
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateProp(key: string, value: any) {
  emit('updateProp', key, value)
}

/**
 * 更新组件子内容
 */
function updateChildren(value: string) {
  emit('updateChildren', value)
}
</script>
