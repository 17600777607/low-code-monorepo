<template>
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
      v-model="localChildren"
      placeholder="按钮文本"
      @input="handleTextInput(localChildren)"
    />
  </el-form-item>

  <el-form-item label="禁用">
    <el-switch
      :model-value="selectedComponent.props.disabled"
      @update:model-value="updateProp('disabled', $event)"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { CanvasComponent } from '@designer-vue/types/draw-center'
import {
  EL_BUTTON_TYPE_OPTIONS,
  EL_BUTTON_SIZE_OPTIONS,
} from '@designer-vue/constants/el-button-options'

/**
 * 按钮组件配置面板
 * 用于配置 el-button 组件的特定属性
 */

// Props
interface Props {
  selectedComponent: CanvasComponent
}

const props = defineProps<Props>()

// 本地状态 - 避免每次输入都重渲染
const localChildren = ref(props.selectedComponent.children)

// 监听外部数据变化
watch(
  () => props.selectedComponent.children,
  newVal => {
    localChildren.value = newVal
  }
)

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
 * 更新组件子内容（防抖）
 */
const updateChildrenDebounced = useDebounceFn((value: string) => {
  emit('updateChildren', value)
}, 300)

/**
 * 处理文本输入
 */
function handleTextInput(value: string) {
  updateChildrenDebounced(value)
}
</script>
