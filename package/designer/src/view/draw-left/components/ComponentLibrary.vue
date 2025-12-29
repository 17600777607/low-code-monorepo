<template>
  <div class="p-4">
    <!-- 组件分类 -->
    <div v-for="category in componentCategories" :key="category.name" class="mb-6">
      <h3 class="mb-3 border-l-3 border-blue-500 pl-2 text-sm font-semibold text-gray-800">
        {{ category.label }}
      </h3>
      <div class="grid grid-cols-2 gap-2">
        <div
          v-for="comp in category.components"
          :key="comp.tag"
          class="flex cursor-move flex-col items-center justify-center rounded border border-gray-200 bg-gray-50 p-3 transition-all hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:shadow-md"
          draggable="true"
          @dragstart="handleDragStart($event, comp)"
        >
          <el-icon class="mb-1 text-2xl text-blue-500">
            <component :is="comp.icon" />
          </el-icon>
          <span class="text-xs text-gray-600">{{ comp.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Grid, Edit, Reading } from '@element-plus/icons-vue'

/**
 * 组件定义接口
 */
export interface ComponentDef {
  tag: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultProps: Record<string, any>
  defaultChildren: string
}

/**
 * 组件分类接口（二级数据结构）
 */
export interface ComponentCategory {
  name: string
  label: string
  components: ComponentDef[]
}

// Emits
const emit = defineEmits<{
  dragStart: [event: globalThis.DragEvent, comp: ComponentDef]
}>()

// 组件分类数据（二级结构）
const componentCategories: ComponentCategory[] = [
  {
    name: 'basic',
    label: '基础组件',
    components: [
      {
        tag: 'el-button',
        label: '按钮',
        icon: Edit,
        defaultProps: { type: 'primary' },
        defaultChildren: '按钮',
      },
      {
        tag: 'el-text',
        label: '文本',
        icon: Reading,
        defaultProps: { style: 'font-size: 14px; color: #606266;' },
        defaultChildren: '文本内容',
      },
      {
        tag: 'el-link',
        label: '链接',
        icon: Reading,
        defaultProps: { href: '#' },
        defaultChildren: '链接',
      },
      {
        tag: 'div',
        label: '容器',
        icon: Grid,
        defaultProps: { class: 'container' },
        defaultChildren: '',
      },
    ],
  },
  {
    name: 'form',
    label: '表单组件',
    components: [
      {
        tag: 'el-input',
        label: '输入框',
        icon: Edit,
        defaultProps: { placeholder: '请输入' },
        defaultChildren: '',
      },
      {
        tag: 'el-select',
        label: '选择器',
        icon: Edit,
        defaultProps: { placeholder: '请选择' },
        defaultChildren: '',
      },
      {
        tag: 'el-checkbox',
        label: '多选框',
        icon: Edit,
        defaultProps: {},
        defaultChildren: '选项',
      },
      {
        tag: 'el-radio',
        label: '单选框',
        icon: Edit,
        defaultProps: {},
        defaultChildren: '选项',
      },
      {
        tag: 'el-switch',
        label: '开关',
        icon: Edit,
        defaultProps: {},
        defaultChildren: '',
      },
    ],
  },
  {
    name: 'layout',
    label: '布局组件',
    components: [
      {
        tag: 'el-row',
        label: '行',
        icon: Grid,
        defaultProps: {},
        defaultChildren: '',
      },
      {
        tag: 'el-col',
        label: '列',
        icon: Grid,
        defaultProps: { span: 12 },
        defaultChildren: '',
      },
      {
        tag: 'el-card',
        label: '卡片',
        icon: Grid,
        defaultProps: {},
        defaultChildren: '卡片内容',
      },
      {
        tag: 'el-container',
        label: '容器',
        icon: Grid,
        defaultProps: {},
        defaultChildren: '',
      },
    ],
  },
]

// 拖拽开始
function handleDragStart(event: globalThis.DragEvent, comp: ComponentDef) {
  emit('dragStart', event, comp)
}
</script>
