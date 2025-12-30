import { Grid } from '@element-plus/icons-vue'
import type { ComponentConfig } from '@designer/types/componentsTypes'
import { NodeType } from '@designer/ast/types'

/**
 * 卡片组件配置
 * 使用纯 AST 结构作为唯一数据源
 */
export const cardConfig: ComponentConfig = {
  // AST 节点 - 唯一数据源
  astNode: {
    type: NodeType.ELEMENT,
    tag: 'el-card',
    attributes: [
      {
        type: NodeType.ATTRIBUTE,
        name: 'shadow',
        value: 'hover',
      },
    ],
    children: [
      {
        type: NodeType.TEXT,
        content: '卡片内容',
      },
    ],
  },
  // 元数据 - 仅用于 UI 展示
  label: '卡片',
  icon: Grid,
  category: 'high',
}
