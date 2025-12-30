<template>
  <div class="flex h-screen overflow-hidden bg-gray-50">
    <!-- 左侧：组件库 -->
    <DrawLeft :ast-stats="astStats" :ast-text="astText" @drag-start="handleDragStart" />

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
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  createParser,
  createGenerator,
  countNodes,
  getDepth,
  findAllNodes,
  isElementNode,
} from './ast/index'
import type { ComponentConfig } from './types/componentsTypes'
import type { ElementNode } from './ast/types'
import { NodeType } from './ast/types'
import DrawLeft from './view/draw-left/index.vue'
import DrawCenter from './view/draw-center/index.vue'
import DrawRight from './view/draw-right/index.vue'
import type { CanvasComponent } from './view/draw-center/index.vue'

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

/**
 * 实时更新 AST
 * 监听画布组件变化,自动解析并更新 AST 结构
 */
watch(
  canvasComponents,
  newComponents => {
    if (newComponents.length === 0) {
      // 画布为空时清空 AST
      astText.value = ''
      astStats.value = {
        totalNodes: 0,
        depth: 0,
        elementCount: 0,
      }
      return
    }

    // 转换为 AST Parser 需要的格式
    const configs = newComponents.map(comp => ({
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
  },
  { deep: true }
)

// 拖拽开始
function handleDragStart(event: globalThis.DragEvent, comp: ComponentConfig) {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    // 传输 AST 节点数据和 category 信息
    event.dataTransfer.setData(
      'component',
      JSON.stringify({
        astNode: comp.astNode,
        category: comp.category,
      })
    )
  }
}

// 拖拽放置
function handleDrop(event: globalThis.DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    const compData = event.dataTransfer.getData('component')
    if (compData) {
      const { astNode, category } = JSON.parse(compData)
      addComponent(astNode, category)
    }
  }
}

// 添加组件到画布 - 使用 AST 结构
function addComponent(astNode: ElementNode, category?: 'basic' | 'high' | 'business') {
  // 从 AST 节点提取数据
  const tag = astNode.tag
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const props: Record<string, any> = {}

  // 从 attributes 转换为 props
  astNode.attributes?.forEach(attr => {
    props[attr.name] = attr.value
  })

  // 提取文本内容
  const textChild = astNode.children?.find(child => child.type === NodeType.TEXT)
  const children = textChild && 'content' in textChild ? textChild.content : ''

  canvasComponents.value.push({
    tag,
    component: tag,
    props,
    children,
    category,
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
  // AST 会通过 watch 自动清空
}

// 生成代码
function generateCode() {
  if (canvasComponents.value.length === 0) {
    ElMessage.warning('画布为空，请先添加组件')
    return
  }

  // 转换为 AST Parser 需要的 ComponentConfig 格式
  const configs = canvasComponents.value.map(comp => ({
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
