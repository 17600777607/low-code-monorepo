import type { Component } from 'vue'
import type { ElementNode } from '@designer/ast/types'

/**
 * 组件配置接口 - ATS (AST-Transform-Schema) 结构
 *
 * ATS 设计原则:
 * 1. AST ElementNode 作为唯一数据源 (Single Source of Truth)
 * 2. 左侧组件库、中间画布、右侧配置面板共享同一 AST 数据流
 * 3. 所有组件属性和状态都存储在 AST 结构中
 * 4. 元数据(label、icon)仅用于 UI 展示,不影响数据结构
 */
export interface ComponentConfig {
  /** AST 节点 - 唯一数据源 */
  astNode: ElementNode
  /** 组件显示标签 - 仅用于组件库展示 */
  label: string
  /** 组件图标 - 仅用于组件库展示 */
  icon: Component
  /** 组件归属分类 - 用于动态加载配置组件 */
  category?: 'basic' | 'high' | 'business'
}

/**
 * 组件分类接口
 */
export interface ComponentCategory {
  /** 分类名称 */
  name: string
  /** 分类显示标签 */
  label: string
  /** 分类下的组件列表 */
  components: ComponentConfig[]
}
