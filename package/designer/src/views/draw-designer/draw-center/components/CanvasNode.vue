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
} from 'vue'
import interact from 'interactjs'
import type { ElementNode, TextNode, AttributeNode } from '@designer/ast/types'
import consola from 'consola'

// 组件缓存 - 模块级别,所有实例共享
const componentCache = new Map<string, Component | string>()

interface Props {
  astNode: ElementNode
  selectedId?: string
}

const props = defineProps<Props>()

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

// 计算节点样式（绝对定位）
const nodeStyle = computed(() => {
  const meta = props.astNode.meta
  if (!meta?.position) return {}

  return {
    position: 'absolute' as const,
    left: `${meta.position.x}px`,
    top: `${meta.position.y}px`,
    width:
      typeof meta.size?.width === 'number' ? `${meta.size.width}px` : meta.size?.width || 'auto',
    height:
      typeof meta.size?.height === 'number' ? `${meta.size.height}px` : meta.size?.height || 'auto',
  }
})

// 获取布局样式
const getLayoutStyle = (node: ElementNode) => {
  const meta = node.meta
  if (!meta) return {}

  const styles: Record<string, string> = {}

  if (meta.layout === 'flex') {
    styles.display = 'flex'
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

// 将 AttributeNode[] 转换为 props 对象
const getPropsFromAttributes = (attributes: AttributeNode[]) => {
  const props: Record<string, string | boolean> = {}
  attributes.forEach(attr => {
    props[attr.name] = attr.value
  })
  return props
}

// 组件缓存已移至模块级别

/**
 * 将 kebab-case 转换为 PascalCase
 * el-button -> ElButton
 */
const kebabToPascal = (str: string): string => {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * 动态解析组件
 */
const resolveComponent = (tag: string): Component | string => {
  // 检查缓存
  if (componentCache.has(tag)) {
    return componentCache.get(tag)!
  }

  // 原生 HTML 标签
  const nativeTags = ['div', 'span', 'p', 'section', 'article', 'header', 'footer']
  if (nativeTags.includes(tag)) {
    componentCache.set(tag, tag)
    return tag
  }

  // Element Plus 组件
  if (tag.startsWith('el-')) {
    const componentName = kebabToPascal(tag)

    // 使用异步组件动态导入
    const asyncComponent = defineAsyncComponent(() =>
      import('element-plus')
        .then(module => {
          const comp = module[componentName as keyof typeof module]
          if (!comp) {
            return { template: '<div>组件不存在</div>' }
          }
          return comp as Component
        })
        .catch(_error => {
          return { template: '<div>加载失败</div>' }
        })
    )

    componentCache.set(tag, asyncComponent)
    return asyncComponent
  }

  // 默认返回 div
  componentCache.set(tag, 'div')
  return 'div'
}

// 选中节点
const handleSelect = () => {
  emit('select', nodeId.value)
}

// 处理拖入子容器
const handleDropIntoChild = (payload: { targetId: string; sourceNode: ElementNode }) => {
  emit('dropInto', payload)
}

// 初始化拖拽
let interactInstance: ReturnType<typeof interact> | null = null

onMounted(() => {
  const element = document.getElementById(`canvas-node-${nodeId.value}`)
  if (!element) return

  interactInstance = interact(element)
    .draggable({
      // 网格吸附
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
          // 更新 AST 节点位置
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
          // 触发嵌套事件
          const sourceElement = event.relatedTarget as HTMLElement
          const sourceId = sourceElement?.id?.replace('canvas-node-', '')
          if (sourceId && sourceId !== nodeId.value) {
            // 这里需要从外部传入完整的 sourceNode
            // 暂时先触发事件，具体逻辑在父组件处理
            consola.log('Drop into container:', nodeId.value, 'from:', sourceId)
          }
        }
      },
    })
})

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
</style>
