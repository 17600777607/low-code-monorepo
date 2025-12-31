import { Edit } from '@element-plus/icons-vue'
import type { ComponentConfig } from '@designer-vue/types/componentsTypes'
import { NodeType } from '@designer-vue/ast/types'

/**
 * 按钮组件配置
 * 使用纯 AST 结构作为唯一数据源
 */
export const buttonConfig: ComponentConfig = {
  // AST 节点 - 唯一数据源
  astNode: {
    type: NodeType.ELEMENT,
    tag: 'el-button',
    attributes: [
      {
        type: NodeType.ATTRIBUTE,
        name: 'type',
        value: 'primary',
      },
      {
        type: NodeType.ATTRIBUTE,
        name: 'size',
        value: 'default',
      },
      {
        type: NodeType.ATTRIBUTE,
        name: 'disabled',
        value: false,
      },
    ],
    children: [
      {
        type: NodeType.TEXT,
        content: '按钮',
      },
    ],
    // 默认 meta 配置
    meta: {
      size: {
        width: undefined,
        height: undefined,
      },
      layout: 'block',
      isContainer: false,
    },
  },
  // 元数据 - 仅用于 UI 展示
  label: '按钮',
  icon: Edit,
  category: 'basic',
}
