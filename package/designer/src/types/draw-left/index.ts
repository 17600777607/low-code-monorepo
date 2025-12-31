/**
 * draw-left 相关类型定义
 */

/**
 * AST 统计信息接口
 */
export interface ASTStats {
  /** AST 节点总数 */
  totalNodes: number
  /** AST 树深度 */
  depth: number
  /** 元素节点数量 */
  elementCount: number
}
