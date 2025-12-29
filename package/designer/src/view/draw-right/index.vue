<template>
  <aside class="flex w-80 flex-col overflow-hidden border-l border-gray-200 bg-white">
    <!-- 配置内容 -->
    <div v-if="selectedComponent" class="flex flex-1 flex-col overflow-hidden">
      <el-tabs v-model="activeTab" class="flex flex-1 flex-col" stretch>
        <!-- 基础配置 Tab -->
        <el-tab-pane label="基础配置" name="basic">
          <BasicConfig
            :selected-component="selectedComponent"
            @update-prop="handleUpdateProp"
            @update-children="handleUpdateChildren"
            @remove-selected-component="handleRemoveSelectedComponent"
          />
        </el-tab-pane>

        <!-- 高级配置 Tab -->
        <el-tab-pane label="高级配置" name="advanced">
          <AdvancedConfig :selected-component="selectedComponent" @update-prop="handleUpdateProp" />
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 空状态 -->
    <div v-else class="flex flex-1 items-center justify-center">
      <el-empty description="请在画布中选择一个组件" :image-size="100" />
    </div>

    <!-- 生成的代码预览 -->
    <div v-if="generatedCode" class="border-t border-gray-200 px-6 py-4">
      <el-divider content-position="left">生成的代码</el-divider>
      <el-scrollbar height="200px">
        <pre
          class="mt-2 mb-0 overflow-x-auto rounded bg-gray-800 p-3 text-xs leading-relaxed text-gray-300"
          >{{ generatedCode }}</pre
        >
      </el-scrollbar>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BasicConfig, AdvancedConfig } from './components'
import type { CanvasComponent } from '../draw-center/index.vue'

// Props
interface Props {
  selectedComponent: CanvasComponent | null
  generatedCode: string
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProp: [key: string, value: any]
  updateChildren: [value: string]
  removeSelectedComponent: []
}>()

// Tab 状态
const activeTab = ref('basic')

// 更新属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleUpdateProp(key: string, value: any) {
  emit('updateProp', key, value)
}

// 更新子内容
function handleUpdateChildren(value: string) {
  emit('updateChildren', value)
}

// 删除选中的组件
function handleRemoveSelectedComponent() {
  emit('removeSelectedComponent')
}
</script>

<style scoped>
:deep(.el-tabs) {
  display: flex;
  flex-direction: column;
  height: 100%;
}

:deep(.el-tabs__header) {
  margin: 0;
  padding-top: 22px;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow-y: auto;
}

:deep(.el-tab-pane) {
  height: 100%;
}
</style>
