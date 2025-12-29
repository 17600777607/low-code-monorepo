/**
 * 代码生成器
 */

import type { ASTNode, ElementNode, TextNode, AttributeNode } from './types'
import { NodeType } from './types'

/**
 * 生成器选项
 */
export interface GeneratorOptions {
  /** 缩进字符串 */
  indent?: string
  /** 是否格式化输出 */
  format?: boolean
}

/**
 * 代码生成器类
 */
export class Generator {
  private options: Required<GeneratorOptions>
  private currentIndent = 0

  constructor(options: GeneratorOptions = {}) {
    this.options = {
      indent: options.indent || '  ',
      format: options.format !== false,
    }
  }

  /**
   * 生成代码
   */
  generate(ast: ASTNode): string {
    return this.generateNode(ast)
  }

  /**
   * 生成节点代码
   */
  private generateNode(node: ASTNode): string {
    switch (node.type) {
      case NodeType.ROOT:
        return this.generateRoot(node)
      case NodeType.ELEMENT:
        return this.generateElement(node)
      case NodeType.TEXT:
        return this.generateText(node)
      case NodeType.ATTRIBUTE:
        return this.generateAttribute(node)
      default:
        return ''
    }
  }

  /**
   * 生成根节点代码
   */
  private generateRoot(node: ASTNode): string {
    if (node.type !== NodeType.ROOT) return ''

    return node.children.map(child => this.generateNode(child)).join('\n')
  }

  /**
   * 生成元素节点代码
   */
  private generateElement(node: ElementNode): string {
    const indent = this.getIndent()
    const { tag, attributes, children, isSelfClosing } = node

    // 生成属性字符串
    const attrsStr = attributes.length
      ? ' ' + attributes.map(attr => this.generateAttribute(attr)).join(' ')
      : ''

    // 自闭合标签
    if (isSelfClosing || children.length === 0) {
      return `${indent}<${tag}${attrsStr} />`
    }

    // 生成子节点
    this.currentIndent++
    const childrenStr = children
      .map(child => this.generateNode(child))
      .join(this.options.format ? '\n' : '')
    this.currentIndent--

    // 单行文本节点优化
    if (children.length === 1 && children[0].type === NodeType.TEXT) {
      return `${indent}<${tag}${attrsStr}>${childrenStr}</${tag}>`
    }

    // 多行格式
    if (this.options.format) {
      return `${indent}<${tag}${attrsStr}>\n${childrenStr}\n${indent}</${tag}>`
    }

    return `${indent}<${tag}${attrsStr}>${childrenStr}</${tag}>`
  }

  /**
   * 生成文本节点代码
   */
  private generateText(node: TextNode): string {
    const indent = this.getIndent()
    return `${indent}${node.content}`
  }

  /**
   * 生成属性节点代码
   */
  private generateAttribute(node: AttributeNode): string {
    const { name, value } = node

    // 布尔属性
    if (typeof value === 'boolean') {
      return value ? name : ''
    }

    // 字符串属性
    return `${name}="${this.escapeAttrValue(String(value))}"`
  }

  /**
   * 获取当前缩进字符串
   */
  private getIndent(): string {
    return this.options.format ? this.options.indent.repeat(this.currentIndent) : ''
  }

  /**
   * 转义属性值
   */
  private escapeAttrValue(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
  }
}

/**
 * 创建代码生成器
 */
export function createGenerator(options?: GeneratorOptions): Generator {
  return new Generator(options)
}
