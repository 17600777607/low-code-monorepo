/**
 * AST 工具函数
 */

import type { ASTNode, ElementNode, TextNode } from './types'
import { NodeType } from './types'

/**
 * 判断是否为元素节点
 */
export function isElementNode(node: ASTNode): node is ElementNode {
  return node.type === NodeType.ELEMENT
}

/**
 * 判断是否为文本节点
 */
export function isTextNode(node: ASTNode): node is TextNode {
  return node.type === NodeType.TEXT
}

/**
 * 查找节点
 */
export function findNode(ast: ASTNode, predicate: (node: ASTNode) => boolean): ASTNode | undefined {
  if (predicate(ast)) {
    return ast
  }

  if ('children' in ast && ast.children) {
    for (const child of ast.children) {
      const found = findNode(child, predicate)
      if (found) {
        return found
      }
    }
  }

  return undefined
}

/**
 * 查找所有匹配的节点
 */
export function findAllNodes(ast: ASTNode, predicate: (node: ASTNode) => boolean): ASTNode[] {
  const results: ASTNode[] = []

  if (predicate(ast)) {
    results.push(ast)
  }

  if ('children' in ast && ast.children) {
    for (const child of ast.children) {
      results.push(...findAllNodes(child, predicate))
    }
  }

  return results
}

/**
 * 统计节点数量
 */
export function countNodes(ast: ASTNode): number {
  let count = 1

  if ('children' in ast && ast.children) {
    for (const child of ast.children) {
      count += countNodes(child)
    }
  }

  return count
}

/**
 * 获取节点深度
 */
export function getDepth(ast: ASTNode): number {
  if (!('children' in ast) || !ast.children || ast.children.length === 0) {
    return 1
  }

  return 1 + Math.max(...ast.children.map(child => getDepth(child)))
}
