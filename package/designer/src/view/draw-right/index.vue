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
          />
        </el-tab-pane>

        <!-- 组件配置 Tab -->
        <el-tab-pane label="组件配置" name="component">
          <ComponentConfig
            :selected-component="selectedComponent"
            @update-prop="handleUpdateProp"
            @update-children="handleUpdateChildren"
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
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BasicConfig from './components/BasicConfig.vue'
import ComponentConfig from './components/ComponentConfig.vue'
import AdvancedConfig from './components/AdvancedConfig.vue'
import type { CanvasComponent } from '@designer/types/draw-center'

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
