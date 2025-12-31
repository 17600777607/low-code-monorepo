/**
 * draw-center 相关类型定义
 */

/**
 * 画布组件接口
 */
export interface CanvasComponent {
  /** 组件标签名 */
  tag: string
  /** 组件名称 */
  component: string
  /** 组件属性 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>
  /** 组件子内容 */
  children: string
  /** 组件归属分类 - 用于动态加载配置组件 */
  category?: 'basic' | 'high' | 'business'
}
