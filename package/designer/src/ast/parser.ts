/**
 * AST 解析器
 */

import type { RootNode, ElementNode, TextNode, AttributeNode } from './types'
import { NodeType } from './types'

/**
 * 组件配置接口
 */
export interface ComponentConfig {
  /** 组件标签名 */
  tag: string
  /** 组件属性 */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props?: Record<string, any>
  /** 子组件或文本内容 */
  children?: (ComponentConfig | string)[]
  /** 是否自闭合 */
  isSelfClosing?: boolean
}

/**
 * AST 解析器类
 */
export class Parser {
  /**
   * 解析组件配置为 AST
   */
  parse(config: ComponentConfig | ComponentConfig[]): RootNode {
    const children = Array.isArray(config)
      ? config.map(item => this.parseElement(item))
      : [this.parseElement(config)]

    return {
      type: NodeType.ROOT,
      children,
    }
  }

  /**
   * 解析元素节点
   */
  private parseElement(config: ComponentConfig): ElementNode {
    const attributes = this.parseAttributes(config.props || {})
    const children = this.parseChildren(config.children || [])

    return {
      type: NodeType.ELEMENT,
      tag: config.tag,
      attributes,
      children,
      isSelfClosing: config.isSelfClosing,
    }
  }

  /**
   * 解析属性列表
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private parseAttributes(props: Record<string, any>): AttributeNode[] {
    return Object.entries(props).map(([name, value]) => ({
      type: NodeType.ATTRIBUTE,
      name,
      value,
    }))
  }

  /**
   * 解析子节点列表
   */
  private parseChildren(children: (ComponentConfig | string)[]): (ElementNode | TextNode)[] {
    return children.map(child => {
      if (typeof child === 'string') {
        return this.parseText(child)
      }
      return this.parseElement(child)
    })
  }

  /**
   * 解析文本节点
   */
  private parseText(content: string): TextNode {
    return {
      type: NodeType.TEXT,
      content,
    }
  }
}

/**
 * 创建解析器实例
 */
export function createParser(): Parser {
  return new Parser()
}
