<template>
  <div>
    <el-divider content-position="left">卡片属性</el-divider>

    <el-form-item label="标题">
      <el-input
        :model-value="selectedComponent.props.header"
        placeholder="卡片标题"
        @update:model-value="updateProp('header', $event)"
      />
    </el-form-item>

    <el-form-item label="阴影">
      <el-select
        :model-value="selectedComponent.props.shadow"
        @update:model-value="updateProp('shadow', $event)"
      >
        <el-option label="总是显示" value="always" />
        <el-option label="悬停显示" value="hover" />
        <el-option label="从不显示" value="never" />
      </el-select>
    </el-form-item>

    <el-form-item label="内容">
      <el-input
        :model-value="selectedComponent.children"
        type="textarea"
        :rows="3"
        placeholder="卡片内容"
        @update:model-value="updateChildren($event)"
      />
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import type { CanvasComponent } from '../../../view/draw-center/index.vue'

/**
 * 卡片组件配置面板
 * 用于配置 el-card 组件的特定属性
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
