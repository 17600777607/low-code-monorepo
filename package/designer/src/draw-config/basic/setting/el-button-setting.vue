<template>
  <div>
    <el-divider content-position="left">按钮属性</el-divider>

    <el-form-item label="类型">
      <el-select
        :model-value="selectedComponent.props.type"
        @update:model-value="updateProp('type', $event)"
      >
        <el-option
          v-for="option in EL_BUTTON_TYPE_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
      </el-select>
    </el-form-item>

    <el-form-item label="尺寸">
      <el-select
        :model-value="selectedComponent.props.size"
        @update:model-value="updateProp('size', $event)"
      >
        <el-option
          v-for="option in EL_BUTTON_SIZE_OPTIONS"
          :key="option.value"
          :label="option.label"
          :value="option.value"
        />
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
import type { CanvasComponent } from '@designer/types/draw-center'
import {
  EL_BUTTON_TYPE_OPTIONS,
  EL_BUTTON_SIZE_OPTIONS,
} from '@designer/constants/el-button-options'

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
