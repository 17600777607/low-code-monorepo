/**
 * AST 模块入口
 */

// 导出类型定义
export * from './types'

// 导出解析器
export { Parser, createParser } from './parser'
export type { ComponentConfig } from './parser'

// 导出代码生成器
export { Generator, createGenerator } from './generator'
export type { GeneratorOptions } from './generator'

// 导出工具函数
export * from './utils'
