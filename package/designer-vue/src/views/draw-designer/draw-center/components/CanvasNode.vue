<template>
  <div
    :id="`canvas-node-${nodeId}`"
    class="canvas-node"
    :class="{
      'is-container': astNode.meta?.isContainer,
      'is-selected': isSelected,
      'is-drag-over': isDragOver,
    }"
    :style="nodeStyle"
    @click.stop="handleSelect"
    @drop.stop="handleNativeDrop"
    @dragover.prevent.stop="handleNativeDragOver"
    @dragleave.stop="handleNativeDragLeave"
  >
    <!-- 实际渲染的组件 -->
    <component
      :is="resolveComponent(astNode.tag)"
      v-bind="getPropsFromAttributes(astNode.attributes)"
      :style="getLayoutStyle(astNode)"
      class="node-component"
    >
      <!-- 递归渲染子元素节点 -->
      <template v-if="elementChildren.length > 0">
        <CanvasNode
          v-for="child in elementChildren"
          :key="child.id || `child-${Math.random()}`"
          :ast-node="child"
          :selected-id="selectedId"
          :is-parent-flex="isCurrentFlex"
          @select="$emit('select', $event)"
          @update="$emit('update', $event)"
          @drop-into="handleDropIntoChild"
        />
      </template>

      <!-- 渲染文本节点 -->
      <template v-if="textContent">
        {{ textContent }}
      </template>
    </component>

    <!-- 容器的拖放提示 -->
    <div v-if="astNode.meta?.isContainer && isDragOver" class="drop-indicator">
      释放以添加到此容器
    </div>

    <!-- 选中边框 -->
    <div v-if="isSelected" class="selection-border"></div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  onBeforeUnmount,
  defineAsyncComponent,
  type Component,
  watch,
} from 'vue'
import interact from 'interactjs'
import type { ElementNode, TextNode, AttributeNode } from '@designer-vue/ast/types'
import consola from 'consola'

// 组件缓存 - 模块级别,所有实例共享
const componentCache = new Map<string, Component | string>()

interface Props {
  astNode: ElementNode
  selectedId?: string
  isParentFlex?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isParentFlex: false,
})

const emit = defineEmits<{
  select: [id: string]
  update: [node: ElementNode]
  dropInto: [payload: { targetId: string; sourceNode: ElementNode }]
}>()

// 生成唯一节点 ID
const nodeId = computed(() => props.astNode.id || `node-${Math.random().toString(36).substr(2, 9)}`)

// 状态
const isDragOver = ref(false)
const isSelected = computed(() => props.selectedId === nodeId.value)

// 提取子元素节点
const elementChildren = computed(() => {
  return props.astNode.children.filter((child): child is ElementNode => child.type === 'Element')
})

// 提取文本内容
const textContent = computed(() => {
  const textNode = props.astNode.children.find((child): child is TextNode => child.type === 'Text')
  return textNode?.content || ''
})

// 计算节点样式
const nodeStyle = computed(() => {
  const meta = props.astNode.meta
  const sizeStyle = {
    width:
      typeof meta?.size?.width === 'number' ? `${meta.size.width}px` : meta?.size?.width || 'auto',
    height:
      typeof meta?.size?.height === 'number'
        ? `${meta.size.height}px`
        : meta?.size?.height || 'auto',
  }

  // 如果父容器是 Flex 布局，则不由子元素控制绝对定位
  if (props.isParentFlex) {
    return {
      position: 'relative' as const, // 或者 static，视需求而定
      ...sizeStyle,
    }
  }

  // 绝对定位模式（默认）
  if (!meta?.position) return sizeStyle

  return {
    position: 'absolute' as const,
    left: `${meta.position.x}px`,
    top: `${meta.position.y}px`,
    ...sizeStyle,
  }
})

// 获取布局样式
const getLayoutStyle = (node: ElementNode) => {
  const meta = node.meta
  if (!meta) return {}

  const styles: Record<string, string> = {}

  if (meta.layout === 'flex') {
    styles.display = 'flex'
    // 确保 flex 容器有相对定位上下文，以便子元素在即使是 absolute 时也能相对于它定位（如果在混合模式下）
    // 但在纯 flex 模式下，这个 flex 容器也是其父级的 item
    // styles.position = 'relative'

    if (meta.flexProps) {
      if (meta.flexProps.direction) styles.flexDirection = meta.flexProps.direction
      if (meta.flexProps.justify) styles.justifyContent = meta.flexProps.justify
      if (meta.flexProps.align) styles.alignItems = meta.flexProps.align
      if (meta.flexProps.wrap) styles.flexWrap = meta.flexProps.wrap
      if (meta.flexProps.gap !== undefined) styles.gap = `${meta.flexProps.gap}px`
    }
  } else if (meta.layout === 'grid') {
    styles.display = 'grid'
  } else {
    styles.display = 'block'
  }

  return styles
}

// 当前节点是否为 Flex 容器
const isCurrentFlex = computed(() => props.astNode.meta?.layout === 'flex')

// 将 AttributeNode[] 转换为 props 对象
const getPropsFromAttributes = (attributes: AttributeNode[]) => {
  const props: Record<string, string | boolean> = {}
  attributes.forEach(attr => {
    props[attr.name] = attr.value
  })
  return props
}

// Component resolving logic...
const kebabToPascal = (str: string): string => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

const resolveComponent = (tag: string): Component | string => {
  if (componentCache.has(tag)) {
    return componentCache.get(tag)!
  }

  const nativeTags = ['div', 'span', 'p', 'section', 'article', 'header', 'footer']
  if (nativeTags.includes(tag)) {
    componentCache.set(tag, tag)
    return tag
  }

  if (tag.startsWith('el-')) {
    const componentName = kebabToPascal(tag)
    const asyncComponent = defineAsyncComponent(() =>
      import('element-plus')
        .then(module => {
          const comp = module[componentName as keyof typeof module]
          if (!comp) return { template: '<div>组件不存在</div>' }
          return comp as Component
        })
        .catch(_error => {
          return { template: '<div>加载失败</div>' }
        })
    )
    componentCache.set(tag, asyncComponent)
    return asyncComponent
  }

  componentCache.set(tag, 'div')
  return 'div'
}

const handleSelect = () => {
  emit('select', nodeId.value)
}

const handleDropIntoChild = (payload: { targetId: string; sourceNode: ElementNode }) => {
  emit('dropInto', payload)
}

// 原生拖拽处理 (处理侧边栏拖入)
const handleNativeDragOver = (_event: DragEvent) => {
  if (props.astNode.meta?.isContainer) {
    // 允许放置
    isDragOver.value = true
  }
}

const handleNativeDragLeave = (_event: DragEvent) => {
  isDragOver.value = false
}

const handleNativeDrop = (event: DragEvent) => {
  if (!props.astNode.meta?.isContainer) return

  isDragOver.value = false
  const compData = event.dataTransfer?.getData('component')

  if (compData) {
    // 这是一个来自侧边栏的新组件
    try {
      const { astNode } = JSON.parse(compData)
      emit('dropInto', { targetId: nodeId.value, sourceNode: astNode })
    } catch (e) {
      consola.error('Failed to parse dropped component data', e)
    }
  }
}

let interactInstance: ReturnType<typeof interact> | null = null

// 初始化或更新 Interact
const initInteract = () => {
  if (interactInstance) {
    interactInstance.unset()
    interactInstance = null
  }

  // 如果在 Flex 父容器中，禁用绝对定位拖拽（暂时不支持 Flex 排序拖拽）
  if (props.isParentFlex) {
    const element = document.getElementById(`canvas-node-${nodeId.value}`)
    if (!element) return

    // 仍然启用 dropzone 以便可以作为容器接收
    interactInstance = interact(element).dropzone({
      accept: '.canvas-node',
      ondragenter() {
        if (props.astNode.meta?.isContainer) isDragOver.value = true
      },
      ondragleave() {
        isDragOver.value = false
      },
      ondrop(event) {
        isDragOver.value = false
        if (props.astNode.meta?.isContainer) {
          const sourceElement = event.relatedTarget as HTMLElement
          const sourceId = sourceElement?.id?.replace('canvas-node-', '')
          if (sourceId && sourceId !== nodeId.value) {
            consola.log('Drop into container:', nodeId.value, 'from:', sourceId)
          }
        }
      },
    })
    return
  }

  // 绝对定位模式下的拖拽逻辑
  const element = document.getElementById(`canvas-node-${nodeId.value}`)
  if (!element) return

  interactInstance = interact(element)
    .draggable({
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 20, y: 20 })],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }],
        }),
      ],
      listeners: {
        move(event) {
          const { target, dx, dy } = event
          const currentX = parseFloat(target.style.left) || 0
          const currentY = parseFloat(target.style.top) || 0
          const newX = currentX + dx
          const newY = currentY + dy
          target.style.left = `${newX}px`
          target.style.top = `${newY}px`
        },
        end(event) {
          const updatedNode: ElementNode = {
            ...props.astNode,
            meta: {
              ...props.astNode.meta,
              position: {
                x: parseFloat(event.target.style.left),
                y: parseFloat(event.target.style.top),
              },
            },
          }
          emit('update', updatedNode)
        },
      },
    })
    .dropzone({
      accept: '.canvas-node',
      ondragenter() {
        if (props.astNode.meta?.isContainer) {
          isDragOver.value = true
        }
      },
      ondragleave() {
        isDragOver.value = false
      },
      ondrop(event) {
        isDragOver.value = false
        if (props.astNode.meta?.isContainer) {
          const sourceElement = event.relatedTarget as HTMLElement
          const sourceId = sourceElement?.id?.replace('canvas-node-', '')
          if (sourceId && sourceId !== nodeId.value) {
            consola.log('Drop into container:', nodeId.value, 'from:', sourceId)
          }
        }
      },
    })
}

onMounted(() => {
  initInteract()
})

// 监听属性变化重新初始化
watch(() => props.isParentFlex, initInteract)

onBeforeUnmount(() => {
  if (interactInstance) {
    interactInstance.unset()
  }
})
</script>

<style scoped>
.canvas-node {
  position: relative;
  cursor: move;
  transition: all 0.2s ease;
}

.canvas-node.is-container {
  min-width: 100px;
  min-height: 100px;
  border: 2px dashed transparent;
}

.canvas-node.is-container:hover {
  border-color: #e5e7eb;
}

.canvas-node.is-drag-over {
  border-color: #3b82f6 !important;
  background-color: rgba(59, 130, 246, 0.05);
}

.canvas-node.is-selected {
  z-index: 1000;
}

.selection-border {
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border: 2px solid #3b82f6;
  pointer-events: none;
  border-radius: 4px;
}

.drop-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(59, 130, 246, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  pointer-events: none;
  z-index: 10;
}

.node-component {
  width: 100%;
  height: 100%;
}

:deep(.el-card) {
  display: flex;
  flex-direction: column;
}

:deep(.el-card__body) {
  position: relative;
  flex: 1;
  box-sizing: border-box;
  /* 确保子元素绝对定位是相对于 body */
}
</style>
