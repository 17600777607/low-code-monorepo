import type { ComponentCategory } from '@designer/types/componentsTypes'
import { basicCategory } from './basic'
import { highCategory } from './high'
import { businessCategory } from './business'
// 基础组件  element-plus
// 配置项来源于  /draw-config/basic/index.ts 统一导出
// /draw-config/basic/index.ts 动态加载 当前目录下  xConfig.ts 的内容

// 高阶组件  基于 element-plus 二次封装  /components/high/index.ts
// 配置项来源于  /draw-config/high/index.ts 统一导出
// /draw-config/high/index.ts 动态加载 当前目录下  xConfig.ts 的内容

// 业务组件  自定义组件  /components/business/index.ts
// 配置项来源于  /draw-config/business/index.ts 统一导出
// /draw-config/business/index.ts 动态加载 当前目录下  xConfig.ts 的内容

/**
 * 所有组件分类配置
 */
export const componentCategories: ComponentCategory[] = [
  basicCategory,
  highCategory,
  businessCategory,
]
