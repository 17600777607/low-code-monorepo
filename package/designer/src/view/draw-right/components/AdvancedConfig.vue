<template>
  <div class="p-6">
    <el-form label-position="top" size="small">
      <el-divider content-position="left">事件配置</el-divider>

      <el-form-item label="点击事件">
        <el-input
          :model-value="selectedComponent.props['@click']"
          placeholder="handleClick"
          @update:model-value="updateProp('@click', $event)"
        />
      </el-form-item>

      <el-form-item label="双击事件">
        <el-input
          :model-value="selectedComponent.props['@dblclick']"
          placeholder="handleDoubleClick"
          @update:model-value="updateProp('@dblclick', $event)"
        />
      </el-form-item>

      <el-form-item label="鼠标移入事件">
        <el-input
          :model-value="selectedComponent.props['@mouseenter']"
          placeholder="handleMouseEnter"
          @update:model-value="updateProp('@mouseenter', $event)"
        />
      </el-form-item>

      <el-form-item label="鼠标移出事件">
        <el-input
          :model-value="selectedComponent.props['@mouseleave']"
          placeholder="handleMouseLeave"
          @update:model-value="updateProp('@mouseleave', $event)"
        />
      </el-form-item>

      <el-divider content-position="left">数据绑定</el-divider>

      <el-form-item label="v-model">
        <el-input
          :model-value="selectedComponent.props['v-model']"
          placeholder="formData.field"
          @update:model-value="updateProp('v-model', $event)"
        />
      </el-form-item>

      <el-form-item label="v-if">
        <el-input
          :model-value="selectedComponent.props['v-if']"
          placeholder="条件表达式"
          @update:model-value="updateProp('v-if', $event)"
        />
      </el-form-item>

      <el-form-item label="v-show">
        <el-input
          :model-value="selectedComponent.props['v-show']"
          placeholder="条件表达式"
          @update:model-value="updateProp('v-show', $event)"
        />
      </el-form-item>

      <el-divider content-position="left">高级属性</el-divider>

      <el-form-item label="自定义属性">
        <el-input
          type="textarea"
          :rows="4"
          :model-value="customPropsText"
          placeholder='{"key": "value"}'
          @update:model-value="handleCustomPropsChange"
        />
        <div class="mt-1 text-xs text-gray-500">
          JSON 格式，例如: {"data-id": "123", "aria-label": "按钮"}
        </div>
      </el-form-item>

      <el-form-item label="组件备注">
        <el-input
          type="textarea"
          :rows="3"
          :model-value="selectedComponent.props['data-comment']"
          placeholder="组件说明或备注信息"
          @update:model-value="updateProp('data-comment', $event)"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { CanvasComponent } from '../../draw-center/index.vue'

// Props
interface Props {
  selectedComponent: CanvasComponent
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProp: [key: string, value: any]
}>()

// 自定义属性文本
const customPropsText = computed(() => {
  const customProps: Record<string, any> = {}
  const excludeKeys = [
    'id',
    'class',
    'style',
    'type',
    'size',
    'placeholder',
    'disabled',
    'required',
    '@click',
    '@dblclick',
    '@mouseenter',
    '@mouseleave',
    'v-model',
    'v-if',
    'v-show',
    'data-comment',
  ]

  Object.keys(props.selectedComponent.props).forEach(key => {
    if (!excludeKeys.includes(key)) {
      customProps[key] = props.selectedComponent.props[key]
    }
  })

  return Object.keys(customProps).length > 0 ? JSON.stringify(customProps, null, 2) : ''
})

// 更新属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateProp(key: string, value: any) {
  emit('updateProp', key, value)
}

// 处理自定义属性变化
function handleCustomPropsChange(value: string) {
  if (!value.trim()) {
    return
  }

  try {
    const customProps = JSON.parse(value)
    if (typeof customProps !== 'object' || Array.isArray(customProps)) {
      ElMessage.error('自定义属性必须是一个对象')
      return
    }

    // 更新所有自定义属性
    Object.entries(customProps).forEach(([key, val]) => {
      updateProp(key, val)
    })

    ElMessage.success('自定义属性已更新')
  } catch (error) {
    ElMessage.error('JSON 格式错误，请检查输入')
  }
}
</script>
