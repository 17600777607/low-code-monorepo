<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- 左侧：组件库 -->
    <DrawLeft
      :ast-stats="astStats"
      :ast-text="astText"
      @drag-start="handleDragStart"
      @parse-to-a-s-t="parseToAST"
      @generate-code="generateCode"
      @clear-canvas="clearCanvas"
    />

    <!-- 中间：设计面板 -->
    <DrawCenter
      :canvas-components="canvasComponents"
      :selected-index="selectedIndex"
      @drop="handleDrop"
      @select-component="selectComponent"
      @remove-component="removeComponent"
      @clear-canvas="clearCanvas"
    />

    <!-- 右侧：配置面板 -->
    <DrawRight
      :selected-component="selectedComponent"
      :generated-code="generatedCode"
      @update-prop="updateComponentProp"
      @update-children="updateComponentChildren"
      @remove-selected-component="removeSelectedComponent"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import {
  createParser,
  createGenerator,
  countNodes,
  getDepth,
  findAllNodes,
  isElementNode,
  type ComponentConfig,
} from './ast/index'
import DrawLeft from './view/draw-left/index.vue'
import DrawCenter from './view/draw-center/index.vue'
import DrawRight from './view/draw-right/index.vue'
import type { CanvasComponent } from './view/draw-center/index.vue'

/**
 * 组件定义接口
 */
interface ComponentDef {
  tag: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultProps: Record<string, any>
  defaultChildren: string
}

// 画布组件列表
const canvasComponents = ref<CanvasComponent[]>([])
const selectedIndex = ref<number | null>(null)

// 选中的组件
const selectedComponent = computed(() => {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    return canvasComponents.value[selectedIndex.value] || null
  }
  return null
})

// AST 相关状态
const astText = ref('')
const generatedCode = ref('')
const astStats = ref({
  totalNodes: 0,
  depth: 0,
  elementCount: 0,
})

// 拖拽开始
function handleDragStart(event: globalThis.DragEvent, comp: ComponentDef) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('component', JSON.stringify(comp))
  }
}

// 拖拽放置
function handleDrop(event: globalThis.DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    const compData = event.dataTransfer.getData('component')
    if (compData) {
      const comp = JSON.parse(compData) as ComponentDef
      addComponent(comp)
    }
  }
}

// 添加组件到画布
function addComponent(comp: ComponentDef) {
  canvasComponents.value.push({
    tag: comp.tag,
    component: comp.tag,
    props: { ...comp.defaultProps },
    children: comp.defaultChildren || '',
  })
  // 自动选中新添加的组件
  selectedIndex.value = canvasComponents.value.length - 1
}

// 选择组件
function selectComponent(index: number) {
  selectedIndex.value = index
}

// 移除组件
function removeComponent(index: number) {
  canvasComponents.value.splice(index, 1)
  if (selectedIndex.value === index) {
    selectedIndex.value = null
  }
}

// 移除选中的组件
function removeSelectedComponent() {
  if (selectedIndex.value !== null) {
    removeComponent(selectedIndex.value)
  }
}

// 更新组件属性
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function updateComponentProp(key: string, value: any) {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    const component = canvasComponents.value[selectedIndex.value]
    if (component) {
      component.props[key] = value
    }
  }
}

// 更新组件子内容
function updateComponentChildren(value: string) {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    const component = canvasComponents.value[selectedIndex.value]
    if (component) {
      component.children = value
    }
  }
}

// 清空画布
function clearCanvas() {
  canvasComponents.value = []
  selectedIndex.value = null
  generatedCode.value = ''
  astText.value = ''
  astStats.value = {
    totalNodes: 0,
    depth: 0,
    elementCount: 0,
  }
}

// 解析为 AST
function parseToAST() {
  if (canvasComponents.value.length === 0) {
    ElMessage.warning('画布为空，请先添加组件')
    return
  }

  // 转换为 ComponentConfig 格式
  const configs: ComponentConfig[] = canvasComponents.value.map(comp => ({
    tag: comp.tag,
    props: comp.props,
    children: comp.children ? [comp.children] : [],
  }))

  const parser = createParser()
  const ast = parser.parse(configs)

  // 更新 AST 文本
  astText.value = JSON.stringify(ast, null, 2)

  // 更新统计信息
  astStats.value = {
    totalNodes: countNodes(ast),
    depth: getDepth(ast),
    elementCount: findAllNodes(ast, isElementNode).length,
  }

  ElMessage.success('AST 解析成功')
}

// 生成代码
function generateCode() {
  if (canvasComponents.value.length === 0) {
    ElMessage.warning('画布为空，请先添加组件')
    return
  }

  // 转换为 ComponentConfig 格式
  const configs: ComponentConfig[] = canvasComponents.value.map(comp => ({
    tag: comp.tag,
    props: comp.props,
    children: comp.children ? [comp.children] : [],
  }))

  const parser = createParser()
  const ast = parser.parse(configs)

  const generator = createGenerator({ format: true })
  generatedCode.value = generator.generate(ast)

  ElMessage.success('代码生成成功')
}
</script>
