<template>
  <el-divider content-position="left">输入框属性</el-divider>

  <el-form-item label="类型">
    <el-select
      :model-value="selectedComponent.props.type"
      @update:model-value="updateProp('type', $event)"
    >
      <el-option
        v-for="option in EL_INPUT_TYPE_OPTIONS"
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
        v-for="option in EL_INPUT_SIZE_OPTIONS"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>
  </el-form-item>

  <el-form-item label="占位符">
    <el-input
      v-model="localPlaceholder"
      placeholder="输入占位符文本"
      @input="handlePlaceholderInput"
    />
  </el-form-item>

  <el-form-item label="默认值">
    <el-input v-model="localModelValue" placeholder="输入默认值" @input="handleModelValueInput" />
  </el-form-item>

  <el-form-item label="禁用">
    <el-switch
      :model-value="selectedComponent.props.disabled"
      @update:model-value="updateProp('disabled', $event)"
    />
  </el-form-item>

  <el-form-item label="可清空">
    <el-switch
      :model-value="selectedComponent.props.clearable"
      @update:model-value="updateProp('clearable', $event)"
    />
  </el-form-item>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import type { CanvasComponent } from '@designer-vue/types/draw-center'
import {
  EL_INPUT_TYPE_OPTIONS,
  EL_INPUT_SIZE_OPTIONS,
} from '@designer-vue/constants/el-input-options'

/**
 * 输入框组件配置面板
 */

// Props
interface Props {
  selectedComponent: CanvasComponent
}

const props = defineProps<Props>()

// 本地状态 - 避免每次输入都重渲染
const localPlaceholder = ref(props.selectedComponent.props.placeholder || '')
const localModelValue = ref(props.selectedComponent.props['model-value'] || '')

// 监听外部数据变化
watch(
  () => props.selectedComponent.props.placeholder,
  newVal => {
    localPlaceholder.value = newVal || ''
  }
)

watch(
  () => props.selectedComponent.props['model-value'],
  newVal => {
    localModelValue.value = newVal || ''
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
 * 防抖更新属性
 */
const updatePropDebounced = useDebounceFn((key: string, value: unknown) => {
  emit('updateProp', key, value)
}, 300)

/**
 * 处理占位符输入
 */
function handlePlaceholderInput(value: string) {
  updatePropDebounced('placeholder', value)
}

/**
 * 处理默认值输入
 */
function handleModelValueInput(value: string) {
  updatePropDebounced('model-value', value)
}
</script>
