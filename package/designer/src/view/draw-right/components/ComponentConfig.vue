<template>
  <div class="p-6">
    <el-form label-position="top" size="small">
      <el-form-item label="组件类型">
        <el-input :value="selectedComponent.tag" disabled />
      </el-form-item>

      <!-- 动态加载组件特定配置 -->
      <component
        :is="settingComponent"
        :selected-component="selectedComponent"
        @update-prop="updateProp"
        @update-children="updateChildren"
      />
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, h, type Component } from 'vue'
import { ElEmpty, ElText } from 'element-plus'
import type { CanvasComponent } from '@designer/view/draw-center/index.vue'

/**
 * 组件配置面板
 * 根据组件的 tag 和 category 动态加载对应的配置组件
 * 路径规则: draw-config/{category}/setting/{tag}-setting.vue
 */

// Props
interface Props {
  selectedComponent: CanvasComponent
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateProp: [key: string, value: any]
  updateChildren: [value: string]
}>()

/**
 * 使用 import.meta.glob 预加载所有配置组件
 * 这样可以让 Vite 在构建时识别这些模块
 * 注意: import.meta.glob 返回的键是相对于当前文件的路径
 * 当前文件位置: src/view/draw-right/components/ComponentConfig.vue
 * 目标文件位置: src/draw-config/{category}/setting/{tag}-setting.vue
 * 需要向上3级: ../../../
 */
const settingModules = import.meta.glob<{ default: Component }>(
  '../../../draw-config/**/setting/*-setting.vue'
)

/**
 * 创建空状态组件 - 当没有配置组件时显示
 */
const createEmptyComponent = () =>
  h(
    ElEmpty,
    {
      description: '该组件暂无特定配置项',
      imageSize: 80,
    },
    {
      extra: () =>
        h(
          ElText,
          {
            type: 'info',
            size: 'small',
          },
          () => '请在"基础配置"或"高级配置"中进行通用属性设置'
        ),
    }
  )

/**
 * 动态加载组件配置组件
 * 使用 defineAsyncComponent 的完整配置,包含错误处理
 */
const settingComponent = computed<Component>(() => {
  const { tag, category } = props.selectedComponent

  // 如果没有 category 信息,返回空状态组件
  if (!category) {
    return () => createEmptyComponent()
  }

  // 构建配置组件路径 (相对于当前文件,向上3级)
  const settingPath = `../../../draw-config/${category}/setting/${tag}-setting.vue`

  // 查找对应的模块加载器
  const moduleLoader = settingModules[settingPath]

  // 如果找不到模块,返回空状态组件
  if (!moduleLoader) {
    return () => createEmptyComponent()
  }

  // 创建异步组件,使用完整配置
  return defineAsyncComponent({
    // 加载函数
    loader: () =>
      moduleLoader().then(module => {
        if (!module.default) {
          throw new Error(`配置组件缺少默认导出: ${settingPath}`)
        }
        return module.default
      }),
    // 加载中显示的组件
    loadingComponent: () => h('div', { class: 'text-center text-gray-400' }, '加载中...'),
    // 加载失败显示的组件
    errorComponent: () => createEmptyComponent(),
    // 延迟显示加载组件的时间 (ms)
    delay: 200,
    // 超时时间 (ms)
    timeout: 3000,
  })
})

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
