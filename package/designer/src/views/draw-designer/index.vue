<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <DrawHeader @go-back="handleGoBack" @clear-canvas="handleClearCanvas" />
    <div class="flex h-screen overflow-hidden bg-gray-50">
      <!-- 左侧：组件库 -->
      <DrawLeft :ast-stats="astStats" :ast-text="astText" @drag-start="handleDragStart" />

      <!-- 中间：设计面板 -->
      <!-- 中间：设计面板 -->
      <DrawCenter
        :canvas-components="canvasComponents"
        :selected-index="selectedIndex"
        @drop="handleDrop"
        @drop-into="handleDropInto"
        @select-component="selectComponent"
        @update-component="updateComponent"
        @remove-component="removeComponent"
      />

      <!-- 右侧：配置面板 -->
      <DrawRight
        :selected-component="selectedComponent"
        :generated-code="generatedCode"
        @update-prop="updateComponentProp"
        @update-meta="updateComponentMeta"
        @update-children="updateComponentChildren"
        @remove-selected-component="removeSelectedComponent"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DrawHeader from './components/draw-header.vue'
import { ref, computed, watch } from 'vue'
import { countNodes, getDepth, findAllNodes, isElementNode } from '@designer/ast/index'
import type { ComponentConfig } from '@designer/types/componentsTypes'
import type { ElementNode } from '@designer/ast/types'
import { NodeType } from '@designer/ast/types'
import DrawLeft from '@designer/views/draw-designer/draw-left/index.vue'
import DrawCenter from '@designer/views/draw-designer/draw-center/index.vue'
import DrawRight from '@designer/views/draw-designer/draw-right/index.vue'
import { useRouter } from 'vue-router'

// 画布组件列表 - 使用 ElementNode 类型
const canvasComponents = ref<ElementNode[]>([])
const selectedIndex = ref<number | null>(null)
const router = useRouter()
const handleGoBack = () => {
  router.push('/')
}

// 生成唯一 ID
const generateId = (tag: string) => {
  return `${tag}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// 选中的组件
const selectedComponent = computed(() => {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    return canvasComponents.value[selectedIndex.value]
  }
  return undefined
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

    // 构建完整的 AST (包含所有扩展属性)
    const ast: import('@designer/ast/types').RootNode = {
      type: NodeType.ROOT,
      children: newComponents, // 直接使用完整的 ElementNode,保留 id 和 meta
    }

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
const handleDragStart = (event: globalThis.DragEvent, comp: ComponentConfig) => {
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
const handleDrop = (event: globalThis.DragEvent) => {
  event.preventDefault()
  if (event.dataTransfer) {
    const compData = event.dataTransfer.getData('component')
    if (compData) {
      const { astNode, category } = JSON.parse(compData)

      // 获取鼠标位置 (相对于画布)
      const dropTarget = event.currentTarget as HTMLElement
      const rect = dropTarget.getBoundingClientRect()
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      }

      addComponent(astNode, category, position)
    }
  }
}

// 递归查找节点
const findNodeById = (nodes: ElementNode[], id: string): ElementNode | null => {
  for (const node of nodes) {
    if (node.id === id) {
      return node
    }
    const children =
      node.children?.filter((c): c is ElementNode => c.type === NodeType.ELEMENT) || []
    if (children.length > 0) {
      const found = findNodeById(children, id)
      if (found) return found
    }
  }
  return null
}

// 处理放入容器
const handleDropInto = (payload: { targetId: string; sourceNode: ElementNode }) => {
  const { targetId, sourceNode } = payload
  const targetNode = findNodeById(canvasComponents.value, targetId)

  if (targetNode) {
    // 创建新节点
    const newNode: ElementNode = {
      ...sourceNode,
      id: generateId(sourceNode.tag),
      meta: {
        ...sourceNode.meta,
        position: { x: 20, y: 20 }, // 默认相对位置
        layout: 'block',
      },
    }

    if (!targetNode.children) {
      targetNode.children = []
    }

    targetNode.children.push(newNode)

    // 可能需要重新计算 AST
    canvasComponents.value = [...canvasComponents.value]
  }
}

// 添加组件到画布 - 使用 AST ElementNode
const addComponent = (
  astNode: ElementNode,
  category?: 'basic' | 'high' | 'business',
  position?: { x: number; y: number }
) => {
  // 创建新的 ElementNode,只添加 id、position 和 category
  const newNode: ElementNode = {
    ...astNode,
    id: generateId(astNode.tag),
    meta: {
      ...astNode.meta, // 使用组件配置中的默认 meta
      position: position || {
        x: 100, // 如果没有指定位置,使用默认值
        y: 100,
      },
      category, // 保存组件分类信息
    },
  }

  canvasComponents.value.push(newNode)
  // 自动选中新添加的组件
  selectedIndex.value = canvasComponents.value.length - 1
}

// 选择组件 - 支持 ID 或索引
const selectComponent = (idOrIndex: string | number) => {
  if (typeof idOrIndex === 'string') {
    // 通过 ID 查找索引
    const index = canvasComponents.value.findIndex(comp => comp.id === idOrIndex)
    if (index !== -1) {
      selectedIndex.value = index
    }
  } else {
    selectedIndex.value = idOrIndex
  }
}

// 更新组件
const updateComponent = (updatedNode: ElementNode) => {
  const index = canvasComponents.value.findIndex(comp => comp.id === updatedNode.id)
  if (index !== -1) {
    canvasComponents.value[index] = updatedNode
  }
}

// 移除组件 - 支持 ID 或索引
const removeComponent = (idOrIndex: string | number) => {
  let index: number
  if (typeof idOrIndex === 'string') {
    index = canvasComponents.value.findIndex(comp => comp.id === idOrIndex)
  } else {
    index = idOrIndex
  }

  if (index !== -1) {
    canvasComponents.value.splice(index, 1)
    if (selectedIndex.value === index) {
      selectedIndex.value = null
    }
  }
}

// 移除选中的组件
const removeSelectedComponent = () => {
  if (selectedIndex.value !== null) {
    removeComponent(selectedIndex.value)
  }
}

// 更新组件属性 - 适配 ElementNode.attributes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateComponentProp = (key: string, value: any) => {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    const component = canvasComponents.value[selectedIndex.value]
    if (component) {
      // 查找是否已存在该属性
      const attrIndex = component.attributes?.findIndex(attr => attr.name === key) ?? -1

      if (attrIndex !== -1 && component.attributes) {
        // 更新已存在的属性
        component.attributes[attrIndex].value = value
      } else {
        // 添加新属性
        if (!component.attributes) {
          component.attributes = []
        }
        component.attributes.push({
          type: NodeType.ATTRIBUTE,
          name: key,
          value,
        })
      }
    }
  }
}

// 更新组件 Meta 信息
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateComponentMeta = (key: string, value: any) => {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    const component = canvasComponents.value[selectedIndex.value]
    if (component) {
      if (!component.meta) {
        component.meta = {}
      }

      // 处理嵌套路径 (e.g. "size.width")
      const keys = key.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let target: any = component.meta

      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) {
          target[keys[i]] = {}
        }
        target = target[keys[i]]
      }

      target[keys[keys.length - 1]] = value
    }
  }
}

// 更新组件子内容 - 适配 ElementNode.children
const updateComponentChildren = (value: string) => {
  if (
    selectedIndex.value !== null &&
    selectedIndex.value >= 0 &&
    selectedIndex.value < canvasComponents.value.length
  ) {
    const component = canvasComponents.value[selectedIndex.value]
    if (component) {
      // 查找文本节点
      const textNodeIndex =
        component.children?.findIndex(child => child.type === NodeType.TEXT) ?? -1

      if (textNodeIndex !== -1 && component.children) {
        // 更新已存在的文本节点
        const textNode = component.children[textNodeIndex]
        if (textNode && 'content' in textNode) {
          textNode.content = value
        }
      } else {
        // 添加新的文本节点
        if (!component.children) {
          component.children = []
        }
        component.children.push({
          type: NodeType.TEXT,
          content: value,
        })
      }
    }
  }
}

// 清空画布
const handleClearCanvas = () => {
  canvasComponents.value = []
  selectedIndex.value = null
  generatedCode.value = ''
  // AST 会通过 watch 自动清空
}
</script>
