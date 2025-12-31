/**
 * AST 节点类型定义
 */

/**
 * 节点类型枚举
 */

export enum NodeType {
  /** 根节点 */
  ROOT = 'Root',
  /** 元素节点 */
  ELEMENT = 'Element',
  /** 文本节点 */
  TEXT = 'Text',
  /** 属性节点 */
  ATTRIBUTE = 'Attribute',
}

/**
 * 基础节点接口
 */
export interface BaseNode {
  /** 节点类型 */
  type: NodeType
}

/**
 * 根节点
 */
export interface RootNode extends BaseNode {
  type: NodeType.ROOT
  /** 子节点列表 */
  children: ASTNode[]
}

/**
 * 元素节点
 */
export interface ElementNode extends BaseNode {
  type: NodeType.ELEMENT
  /** 节点唯一标识 - 用于画布拖拽和选中 */
  id?: string
  /** 标签名 */
  tag: string
  /** 属性列表 */
  attributes: AttributeNode[]
  /** 子节点列表 */
  children: ASTNode[]
  /** 是否自闭合标签 */
  isSelfClosing?: boolean
  /** 画布元数据 - 用于可视化编辑 */
  meta?: {
    /** 画布位置 */
    position?: { x: number; y: number }
    /** 尺寸 */
    size?: { width?: number | string; height?: number | string }
    /** 布局模式 */
    layout?: 'flex' | 'block' | 'grid'
    /** 是否可作为容器(可接收子组件) */
    isContainer?: boolean
    /** 组件分类 */
    category?: 'basic' | 'high' | 'business'
    /** flex 容器属性 */
    flexProps?: {
      direction?: 'row' | 'column'
      justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'
      align?: 'flex-start' | 'center' | 'flex-end' | 'stretch'
      wrap?: 'nowrap' | 'wrap'
      gap?: number
    }
  }
}

/**
 * 文本节点
 */
export interface TextNode extends BaseNode {
  type: NodeType.TEXT
  /** 文本内容 */
  content: string
}

/**
 * 属性节点
 */
export interface AttributeNode extends BaseNode {
  type: NodeType.ATTRIBUTE
  /** 属性名 */
  name: string
  /** 属性值 */
  value: string | boolean
}

/**
 * AST 节点联合类型
 */
export type ASTNode = RootNode | ElementNode | TextNode | AttributeNode
