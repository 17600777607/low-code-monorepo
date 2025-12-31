import { Edit } from '@element-plus/icons-vue'
import type { ComponentConfig } from '@designer/types/componentsTypes'
import { NodeType } from '@designer/ast/types'

/**
 * 输入框组件配置
 * 使用纯 AST 结构作为唯一数据源
 */
export const inputConfig: ComponentConfig = {
  // AST 节点 - 唯一数据源
  astNode: {
    type: NodeType.ELEMENT,
    tag: 'el-input',
    attributes: [
      {
        type: NodeType.ATTRIBUTE,
        name: 'type',
        value: 'text',
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
      {
        type: NodeType.ATTRIBUTE,
        name: 'clearable',
        value: false,
      },
      {
        type: NodeType.ATTRIBUTE,
        name: 'placeholder',
        value: '请输入',
      },
      {
        type: NodeType.ATTRIBUTE,
        name: 'model-value',
        value: '',
      },
    ],
    children: [
      {
        type: NodeType.TEXT,
        content: '输入框',
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
  label: '输入框',
  icon: Edit,
  category: 'basic',
}
