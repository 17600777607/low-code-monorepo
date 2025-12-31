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
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <el-input
              :model-value="width"
              placeholder="宽度"
              :disabled="isWidthAuto"
              @input="handleUpdateSize('width', $event)"
            >
              <template #prepend>W</template>
              <template #append>
                <el-select v-model="widthUnit" style="width: 70px" size="small">
                  <el-option label="px" value="px" />
                  <el-option label="%" value="%" />
                </el-select>
              </template>
            </el-input>
            <el-checkbox
              :model-value="isWidthAuto"
              label="Auto"
              size="small"
              @update:model-value="handleAutoChange('width', $event)"
            />
          </div>

          <div class="flex items-center gap-2">
            <el-input
              :model-value="height"
              placeholder="高度"
              :disabled="isHeightAuto"
              @input="handleUpdateSize('height', $event)"
            >
              <template #prepend>H</template>
              <template #append>
                <el-select v-model="heightUnit" style="width: 70px" size="small">
                  <el-option label="px" value="px" />
                  <el-option label="%" value="%" />
                </el-select>
              </template>
            </el-input>
            <el-checkbox
              :model-value="isHeightAuto"
              label="Auto"
              size="small"
              @update:model-value="handleAutoChange('height', $event)"
            />
          </div>
        </div>
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
import type { CanvasComponent } from '@designer-vue/types/draw-center'
import type { ElementNode } from '@designer-vue/ast/types'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateMeta: [key: string, value: any]
  updateChildren: [value: string]
  removeSelectedComponent: []
}>()

// 更新属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateProp(key: string, value: any) {
  emit('updateProp', key, value)
}

// 自动尺寸切换
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleAutoChange(key: 'width' | 'height', value: any) {
  const isAuto = !!value
  if (isAuto) {
    emit('updateMeta', `size.${key}`, undefined)
  } else {
    emit('updateMeta', `size.${key}`, 100)
  }
}

// 辅助函数：获取数值部分
const getNumericValue = (val: string | number | undefined) => {
  if (val === undefined) return ''
  return val.toString().replace(/[^0-9.]/g, '')
}

// 辅助函数：获取单位
const getUnit = (val: string | number | undefined) => {
  if (typeof val === 'string' && val.endsWith('%')) return '%'
  return 'px'
}

// 统一更新尺寸 (支持单位)
function handleUpdateSize(key: 'width' | 'height', numericValue: string, newUnit?: string) {
  // 获取当前单位
  const currentVal =
    key === 'width' ? props.rawNode?.meta?.size?.width : props.rawNode?.meta?.size?.height
  const unit = newUnit || getUnit(currentVal)

  // 纯数字验证
  const cleanNumStr = numericValue.replace(/[^\d.]/g, '')
  const num = parseFloat(cleanNumStr)

  if (isNaN(num)) {
    if (cleanNumStr === '') emit('updateMeta', `size.${key}`, undefined)
    return
  }

  // 根据单位决定存储格式
  if (unit === '%') {
    emit('updateMeta', `size.${key}`, `${num}%`)
  } else {
    emit('updateMeta', `size.${key}`, num)
  }
}

// 从 rawNode 读取画布扩展属性
const nodeId = computed(() => props.rawNode?.id || '未生成')
const positionX = computed(() => props.rawNode?.meta?.position?.x?.toString() || '0')
const positionY = computed(() => props.rawNode?.meta?.position?.y?.toString() || '0')

// 宽度/高度的数值部分 (用于 Input 回显)
const width = computed(() => getNumericValue(props.rawNode?.meta?.size?.width))
const height = computed(() => getNumericValue(props.rawNode?.meta?.size?.height))

// 宽度/高度的单位 (用于 Select 回显/更新)
const widthUnit = computed({
  get: () => getUnit(props.rawNode?.meta?.size?.width),
  set: unit => handleUpdateSize('width', getNumericValue(props.rawNode?.meta?.size?.width), unit),
})
const heightUnit = computed({
  get: () => getUnit(props.rawNode?.meta?.size?.height),
  set: unit => handleUpdateSize('height', getNumericValue(props.rawNode?.meta?.size?.height), unit),
})

// Auto 状态计算
const isWidthAuto = computed(() => props.rawNode?.meta?.size?.width === undefined)
const isHeightAuto = computed(() => props.rawNode?.meta?.size?.height === undefined)

const layout = computed(() => props.rawNode?.meta?.layout || 'block')
</script>
