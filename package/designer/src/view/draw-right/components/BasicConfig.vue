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

      <!-- 表单组件特定属性 -->
      <template v-if="isFormComponent(selectedComponent.tag)">
        <el-divider content-position="left">表单属性</el-divider>

        <el-form-item label="占位符">
          <el-input
            :model-value="selectedComponent.props.placeholder"
            placeholder="请输入占位符"
            @update:model-value="updateProp('placeholder', $event)"
          />
        </el-form-item>

        <el-form-item label="禁用">
          <el-switch
            :model-value="selectedComponent.props.disabled"
            @update:model-value="updateProp('disabled', $event)"
          />
        </el-form-item>

        <el-form-item label="必填">
          <el-switch
            :model-value="selectedComponent.props.required"
            @update:model-value="updateProp('required', $event)"
          />
        </el-form-item>
      </template>

      <!-- 按钮组件特定属性 -->
      <template v-if="selectedComponent.tag === 'el-button'">
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
      </template>

      <el-divider content-position="left">操作</el-divider>

      <el-button type="danger" @click="handleRemoveSelectedComponent">
        删除组件
      </el-button>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { CanvasComponent } from '../../draw-center/index.vue'

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

// 判断是否为表单组件
function isFormComponent(tag: string): boolean {
  return ['el-input', 'el-select', 'el-checkbox', 'el-radio', 'el-switch'].includes(tag)
}

// 更新属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateProp(key: string, value: any) {
  emit('updateProp', key, value)
}

// 更新子内容
function updateChildren(value: string) {
  emit('updateChildren', value)
}

// 删除选中的组件
function handleRemoveSelectedComponent() {
  emit('removeSelectedComponent')
}
</script>
