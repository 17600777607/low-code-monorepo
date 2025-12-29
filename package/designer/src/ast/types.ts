/**
 * AST 节点类型定义
 */

/**
 * 节点类型枚举
 */

// @ts-expect-error
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
  /** 标签名 */
  tag: string
  /** 属性列表 */
  attributes: AttributeNode[]
  /** 子节点列表 */
  children: ASTNode[]
  /** 是否自闭合标签 */
  isSelfClosing?: boolean
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
